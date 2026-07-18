"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMidtransPaymentFormAction, submitManualPaymentFormAction } from "@/features/payments/recoverable-actions";
const initial={status:"idle" as const};
function Notice({message}:{message?:string}){return message?<p role="alert" className="mt-3 rounded-[10px] bg-[#fbe8e8] px-3 py-3 text-sm text-error">{message}</p>:null;}
export function MidtransPaymentControl({invoiceId,enabled}:{invoiceId:string;enabled:boolean}){const[state,action,pending]=useActionState(createMidtransPaymentFormAction,initial);return <form action={action} className="mt-5"><input type="hidden" name="invoiceId" value={invoiceId}/><Notice message={state.message}/><Button className="w-full" disabled={!enabled||pending}>{enabled?(pending?"Creating payment…":"Create Midtrans Payment"):"Sandbox key not configured"}</Button></form>;}
export function ManualPaymentControl({invoiceId}:{invoiceId:string}){const[state,action,pending]=useActionState(submitManualPaymentFormAction,initial);return <form action={action} className="mt-5 space-y-3"><input type="hidden" name="invoiceId" value={invoiceId}/><Input name="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="pt-3" required/><Notice message={state.message}/><Button className="w-full" variant="outline" disabled={pending}>{pending?"Submitting…":"Submit Proof"}</Button></form>;}
