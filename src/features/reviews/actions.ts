"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ReviewStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { generatePublicToken, hashPublicToken } from "@/lib/security/tokens";
import { requireOwner } from "@/lib/authz";
import { genericActionError, isRedirectError, type RecoverableActionState, zodActionError } from "@/lib/forms/action-state";
import { reviewSubmissionSchema } from "@/features/reviews/schemas";

class ReviewInvitationUnavailableError extends Error {}

export async function submitReviewAction(_: RecoverableActionState, formData: FormData): Promise<RecoverableActionState> {
  const parsed = reviewSubmissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodActionError(parsed.error);

  try {
    const hash = hashPublicToken(parsed.data.token);
    await prisma.$transaction(async (tx) => {
      const invitation = await tx.reviewInvitation.findUnique({ where: { tokenHash: hash }, include: { project: { include: { quotation: true } }, review: true } });
      if (!invitation || invitation.revokedAt || invitation.usedAt || invitation.expiresAt < new Date() || invitation.project.status !== "COMPLETED" || invitation.review) {
        throw new ReviewInvitationUnavailableError();
      }
      await tx.review.create({ data: { projectId: invitation.projectId, invitationId: invitation.id, clientId: invitation.project.clientId, serviceId: invitation.project.quotation.serviceId, overallRating: parsed.data.overallRating, communicationRating: parsed.data.communicationRating, qualityRating: parsed.data.qualityRating, deliveryRating: parsed.data.deliveryRating, valueRating: parsed.data.valueRating, comment: parsed.data.comment, status: "PENDING", isPublished: false } });
      await tx.reviewInvitation.update({ where: { id: invitation.id }, data: { usedAt: new Date() } });
      await tx.projectActivity.create({ data: { projectId: invitation.projectId, type: "REVIEW_SUBMITTED", description: "Client submitted a verified project review for moderation." } });
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ReviewInvitationUnavailableError) return genericActionError("This review invitation is no longer available.");
    console.error("Review submission failed", error);
    return genericActionError("Unable to submit your review right now. Please try again.");
  }

  revalidatePath("/owner/reviews");
  revalidatePath("/reviews");
  redirect(`/review/${parsed.data.token}?submitted=1`);
}

export type ReviewInvitationActionState = RecoverableActionState & { reviewUrl?: string };

export async function reissueReviewInvitationAction(_: ReviewInvitationActionState, formData: FormData): Promise<ReviewInvitationActionState> {
  const owner = await requireOwner();
  const parsed = z.object({ projectId: z.string() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodActionError(parsed.error);

  try {
    const token = generatePublicToken();
    await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({ where: { id: parsed.data.projectId }, include: { review: true, reviewInvite: true } });
      if (!project || project.status !== "COMPLETED" || project.review) throw new ReviewInvitationUnavailableError();
      await tx.reviewInvitation.upsert({
        where: { projectId: project.id },
        update: { tokenHash: hashPublicToken(token), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), revokedAt: null, usedAt: null },
        create: { projectId: project.id, tokenHash: hashPublicToken(token), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
      await tx.projectActivity.create({ data: { projectId: project.id, type: "REVIEW_INVITATION_REISSUED", description: "Owner reissued the verified review invitation." } });
      await tx.auditLog.create({ data: { userId: owner.id, action: "REVIEW_INVITATION_REISSUED", entityType: "Project", entityId: project.id } });
    });
    revalidatePath(`/owner/projects/${parsed.data.projectId}`);
    return { status: "idle", message: "A new review link is ready to copy.", reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/review/${token}` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ReviewInvitationUnavailableError) return genericActionError("A review link can only be issued for a completed project without a submitted review.");
    console.error("Review invitation reissue failed", error);
    return genericActionError("Unable to reissue the review link right now. Please try again.");
  }
}

export async function moderateReviewAction(formData: FormData) {
  await requireOwner();
  const data = z.object({ reviewId: z.string(), status: z.enum(ReviewStatus), ownerResponse: z.string().trim().max(5000).optional() }).parse(Object.fromEntries(formData));
  const publish = data.status === "PUBLISHED";
  await prisma.review.update({ where: { id: data.reviewId }, data: { status: data.status, isPublished: publish, publishedAt: publish ? new Date() : null, ownerResponse: data.ownerResponse || null } });
  revalidatePath("/owner/reviews");
  revalidatePath("/reviews");
}
