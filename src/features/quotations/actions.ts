"use server";

import { randomUUID } from "node:crypto";
import Decimal from "decimal.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireOwner } from "@/lib/authz";
import { calculateQuotationTotals } from "@/lib/money";
import { allocateDocumentNumber } from "@/features/documents/sequence";
import { quotationFormSchema } from "@/features/quotations/schemas";
import { buildPaymentTerms } from "@/features/quotations/payment-terms";
import { generatePublicToken, hashPublicToken } from "@/lib/security/tokens";

export type QuotationActionState = { message?: string; errors?: Record<string, string[]> };
const dateOrNull = (value?: string) => value ? new Date(`${value}T12:00:00+07:00`) : null;
const nullable = (value?: string) => value || null;

export async function saveQuotationAction(_state: QuotationActionState, formData: FormData): Promise<QuotationActionState> {
  await requireOwner();
  const parsed = quotationFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Review the quotation fields.", errors: parsed.error.flatten().fieldErrors };

  try {
    const data = parsed.data;
    const totals = calculateQuotationTotals(data.itemsJson, data.discount, data.tax);
    const terms = buildPaymentTerms(data.paymentPlanType, totals.total, data.customFirstPayment);
    const rawToken = data.intent === "SENT" ? generatePublicToken() : undefined;
    const tokenHash = rawToken ? hashPublicToken(rawToken) : undefined;

    const quotation = await prisma.$transaction(async (tx) => {
      if (data.quotationId) {
        const existing = await tx.quotation.findUniqueOrThrow({ where: { id: data.quotationId } });
        if (existing.status !== "DRAFT") throw new Error("Only draft quotations can be edited directly.");
        await tx.quotationItem.deleteMany({ where: { quotationId: existing.id } });
        await tx.quotationPaymentTerm.deleteMany({ where: { quotationId: existing.id } });
        return tx.quotation.update({
          where: { id: existing.id },
          data: {
            status: data.intent,
            clientName: data.clientName, companyName: nullable(data.companyName), clientEmail: nullable(data.clientEmail), clientPhone: nullable(data.clientPhone), clientAddress: nullable(data.clientAddress),
            projectTitle: data.projectTitle, projectSummary: data.projectSummary, projectType: nullable(data.projectType),
            subtotal: totals.subtotal.toFixed(2), discount: totals.discount.toFixed(2), tax: totals.tax.toFixed(2), total: totals.total.toFixed(2),
            paymentPlanType: data.paymentPlanType, validUntil: dateOrNull(data.validUntil)!, estimatedStartDate: dateOrNull(data.estimatedStartDate), estimatedCompletionAt: dateOrNull(data.estimatedCompletionAt),
            scopeIncluded: data.scopeIncluded, scopeExcluded: nullable(data.scopeExcluded), revisionLimit: data.revisionLimit ?? null, maintenanceDays: data.maintenanceDays ?? null, terms: data.terms, notes: nullable(data.notes),
            publicTokenHash: tokenHash ?? existing.publicTokenHash, sentAt: data.intent === "SENT" ? new Date() : existing.sentAt,
            items: { create: data.itemsJson.map((item, index) => ({ ...item, description: nullable(item.description), total: new Decimal(item.quantity).times(item.unitPrice).toFixed(2), sequence: index + 1 })) },
            paymentTerms: { create: terms },
            activities: { create: { type: data.intent === "SENT" ? "SENT" : "DRAFT_UPDATED", description: data.intent === "SENT" ? "Quotation sent to client." : "Quotation draft updated." } },
          },
        });
      }

      const quotationNumber = await allocateDocumentNumber(tx, "QUOTATION");
      const created = await tx.quotation.create({
        data: {
          groupId: randomUUID(), quotationNumber, version: 1, isCurrent: true, status: data.intent, sourceType: data.inquiryId ? "INQUIRY" : "MANUAL", inquiryId: nullable(data.inquiryId), clientId: nullable(data.clientId),
          clientName: data.clientName, companyName: nullable(data.companyName), clientEmail: nullable(data.clientEmail), clientPhone: nullable(data.clientPhone), clientAddress: nullable(data.clientAddress),
          projectTitle: data.projectTitle, projectSummary: data.projectSummary, projectType: nullable(data.projectType),
          subtotal: totals.subtotal.toFixed(2), discount: totals.discount.toFixed(2), tax: totals.tax.toFixed(2), total: totals.total.toFixed(2), paymentPlanType: data.paymentPlanType,
          validUntil: dateOrNull(data.validUntil)!, estimatedStartDate: dateOrNull(data.estimatedStartDate), estimatedCompletionAt: dateOrNull(data.estimatedCompletionAt),
          scopeIncluded: data.scopeIncluded, scopeExcluded: nullable(data.scopeExcluded), revisionLimit: data.revisionLimit ?? null, maintenanceDays: data.maintenanceDays ?? null, terms: data.terms, notes: nullable(data.notes),
          publicTokenHash: tokenHash, sentAt: data.intent === "SENT" ? new Date() : null,
          items: { create: data.itemsJson.map((item, index) => ({ ...item, description: nullable(item.description), total: new Decimal(item.quantity).times(item.unitPrice).toFixed(2), sequence: index + 1 })) },
          paymentTerms: { create: terms },
          activities: { create: { type: data.intent === "SENT" ? "SENT" : "CREATED", description: data.intent === "SENT" ? "Quotation saved and sent." : "Quotation draft created." } },
        },
      });
      if (data.inquiryId && data.intent === "SENT") await tx.inquiry.update({ where: { id: data.inquiryId }, data: { status: "QUOTATION_SENT", activities: { create: { type: "QUOTATION_SENT", description: `${quotationNumber} sent to client.` } } } });
      return created;
    });

    revalidatePath("/owner/quotations");
    redirect(`/owner/quotations/${quotation.id}${rawToken ? `?token=${rawToken}` : ""}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { message: error instanceof Error ? error.message : "Unable to save quotation." };
  }
}

export async function createRevisionVersionAction(formData: FormData) {
  await requireOwner();
  const quotationId = String(formData.get("quotationId") ?? "");
  const copy = await prisma.$transaction(async (tx) => {
    const current = await tx.quotation.findUniqueOrThrow({ where: { id: quotationId }, include: { items: { orderBy: { sequence: "asc" } }, paymentTerms: { orderBy: { sequence: "asc" } } } });
    if (!current.isCurrent || !["SENT", "VIEWED", "REVISION_REQUESTED", "REJECTED", "EXPIRED"].includes(current.status)) throw new Error("A new version can only be created from the current sent quotation.");
    await tx.quotation.update({ where: { id: current.id }, data: { isCurrent: false } });
    return tx.quotation.create({ data: {
      groupId: current.groupId, quotationNumber: current.quotationNumber, version: current.version + 1, isCurrent: true, status: "DRAFT", sourceType: current.sourceType, inquiryId: current.inquiryId, clientId: current.clientId, serviceId: current.serviceId,
      clientName: current.clientName, companyName: current.companyName, clientEmail: current.clientEmail, clientPhone: current.clientPhone, clientAddress: current.clientAddress,
      projectTitle: current.projectTitle, projectSummary: current.projectSummary, projectType: current.projectType, currency: current.currency,
      subtotal: current.subtotal, discount: current.discount, tax: current.tax, total: current.total, paymentPlanType: current.paymentPlanType, validUntil: current.validUntil,
      estimatedStartDate: current.estimatedStartDate, estimatedCompletionAt: current.estimatedCompletionAt, scopeIncluded: current.scopeIncluded, scopeExcluded: current.scopeExcluded, revisionLimit: current.revisionLimit, maintenanceDays: current.maintenanceDays, terms: current.terms, notes: current.notes,
      items: { create: current.items.map(({ title, description, quantity, unitPrice, total, sequence }) => ({ title, description, quantity, unitPrice, total, sequence })) },
      paymentTerms: { create: current.paymentTerms.map(({ title, description, percentage, amount, dueTrigger, sequence }) => ({ title, description, percentage, amount, dueTrigger, sequence })) },
      activities: { create: { type: "VERSION_CREATED", description: `Version ${current.version + 1} created from version ${current.version}.` } },
    } });
  });
  redirect(`/owner/quotations/${copy.id}/edit`);
}
