"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPublicToken } from "@/lib/security/tokens";
import { allocateDocumentNumber } from "@/features/documents/sequence";
import { RateLimitError, assertRequestRateLimit } from "@/lib/security/rate-limit";
import { buildAgreementSnapshot } from "@/features/agreements/content";
import { requireClient } from "@/lib/authz";

export type PublicQuotationActionState = { message?: string; errors?: Record<string, string[]> };
class PublicQuotationUnavailableError extends Error {}
const tokenSchema = z.string().min(20).max(200);
const decisionSchema = z.object({ token: tokenSchema, acceptTerms: z.literal("on").optional() });
const revisionSchema = z.object({ token: tokenSchema, reason: z.string().trim().min(10).max(5000) });
const rejectSchema = z.object({ token: tokenSchema, reason: z.string().trim().min(3).max(2000) });
const discussionSchema = z.object({ token: tokenSchema, name: z.string().trim().min(2).max(100), email: z.string().email().transform((value) => value.toLowerCase()), message: z.string().trim().min(10).max(5000), website: z.string().max(0).optional() });

function recoverableError(error: unknown): PublicQuotationActionState {
  if (error instanceof PublicQuotationUnavailableError || error instanceof RateLimitError) return { message: error.message };
  console.error("Public quotation action failed", error);
  return { message: "Unable to complete this quotation action right now. Please try again." };
}
async function limit(scope: string, identity: string) { try { await assertRequestRateLimit(scope, 5, 30 * 60 * 1000, identity); return null; } catch (error) { return recoverableError(error); } }
async function getFormalQuote(token: string, clientEmail: string) {
  const quote = await prisma.quotation.findUnique({ where: { publicTokenHash: hashPublicToken(token) }, include: { paymentTerms: { orderBy: { sequence: "asc" } }, items: { orderBy: { sequence: "asc" } } } });
  if (!quote || !quote.isCurrent || quote.publicTokenRevokedAt || !["SENT", "VIEWED"].includes(quote.status) || quote.validUntil < new Date()) throw new PublicQuotationUnavailableError("Quotation is no longer available.");
  if (!quote.clientEmail || quote.clientEmail.toLowerCase() !== clientEmail.toLowerCase()) throw new PublicQuotationUnavailableError("Use the Client account that received this quotation.");
  return quote;
}

export async function createQuotationDiscussionAction(_: PublicQuotationActionState, formData: FormData): Promise<PublicQuotationActionState> {
  const parsed = discussionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  if (parsed.data.website) return { message: "Pesan belum dapat dikirim. Silakan coba lagi." };
  const limited = await limit("quotation-discussion", `${parsed.data.token}:${parsed.data.email}`); if (limited) return limited;
  try {
    const quote = await prisma.quotation.findUnique({ where: { publicTokenHash: hashPublicToken(parsed.data.token) } });
    if (!quote || !quote.isCurrent || quote.publicTokenRevokedAt || !["SENT", "VIEWED", "REVISION_REQUESTED"].includes(quote.status) || quote.validUntil < new Date() || !quote.clientEmail || quote.clientEmail.toLowerCase() !== parsed.data.email) throw new PublicQuotationUnavailableError("Pesan belum dapat dikirim. Pastikan Anda memakai email penerima quotation.");
    await prisma.$transaction(async (tx) => {
      await tx.quotationDiscussion.create({ data: { quotationId: quote.id, name: parsed.data.name, email: parsed.data.email, message: parsed.data.message } });
      await tx.quotationActivity.create({ data: { quotationId: quote.id, type: "DISCUSSION_RECEIVED", description: "Guest discussion received for this quotation." } });
    });
  } catch (error) { return recoverableError(error); }
  redirect(`/quotation/${parsed.data.token}?action=discussion`);
}

export async function requestQuotationRevisionAction(_: PublicQuotationActionState, formData: FormData): Promise<PublicQuotationActionState> {
  const parsed = revisionSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const client = await requireClient(`/quotation/${parsed.data.token}`); const limited = await limit("quotation-revision", client.id); if (limited) return limited;
  try { const quote = await getFormalQuote(parsed.data.token, client.email); await prisma.$transaction(async (tx) => { await tx.quotation.update({ where: { id: quote.id }, data: { status: "REVISION_REQUESTED", revisionRequests: { create: { requestedBy: client.name, reason: parsed.data.reason } }, activities: { create: { type: "REVISION_REQUESTED", description: "Client requested a quotation revision." } } } }); if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "DISCUSSING" } }); }); } catch (error) { return recoverableError(error); }
  redirect(`/quotation/${parsed.data.token}?action=revision`);
}

