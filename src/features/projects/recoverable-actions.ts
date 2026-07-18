"use server";

import { z } from "zod";
import { acceptAgreementAction, approveProjectDeliveryAction } from "@/features/projects/actions";
import { genericActionError, isRedirectError, type RecoverableActionState, zodActionError } from "@/lib/forms/action-state";

const agreementSchema = z.object({ projectId: z.string(), agreementVersion: z.coerce.number().int().positive(), acceptTerms: z.literal("on") });
const deliverySchema = z.object({ projectId: z.string() });

export async function acceptAgreementFormAction(_: RecoverableActionState, formData: FormData): Promise<RecoverableActionState> {
  const parsed = agreementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodActionError(parsed.error);
  try { await acceptAgreementAction(formData); } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error && error.message === "Agreement cannot be accepted.") return genericActionError(error.message);
    console.error("Agreement acceptance failed", error);
    return genericActionError("Unable to accept this agreement right now. Please try again.");
  }
  return { status: "idle" };
}

export async function approveProjectDeliveryFormAction(_: RecoverableActionState, formData: FormData): Promise<RecoverableActionState> {
  const parsed = deliverySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodActionError(parsed.error);
  try { await approveProjectDeliveryAction(formData); } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error && ["Project is not waiting for client approval.", "All milestones must be approved or completed before final delivery approval."].includes(error.message)) return genericActionError(error.message);
    console.error("Project delivery approval failed", error);
    return genericActionError("Unable to approve final delivery right now. Please try again.");
  }
  return { status: "idle" };
}
