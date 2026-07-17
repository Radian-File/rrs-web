"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { rejectManualPaymentFormAction, verifyManualPaymentFormAction, type PaymentReviewState } from "@/features/payments/actions";

const initialPaymentReviewState: PaymentReviewState = { status: "idle" };

export function ManualPaymentReviewControls({ paymentId }: { paymentId: string }) {
  const [verifyState, verifyAction, verifying] = useActionState(verifyManualPaymentFormAction, initialPaymentReviewState);
  const [rejectState, rejectAction, rejecting] = useActionState(rejectManualPaymentFormAction, initialPaymentReviewState);

  return <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-2">
    <form action={verifyAction} className="rounded-[12px] bg-accent-soft p-4">
      <input type="hidden" name="paymentId" value={paymentId} />
      <p className="text-sm font-semibold">Verify payment proof</p>
      <p className="mt-1 text-xs leading-5 text-secondary">This confirms the payment, updates the invoice, and may move the project to planning.</p>
      {verifyState.status !== "idle" && <p role="status" className={`mt-3 text-sm ${verifyState.status === "success" ? "text-success" : "text-error"}`}>{verifyState.message}</p>}
      <Button className="mt-4" disabled={verifying || rejecting}>{verifying ? "Verifying…" : "Verify Payment"}</Button>
    </form>
    <form action={rejectAction} className="rounded-[12px] border border-border p-4">
      <input type="hidden" name="paymentId" value={paymentId} />
      <label htmlFor={`rejection-reason-${paymentId}`} className="text-sm font-semibold">Reject payment proof</label>
      <Textarea id={`rejection-reason-${paymentId}`} name="reason" placeholder="Reason for rejection" required className="mt-3 min-h-20" />
      {rejectState.status !== "idle" && <p role="status" className={`mt-3 text-sm ${rejectState.status === "success" ? "text-success" : "text-error"}`}>{rejectState.message}</p>}
      <Button className="mt-3" variant="danger" disabled={verifying || rejecting}>{rejecting ? "Rejecting…" : "Reject Proof"}</Button>
    </form>
  </div>;
}
