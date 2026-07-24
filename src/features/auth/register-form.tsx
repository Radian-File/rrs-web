"use client";

import { useActionState, useRef, useState } from "react";
import { CircleHelp } from "lucide-react";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";
import { cn } from "@/lib/utils";

type RegisterLabels = {
  fullName: string;
  whatsapp: string;
  whatsappHelp: string;
  whatsappHelpLabel: string;
  email: string;
  emailHelp: string;
  emailHelpLabel: string;
  company: string;
  password: string;
  confirmPassword: string;
  privacyNote: string;
  create: string;
  creating: string;
};

export function RegisterForm({ labels, redirectTo }: { labels: RegisterLabels; redirectTo?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(registerAction, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message), ["password", "confirmPassword"]);
  const error = (field: string) => state.errors?.[field]?.[0];
  const passwordKey = `${state.message ?? ""}:${error("password") ?? ""}:${error("confirmPassword") ?? ""}`;

  return (
    <form ref={formRef} action={action} onSubmit={capture} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
      <Field label={labels.fullName} name="name" error={error("name")} autoComplete="name" />
      <Field
        label={labels.whatsapp}
        name="whatsappNumber"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        helpText={labels.whatsappHelp}
        helpLabel={labels.whatsappHelpLabel}
        error={error("whatsappNumber")}
      />
      <Field
        label={labels.email}
        name="email"
        type="email"
        autoComplete="email"
        helpText={labels.emailHelp}
        helpLabel={labels.emailHelpLabel}
        error={error("email")}
        className="sm:col-span-2"
      />
      <Field label={labels.company} name="companyName" autoComplete="organization" error={error("companyName")} className="sm:col-span-2" required={false} />
      <Field key={`password-${passwordKey}`} label={labels.password} name="password" type="password" autoComplete="new-password" error={error("password")} />
      <Field key={`confirm-${passwordKey}`} label={labels.confirmPassword} name="confirmPassword" type="password" autoComplete="new-password" error={error("confirmPassword")} />
      {state.message && <p role="alert" className="rounded-[10px] border border-error/20 bg-error-soft px-4 py-3 text-sm text-error sm:col-span-2">{state.message}</p>}
      <Button className="sm:col-span-2" size="lg" disabled={pending}>{pending ? labels.creating : labels.create}</Button>
      <p className="text-xs leading-6 text-secondary sm:col-span-2">{labels.privacyNote}</p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  className,
  required = true,
  autoComplete,
  inputMode,
  helpText,
  helpLabel,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  className?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  helpText?: string;
  helpLabel?: string;
}) {
  const errorId = `${name}-error`;
  const helpId = `${name}-help`;
  const describedBy = [helpText ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={name} className="block text-sm font-semibold">{label}</label>
        {helpText && helpLabel && <FieldHelp id={helpId} label={helpLabel} text={helpText} />}
      </div>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={fieldErrorClass(error)}
      />
      {helpText && <span id={helpId} className="sr-only">{helpText}</span>}
      <FieldError id={errorId} error={error} />
    </div>
  );
}

function FieldHelp({ id, label, text }: { id: string; label: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          (event.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="grid size-6 place-items-center rounded-full border border-border bg-background text-secondary transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <CircleHelp className="size-3.5" aria-hidden="true" />
      </button>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-[min(18rem,78vw)] -translate-x-1/2 rounded-[12px] border border-border bg-foreground px-4 py-3 text-xs font-normal leading-5 text-background opacity-0 shadow-[0_18px_60px_rgba(0,0,0,.3)] transition-opacity",
          open ? "visible opacity-100" : "invisible",
        )}
      >
        {text}
      </span>
    </span>
  );
}
