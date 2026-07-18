"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPublicToken } from "@/lib/security/tokens";
import { allocateDocumentNumber } from "@/features/documents/sequence";
import { RateLimitError, assertRequestRateLimit } from "@/lib/security/rate-limit";
import { buildAgreementSnapshot } from "@/features/agreements/content";
import { requireClient } from "@/lib/authz";

export type PublicQuotationActionState = {
  message?: string;
  errors?: Record<string, string[]>;
};

class PublicQuotationActionError extends Error {}

const tokenSchema = z.string().min(20).max(200);
const revisionSchema = z.object({ token: tokenSchema, requestedBy: z.string().trim().min(2).max(100), reason: z.string().trim().min(10).max(5000) });
const rejectSchema = z.object({ token: tokenSchema, reason: z.string().trim().min(3).max(2000) });
const acceptSchema = z.object({ token: tokenSchema, acceptTerms: z.literal("on") });

function errorState(error: unknown): PublicQuotationActionState {
  if (error instanceof PublicQuotationActionError || error instanceof RateLimitError) {
    return { message: error.message };
  }
  throw error;
}

async function checkRateLimit(scope: string, identity: string): Promise<PublicQuotationActionState | null> {
  try {
    await assertRequestRateLimit(scope, 5, 30 * 60 * 1000, identity);
    return null;
  } catch (error) {
    return errorState(error);
  }
}

function actionableQuoteError(message = "Quotation is no longer available for this action.") {
  return new PublicQuotationActionError(message);
}

export async function requestQuotationRevisionAction(
  _state: PublicQuotationActionState,
  formData: FormData,
): Promise<PublicQuotationActionState> {
  const rateLimitState = await checkRateLimit("quotation-revision", String(formData.get("token") ?? ""));
  if (rateLimitState) return rateLimitState;
  const parsed = revisionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    const data = parsed.data;
    const hash = hashPublicToken(data.token);
    await prisma.$transaction(async (tx) => {
      const quote = await tx.quotation.findUnique({ where: { publicTokenHash: hash } });
      if (!quote || !quote.isCurrent || quote.publicTokenRevokedAt || !["SENT", "VIEWED"].includes(quote.status) || quote.validUntil < new Date()) {
        throw actionableQuoteError();
      }
      await tx.quotation.update({
        where: { id: quote.id },
        data: {
          status: "REVISION_REQUESTED",
          revisionRequests: { create: { requestedBy: data.requestedBy, reason: data.reason } },
          activities: { create: { type: "REVISION_REQUESTED", description: "Client requested a quotation revision." } },
        },
      });
      if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "DISCUSSING" } });
    });
  } catch (error) {
    return errorState(error);
  }

  redirect(`/quotation/${parsed.data.token}?action=revision`);
}

export async function rejectQuotationAction(
  _state: PublicQuotationActionState,
  formData: FormData,
): Promise<PublicQuotationActionState> {
  const rateLimitState = await checkRateLimit("quotation-reject", String(formData.get("token") ?? ""));
  if (rateLimitState) return rateLimitState;
  const parsed = rejectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    const data = parsed.data;
    const hash = hashPublicToken(data.token);
    await prisma.$transaction(async (tx) => {
      const quote = await tx.quotation.findUnique({ where: { publicTokenHash: hash } });
      if (!quote || !quote.isCurrent || quote.publicTokenRevokedAt || !["SENT", "VIEWED"].includes(quote.status)) {
        throw actionableQuoteError("Quotation cannot be rejected.");
      }
      await tx.quotation.update({
        where: { id: quote.id },
        data: {
          status: "REJECTED",
          rejectedAt: new Date(),
          activities: { create: { type: "REJECTED", description: data.reason, metadata: { reason: data.reason } } },
        },
      });
      if (quote.inquiryId) await tx.inquiry.update({ where: { id: quote.inquiryId }, data: { status: "REJECTED" } });
    });
  } catch (error) {
    return errorState(error);
  }

  redirect(`/quotation/${parsed.data.token}?action=rejected`);
}

