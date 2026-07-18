"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { acceptAgreementFormAction, approveProjectDeliveryFormAction } from "@/features/projects/recoverable-actions";

const initial = { status: "idle" as const };

export function AgreementAcceptanceControl({ projectId, agreementVersion }: { projectId: string; agreementVersion: number }) {
  const [state, action, pending] = useActionState(acceptAgreementFormAction, initial);
  const termsError = state.errors?.acceptTerms?.[0];
  return <form action={action} className="mt-5"><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="agreementVersion" value={agreementVersion}/><label className="flex items-start gap-3 text-sm"><input name="acceptTerms" type="checkbox" required className="mt-1"/>I have read and agree to this project agreement.</label><FieldError id="agreement-terms-error" error={termsError}/>{state.message&&<p role="alert" className="mt-3 rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error">{state.message}</p>}<Button className="mt-5" disabled={pending}>{pending?"Accepting…":"Accept Agreement"}</Button></form>;
}

export function DeliveryApprovalControl({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(approveProjectDeliveryFormAction, initial);
  return <form action={action} className="mt-5"><input type="hidden" name="projectId" value={projectId}/>{state.message&&<p role="alert" className="mb-3 rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error">{state.message}</p>}<Button disabled={pending}>{pending?"Approving…":"Approve Final Delivery"}</Button></form>;
}
