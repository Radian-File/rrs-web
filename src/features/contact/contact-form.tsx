"use client";

import { useActionState, useRef } from "react";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";
import { Button } from "@/components/ui/button";
import { submitContactAction } from "@/features/contact/actions";

export function ContactForm({ isId = true }: { isId?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submitContactAction, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message));
  const error = (name: string) => state.errors?.[name]?.[0];
  const copy = isId ? {
    name: "Nama",
    email: "Email",
    emailHint: "Gunakan email aktif. Jika Anda membuat Client Portal, gunakan email yang sama agar quotation dan project dapat terhubung.",
    whatsapp: "WhatsApp (opsional)",
    whatsappHint: "Digunakan untuk melanjutkan diskusi. Nomor ini bukan identity akun dan tidak menggabungkan akun secara otomatis.",
    subject: "Subjek",
    message: "Pesan",
    sending: "Mengirim…",
    submit: "Kirim pesan",
  } : {
    name: "Name",
    email: "Email",
    emailHint: "Use an active email address. If you later create a Client Portal account, use the same address so quotations and projects can be connected.",
    whatsapp: "WhatsApp (optional)",
    whatsappHint: "Used to continue the discussion. This number is not an account identity and does not merge accounts automatically.",
    subject: "Subject",
    message: "Message",
    sending: "Sending…",
    submit: "Send message",
  };

  return (
    <form ref={formRef} action={action} onSubmit={capture} className="grid gap-5 sm:grid-cols-2">
      <Field label={copy.name} name="name" error={error("name")} />
      <Field label={copy.email} name="email" type="email" error={error("email")} hint={copy.emailHint} />
      <Field label={copy.whatsapp} name="whatsappNumber" required={false} error={error("whatsappNumber")} hint={copy.whatsappHint} />
      <Field label={copy.subject} name="subject" error={error("subject")} />
      <label className="sm:col-span-2">
        <span className="mb-2 block text-sm font-semibold">{copy.message}</span>
        <Textarea name="message" required aria-invalid={Boolean(error("message"))} className={fieldErrorClass(error("message"))} />
        <FieldError id="message-error" error={error("message")} />
      </label>
      {state.message && <p role="alert" className="border border-error/20 bg-error-soft px-4 py-3 text-sm text-error sm:col-span-2">{state.message}</p>}
      <Button className="sm:col-span-2" disabled={pending}>{pending ? copy.sending : copy.submit}</Button>
    </form>
  );
}

function Field({ label, name, type = "text", required = true, error, hint }: { label: string; name: string; type?: string; required?: boolean; error?: string; hint?: string }) {
  const id = `${name}-error`;
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <Input name={name} type={type} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? id : hint ? `${name}-hint` : undefined} className={fieldErrorClass(error)} />
      {hint && <span id={`${name}-hint`} className="mt-2 block text-xs leading-5 text-secondary">{hint}</span>}
      <FieldError id={id} error={error} />
    </label>
  );
}
