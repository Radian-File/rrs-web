"use client";

import { useActionState, useRef } from "react";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";

type RegisterLabels = { fullName: string; whatsapp: string; email: string; company: string; password: string; confirmPassword: string; create: string; creating: string };

export function RegisterForm({ labels, redirectTo }: { labels: RegisterLabels; redirectTo?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(registerAction, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message), ["password", "confirmPassword"]);
  const error = (field: string) => state.errors?.[field]?.[0];
  const passwordKey = `${state.message ?? ""}:${error("password") ?? ""}:${error("confirmPassword") ?? ""}`;

  return <form ref={formRef} action={action} onSubmit={capture} className="grid gap-5 sm:grid-cols-2">
    <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
    <Field label={labels.fullName} name="name" error={error("name")} />
    <Field label={labels.whatsapp} name="whatsappNumber" error={error("whatsappNumber")} />
    <Field label={labels.email} name="email" type="email" error={error("email")} className="sm:col-span-2" />
    <Field label={labels.company} name="companyName" error={error("companyName")} className="sm:col-span-2" required={false} />
    <Field key={`password-${passwordKey}`} label={labels.password} name="password" type="password" error={error("password")} />
    <Field key={`confirm-${passwordKey}`} label={labels.confirmPassword} name="confirmPassword" type="password" error={error("confirmPassword")} />
    {state.message && <p role="alert" className="rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error sm:col-span-2">{state.message}</p>}
    <Button className="sm:col-span-2" size="lg" disabled={pending}>{pending ? labels.creating : labels.create}</Button>
  </form>;
}

function Field({ label, name, type = "text", error, className, required = true }: { label: string; name: string; type?: string; error?: string; className?: string; required?: boolean }) { const errorId = `${name}-error`; return <div className={className}><label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}</label><Input id={name} name={name} type={type} required={required} autoComplete={type === "password" ? "new-password" : undefined} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={fieldErrorClass(error)} /><FieldError id={errorId} error={error}/></div>; }
