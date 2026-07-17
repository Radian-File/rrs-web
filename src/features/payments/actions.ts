"use server";

import { randomBytes } from "node:crypto";
import Decimal from "decimal.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClient, requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { createSnapTransaction } from "@/lib/payments/midtrans";
import { toMidtransAmount } from "@/lib/money";
import { markPaymentPaid } from "@/features/payments/reconcile";
import { enqueueNotification } from "@/features/notifications/service";
import { removePrivateFile, storePrivateFile, type StoredFile } from "@/lib/storage/local";
import { assertRequestRateLimit } from "@/lib/security/rate-limit";

export type PaymentReviewState = { status: "idle" | "success" | "error"; message?: string };

export async function createMidtransPaymentAction(formData: FormData) {
  const user = await requireClient();
  await assertRequestRateLimit("midtrans-create", 5, 10 * 60 * 1000, user.id);
  const invoiceId = z.string().parse(formData.get("invoiceId"));
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, clientId: user.id }, include: { client: true, project: true } });
  if (!invoice || ["PAID", "VOID", "REFUNDED"].includes(invoice.status)) throw new Error("Invoice is not payable.");
  const outstanding = new Decimal(invoice.total.toString()).minus(invoice.paidAmount.toString());
  if (!outstanding.isPositive()) throw new Error("Invoice has no outstanding amount.");
  const existing = await prisma.paymentAttempt.findFirst({ where: { invoiceId, provider: "MIDTRANS", status: { in: ["PENDING", "PROCESSING"] } }, orderBy: { createdAt: "desc" } });
  if (existing?.checkoutUrl) redirect(`/client/invoices/${invoiceId}?payment=${existing.id}`);

  const providerOrderId = `${invoice.invoiceNumber}-${Date.now()}-${randomBytes(3).toString("hex")}`;
  const attempt = await prisma.paymentAttempt.create({ data: { invoiceId, projectId: invoice.projectId, clientId: user.id, provider: "MIDTRANS", status: "PENDING", amount: outstanding.toFixed(2), providerOrderId } });
  try {
    const amount = toMidtransAmount(outstanding);
    const snap = await createSnapTransaction({ orderId: providerOrderId, grossAmount: amount, customer: { firstName: invoice.client.name, email: invoice.client.email, phone: invoice.client.whatsappNumber ?? undefined }, item: { id: invoice.invoiceNumber, name: `${invoice.project.title} — ${invoice.invoiceNumber}`, price: amount, quantity: 1 } });
    await prisma.paymentAttempt.update({ where: { id: attempt.id }, data: { status: "PROCESSING", snapToken: snap.token, checkoutUrl: snap.redirect_url, providerStatus: "pending" } });
    redirect(`/client/invoices/${invoiceId}?payment=${attempt.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    await prisma.paymentAttempt.update({ where: { id: attempt.id }, data: { status: "FAILED", providerStatus: "snap_error" } });
    throw error;
  }
}

export async function submitManualPaymentAction(formData: FormData) {
  const user = await requireClient();
  await assertRequestRateLimit("manual-payment", 5, 30 * 60 * 1000, user.id);
  const invoiceId = z.string().parse(formData.get("invoiceId"));
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, clientId: user.id } });
  if (!invoice || ["PAID", "VOID", "REFUNDED"].includes(invoice.status)) throw new Error("Invoice is not payable.");
  const outstanding = new Decimal(invoice.total.toString()).minus(invoice.paidAmount.toString());
  const file = formData.get("proof");
  if (!(file instanceof File) || file.size === 0) throw new Error("Payment proof is required.");
  let stored: StoredFile | undefined;
  try {
    stored = await storePrivateFile(file, `payments/${invoice.id}`);
    await prisma.$transaction(async (tx) => {
      const attempt = await tx.paymentAttempt.create({ data: { invoiceId: invoice.id, projectId: invoice.projectId, clientId: user.id, provider: "MANUAL", status: "PROCESSING", manualStatus: "UNDER_VERIFICATION", amount: outstanding.toFixed(2), submittedAt: new Date(), files: { create: { uploaderId: user.id, type: "PAYMENT_PROOF", ...stored! } } } });
      const owner = await tx.user.findFirst({ where: { role: "OWNER" }, select: { id: true } });
      if (owner) await enqueueNotification(tx, { userId: owner.id, type: "PAYMENT_UPDATED", title: "Manual payment needs verification", message: `A client submitted proof for ${invoice.invoiceNumber}.`, href: `/owner/payments?payment=${attempt.id}` });
    });
    revalidatePath(`/client/invoices/${invoice.id}`);
  } catch (error) {
    if (stored) await removePrivateFile(stored.storageKey);
    throw error;
  }
}

export async function verifyManualPaymentFormAction(_: PaymentReviewState, formData: FormData): Promise<PaymentReviewState> {
  try {
    const owner = await requireOwner();
    const paymentId = z.string().parse(formData.get("paymentId"));
    await prisma.$transaction(async (tx) => {
      const payment = await tx.paymentAttempt.findUniqueOrThrow({ where: { id: paymentId } });
      if (payment.provider !== "MANUAL" || payment.manualStatus !== "UNDER_VERIFICATION") throw new Error("Payment is not awaiting manual verification.");
      await tx.paymentAttempt.update({ where: { id: payment.id }, data: { verifiedBy: owner.id } });
      await markPaymentPaid(tx, payment.id, { providerStatus: "verified" });
      await tx.auditLog.create({ data: { userId: owner.id, action: "MANUAL_PAYMENT_VERIFIED", entityType: "PaymentAttempt", entityId: payment.id } });
    });
    revalidatePaymentViews();
    return { status: "success", message: "Payment verified. Invoice and project status have been updated." };
  } catch (error) {
    return paymentReviewError(error, "Unable to verify this payment. Please try again.");
  }
}

export async function rejectManualPaymentFormAction(_: PaymentReviewState, formData: FormData): Promise<PaymentReviewState> {
  try {
    const owner = await requireOwner();
    const data = z.object({ paymentId: z.string(), reason: z.string().trim().min(3).max(2000) }).parse(Object.fromEntries(formData));
    await prisma.$transaction(async (tx) => {
      const payment = await tx.paymentAttempt.findUniqueOrThrow({ where: { id: data.paymentId } });
      if (payment.provider !== "MANUAL" || payment.manualStatus !== "UNDER_VERIFICATION") throw new Error("Payment is not awaiting manual verification.");
      await tx.paymentAttempt.update({ where: { id: payment.id }, data: { status: "FAILED", manualStatus: "REJECTED", verifiedBy: owner.id, verifiedAt: new Date(), rejectionReason: data.reason } });
      await tx.auditLog.create({ data: { userId: owner.id, action: "MANUAL_PAYMENT_REJECTED", entityType: "PaymentAttempt", entityId: payment.id, metadata: { reason: data.reason } } });
      await enqueueNotification(tx, { userId: payment.clientId, type: "PAYMENT_UPDATED", title: "Payment proof needs attention", message: `Manual payment proof was rejected: ${data.reason}`, href: `/client/invoices/${payment.invoiceId}` });
    });
    revalidatePaymentViews();
    return { status: "success", message: "Payment proof rejected and the client has been notified." };
  } catch (error) {
    return paymentReviewError(error, "Unable to reject this payment proof. Please try again.");
  }
}

function revalidatePaymentViews() {
  revalidatePath("/owner/payments");
  revalidatePath("/owner/invoices");
  revalidatePath("/owner/analytics");
}

function isRedirectError(error: unknown) {
  return typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT");
}

function paymentReviewError(error: unknown, fallback: string): PaymentReviewState {
  if (isRedirectError(error)) throw error;
  console.error("Manual payment review failed", error);
  if (error instanceof Error && ["Payment is not awaiting manual verification."].includes(error.message)) return { status: "error", message: error.message };
  return { status: "error", message: fallback };
}