export async function rejectQuotationAction(_: PublicQuotationActionState, formData: FormData): Promise<PublicQuotationActionState> {
  const parsed = rejectSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const client = await requireClient(`/quotation/${parsed.data.token}`); const limited = await limit("quotation-reject", client.id); if (limited) return limited;
  try { const quote = await getFormalQuote(parsed.data.token, client.email); await prisma.$transaction(async (tx) => { await tx.quotation.update({ where: { id: quote.id }, data: { status: "REJECTED", rejectedAt: new Date(), activities: { create: { type: "REJECTED", description: parsed.data.reason, metadata: { reason: parsed.data.reason } } } } }); if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "REJECTED" } }); }); } catch (error) { return recoverableError(error); }
  redirect(`/quotation/${parsed.data.token}?action=rejected`);
}

export async function acceptQuotationAction(_: PublicQuotationActionState, formData: FormData): Promise<PublicQuotationActionState> {
  const parsed = decisionSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success || parsed.data.acceptTerms !== "on") return { errors: { acceptTerms: ["You must accept the quotation terms."] } };
  const client = await requireClient(`/quotation/${parsed.data.token}`); const limited = await limit("quotation-accept", client.id); if (limited) return limited;
  try { const quote = await getFormalQuote(parsed.data.token, client.email); await prisma.$transaction(async (tx) => { const claimed = await tx.quotation.updateMany({ where: { id: quote.id, status: { in: ["SENT", "VIEWED"] }, acceptedAt: null }, data: { status: "ACCEPTED", acceptedAt: new Date(), clientId: client.id } }); if (claimed.count !== 1) throw new PublicQuotationUnavailableError("Quotation was already actioned."); const projectNumber = await allocateDocumentNumber(tx, "PROJECT"); const agreementNumber = await allocateDocumentNumber(tx, "AGREEMENT"); const invoiceNumber = await allocateDocumentNumber(tx, "INVOICE"); const project = await tx.project.create({ data: { projectNumber, quotationId: quote.id, inquiryId: quote.inquiryId, clientId: client.id, title: quote.projectTitle, summary: quote.projectSummary, status: "AWAITING_AGREEMENT", currency: quote.currency, total: quote.total, startDate: quote.estimatedStartDate, dueDate: quote.estimatedCompletionAt } }); await tx.agreement.create({ data: { agreementNumber, projectId: project.id, quotationId: quote.id, version: 1, status: "PENDING", contentSnapshot: buildAgreementSnapshot({ quotation: quote, client }) } }); let firstScheduleId: string | undefined; for (const term of quote.paymentTerms) { const schedule = await tx.paymentSchedule.create({ data: { projectId: project.id, title: term.title, description: term.description, percentage: term.percentage, amount: term.amount, dueTrigger: term.dueTrigger, sequence: term.sequence } }); firstScheduleId ??= schedule.id; } if (!firstScheduleId) throw new PublicQuotationUnavailableError("Quotation has no payment schedule."); const firstTerm = quote.paymentTerms[0]; await tx.invoice.create({ data: { invoiceNumber, projectId: project.id, clientId: client.id, paymentScheduleId: firstScheduleId, currency: quote.currency, subtotal: firstTerm.amount, total: firstTerm.amount, status: "ISSUED", issuedAt: new Date(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), notes: `First invoice generated from ${quote.quotationNumber} v${quote.version}.` } }); await tx.quotationActivity.create({ data: { quotationId: quote.id, type: "ACCEPTED", description: "Client accepted the quotation; agreement, project, schedule, and first invoice were created." } }); if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "ACCEPTED", clientId: client.id, activities: { create: { type: "ACCEPTED", description: `${quote.quotationNumber} accepted by client.` } } } }); }); } catch (error) { return recoverableError(error); }
  redirect(`/quotation/${parsed.data.token}?action=accepted`);
}
