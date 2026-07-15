"use client";

import { useActionState } from "react";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {});
  const error = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" name="name" error={error("name")} />
      <Field label="WhatsApp number" name="whatsappNumber" error={error("whatsappNumber")} />
      <Field label="Email" name="email" type="email" error={error("email")} className="sm:col-span-2" />
      <Field label="Company (optional)" name="companyName" error={error("companyName")} className="sm:col-span-2" />
      <Field label="Password" name="password" type="password" error={error("password")} />
      <Field label="Confirm password" name="confirmPassword" type="password" error={error("confirmPassword")} />
      {state.message && <p role="alert" className="rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error sm:col-span-2">{state.message}</p>}
      <Button className="sm:col-span-2" size="lg" disabled={pending}>{pending ? "Creating account…" : "Create Client Account"}</Button>
    </form>
  );
}

function Field({ label, name, type = "text", error, className }: { label: string; name: string; type?: string; error?: string; className?: string }) {
  return <div className={className}><label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}</label><Input id={name} name={name} type={type} required={!label.includes("optional")} autoComplete={type === "password" ? "new-password" : undefined} />{error && <p className="mt-2 text-xs text-error">{error}</p>}</div>;
}
