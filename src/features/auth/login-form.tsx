"use client";

import { useActionState, useRef } from "react";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";

export function LoginForm({ redirectTo, recipientEmail, labels }: { redirectTo?: string; recipientEmail?: string; labels: { email: string; password: string; signIn: string; signingIn: string } }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(loginAction, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message), ["password"]);
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const passwordKey = `${state.message ?? ""}:${passwordError ?? ""}:${emailError ?? ""}`;

  return <form ref={formRef} action={action} onSubmit={capture} className="space-y-5">
    <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
    <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">{labels.email}</label><Input id="email" name="email" type="email" autoComplete="email" defaultValue={recipientEmail} readOnly={Boolean(recipientEmail)} required aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "email-error" : undefined} className={fieldErrorClass(emailError)} /><FieldError id="email-error" error={emailError}/>{recipientEmail&&<p className="mt-2 text-xs leading-5 text-secondary">Use the quotation recipient email to continue.</p>}</div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">{labels.password}</label><Input key={passwordKey} id="password" name="password" type="password" autoComplete="current-password" required aria-invalid={Boolean(passwordError)} aria-describedby={passwordError ? "password-error" : undefined} className={fieldErrorClass(passwordError)} /><FieldError id="password-error" error={passwordError}/></div>
    {state.message && <p role="alert" className="rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error">{state.message}</p>}
    <Button className="w-full" size="lg" disabled={pending}>{pending ? labels.signingIn : labels.signIn}</Button>
  </form>;
}
