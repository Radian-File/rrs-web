"use server";

import { z } from "zod";
import { createMidtransPaymentAction, submitManualPaymentAction } from "@/features/payments/actions";
import { genericActionError, isRedirectError, type RecoverableActionState, zodActionError } from "@/lib/forms/action-state";

export async function createMidtransPaymentFormAction(_: RecoverableActionState, formData: FormData): Promise<RecoverableActionState> {
  const parsed = z.object({ invoiceId: z.string() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodActionError(parsed.error);
  try { await createMidtransPaymentAction(formData); } catch (error) { if (isRedirectError(error)) throw error; if (error instanceof Error && ["Invoice is not payable.", "Invoice has no outstanding amount."].includes(error.message)) return genericActionError(error.message); console.error("Midtrans payment creation failed", error); return genericActionError("Unable to create a payment right now. Please try again."); }
  return { status: "idle" };
}

export async function submitManualPaymentFormAction(_: RecoverableActionState, formData: FormData): Promise<RecoverableActionState> {
  const parsed = z.object({ invoiceId: z.string(), proof: z.instanceof(File) }).safeParse({ invoiceId: formData.get("invoiceId"), proof: formData.get("proof") });
  if (!parsed.success) return zodActionError(parsed.error);
  try { await submitManualPaymentAction(formData); } catch (error) { if (isRedirectError(error)) throw error; if (error instanceof Error && ["Invoice is not payable.", "Payment proof is required."].includes(error.message)) return genericActionError(error.message); console.error("Manual payment submission failed", error); return genericActionError("Unable to submit payment proof right now. Please try again."); }
  return { status: "idle", message: "Payment proof submitted for verification." };
}
