"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import {
  acceptQuotationAction,
  rejectQuotationAction,
  requestQuotationRevisionAction,
  type PublicQuotationActionState,
} from "@/features/quotations/public-actions";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Viewer = { email?: string | null; role?: "OWNER" | "CLIENT" } | null;
const initialState: PublicQuotationActionState = {};

export function PublicQuotationDecisionPanel({ token, recipientEmail, viewer, isId }: { token: string; recipientEmail: string | null; viewer: Viewer; isId: boolean }) {
  const callbackUrl = `/quotation/${token}`;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const registerHref = `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const canAccept = viewer?.role === "CLIENT" && Boolean(recipientEmail) && viewer.email?.toLowerCase() === recipientEmail?.toLowerCase();

  return <section className="mt-12 print:hidden">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{isId ? "Keputusan client" : "Client decision"}</p>
    <h2 className="mt-4 font-display text-3xl font-extrabold">{isId ? "Tinjau versi ini dengan jelas." : "Review this version clearly."}</h2>
    <p className="mt-3 text-sm text-secondary">{isId ? "Terima quotation setelah masuk dengan email penerima, minta perubahan spesifik, atau jelaskan alasan penolakan." : "Sign in with the recipient email to accept, request specific changes, or explain why it is not suitable."}</p>
    <div className="mt-8 grid gap-px bg-border lg:grid-cols-3">
      <AcceptDecision token={token} recipientEmail={recipientEmail} viewer={viewer} loginHref={loginHref} registerHref={registerHref} canAccept={canAccept} isId={isId} />
      <RevisionDecision token={token} isId={isId} />
      <RejectDecision token={token} isId={isId} />
    </div>
  </section>;
}

function AcceptDecision({ token, recipientEmail, viewer, loginHref, registerHref, canAccept, isId }: { token: string; recipientEmail: string | null; viewer: Viewer; loginHref: string; registerHref: string; canAccept: boolean; isId: boolean }) {
  const [state, action, pending] = useActionState(acceptQuotationAction, initialState);
  const termsError = state.errors?.acceptTerms?.[0];

  return <Decision title={isId ? "Terima quotation" : "Accept quotation"} description={isId ? "Masuk dengan email penerima quotation untuk mengonfirmasi persetujuan dan membuka workspace project." : "Sign in with the quotation recipient email to confirm and open the project workspace."}>
    {!recipientEmail && <InlineMessage message={isId ? "Quotation ini belum memiliki email penerima. Hubungi RRS untuk menerima versi yang diperbarui." : "This quotation has no recipient email. Contact RRS for an updated version."} />}
    {recipientEmail && !viewer && <div className="space-y-3"><Button asChild className="w-full"><Link href={loginHref}>{isId ? "Masuk untuk menerima" : "Sign in to accept"}</Link></Button><Button asChild variant="outline" className="w-full"><Link href={registerHref}>{isId ? "Buat akun client" : "Create client account"}</Link></Button></div>}
    {recipientEmail && viewer?.role === "OWNER" && <InlineMessage message={isId ? "Akun Owner tidak dapat menerima quotation client." : "Owner accounts cannot accept client quotations."} />}
    {recipientEmail && viewer?.role === "CLIENT" && !canAccept && <InlineMessage message={isId ? "Masuk dengan email penerima quotation untuk melanjutkan." : "Sign in with the quotation recipient email to continue."} />}
    {canAccept && <form action={action} className="space-y-3"><input type="hidden" name="token" value={token}/><label className="flex items-start gap-2 text-xs text-secondary"><input name="acceptTerms" type="checkbox" required className="mt-0.5" aria-invalid={Boolean(termsError)} aria-describedby={termsError ? "accept-terms-error" : undefined}/>{isId ? "Saya telah membaca dan menyetujui quotation beserta syaratnya." : "I have read and agree to this quotation and its terms."}</label><FieldError id="accept-terms-error" error={termsError}/>{state.message && <InlineMessage message={state.message}/>}<Button className="w-full" disabled={pending}>{pending ? (isId ? "Memproses…" : "Processing…") : (isId ? "Terima Quotation" : "Accept Quotation")}</Button></form>}
  </Decision>;
}

function RevisionDecision({ token, isId }: { token: string; isId: boolean }) {
  const [state, action, pending] = useActionState(requestQuotationRevisionAction, initialState);
  const nameError = state.errors?.requestedBy?.[0];
  const reasonError = state.errors?.reason?.[0];
  return <Decision title={isId ? "Minta revisi" : "Request revision"} description={isId ? "Jelaskan perubahan pada scope, harga, timeline, atau terms." : "Describe changes to scope, price, timeline, or terms."}>
    <form action={action} className="space-y-3"><input type="hidden" name="token" value={token}/><Input name="requestedBy" placeholder={isId ? "Nama Anda" : "Your name"} required aria-invalid={Boolean(nameError)} aria-describedby={nameError ? "requested-by-error" : undefined} className={fieldErrorClass(nameError)}/><FieldError id="requested-by-error" error={nameError}/><Textarea name="reason" placeholder={isId ? "Jelaskan perubahan yang diminta" : "Describe the requested changes"} required aria-invalid={Boolean(reasonError)} aria-describedby={reasonError ? "revision-reason-error" : undefined} className={fieldErrorClass(reasonError)}/><FieldError id="revision-reason-error" error={reasonError}/>{state.message && <InlineMessage message={state.message}/>}<Button variant="outline" className="w-full" disabled={pending}>{pending ? (isId ? "Mengirim…" : "Sending…") : (isId ? "Minta Revisi" : "Request Revision")}</Button></form>
  </Decision>;
}

function RejectDecision({ token, isId }: { token: string; isId: boolean }) {
  const [state, action, pending] = useActionState(rejectQuotationAction, initialState);
  const reasonError = state.errors?.reason?.[0];
  return <Decision title={isId ? "Tolak quotation" : "Reject quotation"} description={isId ? "Berikan alasan singkat agar keputusan dapat dipahami." : "Share a concise reason so the decision can be understood."}>
    <form action={action} className="space-y-3"><input type="hidden" name="token" value={token}/><Textarea name="reason" placeholder={isId ? "Alasan penolakan" : "Reason for rejection"} required aria-invalid={Boolean(reasonError)} aria-describedby={reasonError ? "reject-reason-error" : undefined} className={fieldErrorClass(reasonError)}/><FieldError id="reject-reason-error" error={reasonError}/>{state.message && <InlineMessage message={state.message}/>}<Button variant="ghost" className="w-full" disabled={pending}>{pending ? (isId ? "Mengirim…" : "Sending…") : (isId ? "Tolak Quotation" : "Reject Quotation")}</Button></form>
  </Decision>;
}

function InlineMessage({ message }: { message: string }) {
  return <p role="alert" className="flex items-start gap-2 rounded-[10px] bg-[#fbe8e8] px-3 py-3 text-xs leading-5 text-error"><CircleAlert className="mt-0.5 size-4 shrink-0"/>{message}</p>;
}

function Decision({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <article className="bg-surface p-6"><h3 className="font-display text-xl font-extrabold">{title}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-secondary">{description}</p><div className="mt-6">{children}</div></article>;
}