export async function acceptQuotationAction(
  _state: PublicQuotationActionState,
  formData: FormData,
): Promise<PublicQuotationActionState> {
  const rateLimitState = await checkRateLimit("quotation-accept", String(formData.get("token") ?? ""));
  if (rateLimitState) return rateLimitState;
  const parsed = acceptSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const client = await requireClient();

  try {
    const data = parsed.data;
    const hash = hashPublicToken(data.token);
    await prisma.$transaction(async (tx) => {
      const quote = await tx.quotation.findUnique({
        where: { publicTokenHash: hash },
        include: { paymentTerms: { orderBy: { sequence: "asc" } }, items: { orderBy: { sequence: "asc" } } },
      });
      if (!quote || !quote.isCurrent || !["SENT", "VIEWED"].includes(quote.status) || quote.validUntil < new Date() || quote.publicTokenRevokedAt) {
        throw actionableQuoteError("Quotation cannot be accepted.");
      }
      if (!quote.clientEmail) {
        throw actionableQuoteError("This quotation has no recipient email. Contact RRS to receive a corrected quotation.");
      }
      if (quote.clientEmail.toLowerCase() !== client.email.toLowerCase()) {
        throw actionableQuoteError("Sign in with the quotation recipient email to accept this quotation.");
      }

      const claimed = await tx.quotation.updateMany({
        where: { id: quote.id, status: { in: ["SENT", "VIEWED"] }, acceptedAt: null },
        data: { status: "ACCEPTED", acceptedAt: new Date(), clientId: client.id },
      });
      if (claimed.count !== 1) throw actionableQuoteError("Quotation was already actioned.");

      const projectNumber = await allocateDocumentNumber(tx, "PROJECT");
      const agreementNumber = await allocateDocumentNumber(tx, "AGREEMENT");
      const invoiceNumber = await allocateDocumentNumber(tx, "INVOICE");
      const project = await tx.project.create({
        data: {
          projectNumber,
          quotationId: quote.id,
          inquiryId: quote.inquiryId,
          clientId: client.id,
          title: quote.projectTitle,
          summary: quote.projectSummary,
          status: "AWAITING_AGREEMENT",
          currency: quote.currency,
          total: quote.total,
          startDate: quote.estimatedStartDate,
          dueDate: quote.estimatedCompletionAt,
        },
      });
      await tx.agreement.create({
        data: {
          agreementNumber,
          projectId: project.id,
          quotationId: quote.id,
          version: 1,
          status: "PENDING",
          contentSnapshot: buildAgreementSnapshot({ quotation: quote, client }),
        },
      });
      let firstScheduleId: string | undefined;
      for (const term of quote.paymentTerms) {
        const schedule = await tx.paymentSchedule.create({
          data: {
            projectId: project.id,
            title: term.title,
            description: term.description,
            percentage: term.percentage,
            amount: term.amount,
            dueTrigger: term.dueTrigger,
            sequence: term.sequence,
          },
        });
        firstScheduleId ??= schedule.id;
      }
      if (!firstScheduleId) throw actionableQuoteError("Quotation cannot be accepted because its payment schedule is incomplete. Contact RRS.");
      const firstTerm = quote.paymentTerms[0];
      await tx.invoice.create({
        data: {
          invoiceNumber,
          projectId: project.id,
          clientId: client.id,
          paymentScheduleId: firstScheduleId,
          currency: quote.currency,
          subtotal: firstTerm.amount,
          total: firstTerm.amount,
          status: "ISSUED",
          issuedAt: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notes: `First invoice generated from ${quote.quotationNumber} v${quote.version}.`,
        },
      });
      await tx.quotationActivity.create({
        data: {
          quotationId: quote.id,
          type: "ACCEPTED",
          description: "Client accepted the quotation; agreement, project, schedule, and first invoice were created.",
        },
      });
      if (quote.inquiryId) {
        await tx.inquiry.update({
          where: { id: quote.inquiryId },
          data: {
            status: "ACCEPTED",
            clientId: client.id,
            activities: { create: { type: "ACCEPTED", description: `${quote.quotationNumber} accepted by client.` } },
          },
        });
      }
    });
  } catch (error) {
    return errorState(error);
  }

  redirect(`/quotation/${parsed.data.token}?action=accepted`);
}
