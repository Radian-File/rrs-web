"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireClient } from "@/lib/authz";
import { assertRequestRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { allocateDocumentNumber } from "@/features/documents/sequence";
import { buildAgreementSnapshot } from "@/features/agreements/content";

export type ClientQuotationActionState = { message?: string; errors?: Record<string, string[]> };
const idSchema = z.object({ quotationId: z.string().cuid(), acceptTerms: z.literal("on").optional() });
const reasonSchema = z.object({ quotationId: z.string().cuid(), reason: z.string().trim().min(3).max(5000) });

function failure(error: unknown): ClientQuotationActionState {
  if (error instanceof RateLimitError) return { message: error.message };
  console.error("Client quotation action failed", error);
  return { message: "Quotation tidak dapat diproses saat ini. Silakan coba lagi." };
}
async function quoteForClient(quotationId: string, clientId: string, email: string) {
  const quote = await prisma.quotation.findFirst({ where: { id: quotationId, isCurrent: true, OR: [{ clientId }, { clientEmail: email }] }, include: { items: { orderBy: { sequence: "asc" } }, paymentTerms: { orderBy: { sequence: "asc" } } } });
  if (!quote || !quote.clientEmail || quote.clientEmail.toLowerCase() !== email.toLowerCase() || quote.publicTokenRevokedAt || !["SENT", "VIEWED"].includes(quote.status) || quote.validUntil < new Date()) throw new Error("Quotation tidak tersedia untuk keputusan ini.");
  return quote;
}

export async function requestClientQuotationRevisionAction(_: ClientQuotationActionState, formData: FormData): Promise<ClientQuotationActionState> {
  const parsed = reasonSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const client = await requireClient(`/client/quotations/${parsed.data.quotationId}`);
  try { await assertRequestRateLimit("client-quotation-revision", 5, 30 * 60 * 1000, client.id); const quote = await quoteForClient(parsed.data.quotationId, client.id, client.email); await prisma.$transaction(async (tx) => { await tx.quotation.update({ where: { id: quote.id }, data: { status: "REVISION_REQUESTED", revisionRequests: { create: { requestedBy: client.name, reason: parsed.data.reason } }, activities: { create: { type: "REVISION_REQUESTED", description: "Client requested a quotation revision from the portal." } } } }); if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "DISCUSSING" } }); }); } catch (error) { return failure(error); }
  redirect(`/client/quotations/${parsed.data.quotationId}?action=revision`);
}

export async function rejectClientQuotationAction(_: ClientQuotationActionState, formData: FormData): Promise<ClientQuotationActionState> {
  const parsed = reasonSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const client = await requireClient(`/client/quotations/${parsed.data.quotationId}`);
  try { await assertRequestRateLimit("client-quotation-reject", 5, 30 * 60 * 1000, client.id); const quote = await quoteForClient(parsed.data.quotationId, client.id, client.email); await prisma.$transaction(async (tx) => { await tx.quotation.update({ where: { id: quote.id }, data: { status: "REJECTED", rejectedAt: new Date(), activities: { create: { type: "REJECTED", description: parsed.data.reason } } } }); if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "REJECTED" } }); }); } catch (error) { return failure(error); }
  redirect(`/client/quotations/${parsed.data.quotationId}?action=rejected`);
}

export async function acceptClientQuotationAction(_: ClientQuotationActionState, formData: FormData): Promise<ClientQuotationActionState> {
  const parsed = idSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success || parsed.data.acceptTerms !== "on") return { errors: { acceptTerms: ["Anda harus menyetujui syarat quotation."] } };
  const client = await requireClient(`/client/quotations/${parsed.data.quotationId}`);
  try { await assertRequestRateLimit("client-quotation-accept", 5, 30 * 60 * 1000, client.id); const quote = await quoteForClient(parsed.data.quotationId, client.id, client.email); await prisma.$transaction(async (tx) => { const claimed = await tx.quotation.updateMany({ where: { id: quote.id, status: { in: ["SENT", "VIEWED"] }, acceptedAt: null }, data: { status: "ACCEPTED", acceptedAt: new Date(), clientId: client.id } }); if (claimed.count !== 1) throw new Error("Quotation sudah diproses."); const projectNumber = await allocateDocumentNumber(tx, "PROJECT"); const agreementNumber = await allocateDocumentNumber(tx, "AGREEMENT"); const invoiceNumber = await allocateDocumentNumber(tx, "INVOICE"); const project = await tx.project.create({ data: { projectNumber, quotationId: quote.id, inquiryId: quote.inquiryId, clientId: client.id, title: quote.projectTitle, summary: quote.projectSummary, status: "AWAITING_AGREEMENT", currency: quote.currency, total: quote.total, startDate: quote.estimatedStartDate, dueDate: quote.estimatedCompletionAt } }); await tx.agreement.create({ data: { agreementNumber, projectId: project.id, quotationId: quote.id, version: 1, status: "PENDING", contentSnapshot: buildAgreementSnapshot({ quotation: quote, client }) } }); let firstScheduleId: string | undefined; for (const term of quote.paymentTerms) { const schedule = await tx.paymentSchedule.create({ data: { projectId: project.id, title: term.title, description: term.description, percentage: term.percentage, amount: term.amount, dueTrigger: term.dueTrigger, sequence: term.sequence } }); firstScheduleId ??= schedule.id; } if (!firstScheduleId) throw new Error("Quotation tidak memiliki jadwal pembayaran."); const firstTerm = quote.paymentTerms[0]; await tx.invoice.create({ data: { invoiceNumber, projectId: project.id, clientId: client.id, paymentScheduleId: firstScheduleId, currency: quote.currency, subtotal: firstTerm.amount, total: firstTerm.amount, status: "ISSUED", issuedAt: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), notes: `First invoice generated from ${quote.quotationNumber} v${quote.version}.` } }); await tx.quotationActivity.create({ data: { quotationId: quote.id, type: "ACCEPTED", description: "Client accepted the quotation from the portal." } }); if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "ACCEPTED", clientId: client.id } }); }); } catch (error) { return failure(error); }
  redirect(`/client/quotations/${parsed.data.quotationId}?action=accepted`);
}
