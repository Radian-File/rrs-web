"use client";

import { useActionState, useRef } from "react";
import { submitContactAction } from "@/features/contact/actions";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(submitContactAction, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message));
  const error = (name: string) => state.errors?.[name]?.[0];
  return <form ref={formRef} action={action} onSubmit={capture} className="grid gap-5 sm:grid-cols-2">
    <Field label="Nama" name="name" error={error("name")}/><Field label="Email" name="email" type="email" error={error("email")}/><Field label="WhatsApp (opsional)" name="whatsappNumber" required={false} error={error("whatsappNumber")}/><Field label="Subjek" name="subject" error={error("subject")}/>
    <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Pesan</span><Textarea name="message" required aria-invalid={Boolean(error("message"))} aria-describedby={error("message") ? "message-error" : undefined} className={fieldErrorClass(error("message"))}/><FieldError id="message-error" error={error("message")}/></label>
    {state.message&&<p role="alert" className="rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error sm:col-span-2">{state.message}</p>}
    <Button className="sm:col-span-2" disabled={pending}>{pending ? "Mengirim…" : "Kirim pesan"}</Button>
  </form>;
}
function Field({label,name,type="text",required=true,error}:{label:string;name:string;type?:string;required?:boolean;error?:string}){const errorId=`${name}-error`;return <label><span className="mb-2 block text-sm font-semibold">{label}</span><Input name={name} type={type} required={required} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} className={fieldErrorClass(error)}/><FieldError id={errorId} error={error}/></label>}
