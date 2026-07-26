"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";
import { updateServiceComplexityLevelAction } from "@/features/services/actions";

export type EditableComplexityLevel = {
  id: string;
  serviceId: string;
  code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
  title: string;
  summary: string;
  indicators: string[];
  escalationSignals: string[];
  startingPrice: string | null;
  isPublished: boolean;
};

export function ServiceComplexityLevelEditor({ level }: { level: EditableComplexityLevel }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(updateServiceComplexityLevelAction, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message));
  const error = (name: string) => state.errors?.[name]?.[0];

  return (
    <form ref={formRef} action={action} onSubmit={capture} className="space-y-4 rounded-[16px] border border-border bg-surface-container/35 p-5">
      <input type="hidden" name="id" value={level.id} />
      <input type="hidden" name="serviceId" value={level.serviceId} />
      <input type="hidden" name="code" value={level.code} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">{level.code}</p>
        <label className="flex items-center gap-2 text-sm font-semibold"><input name="isPublished" type="checkbox" defaultChecked={level.isPublished} className="size-4 accent-primary" />Tampilkan di Pricing Guide</label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama level" name="title" defaultValue={level.title} error={error("title")} />
        <Field label="Starting estimate (IDR)" name="startingPrice" type="number" min="0" step="1000" defaultValue={level.startingPrice ?? ""} required={false} error={error("startingPrice")} />
      </div>
      <Area label="Penjelasan level" name="summary" defaultValue={level.summary} error={error("summary")} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Area label="Indikator kompleksitas" hint="Satu indikator per baris." name="indicators" defaultValue={level.indicators.join("\n")} error={error("indicators")} />
        <Area label="Sinyal naik level" hint="Satu sinyal per baris." name="escalationSignals" defaultValue={level.escalationSignals.join("\n")} error={error("escalationSignals")} />
      </div>
      {state.message ? <p role="status" className="rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">{state.message}</p> : null}
      <div className="flex justify-end"><Button size="sm" disabled={pending}>{pending ? "Menyimpan…" : "Simpan level"}</Button></div>
    </form>
  );
}

function Field({ label, name, error, required = true, ...props }: React.ComponentProps<typeof Input> & { label: string; name: string; error?: string; required?: boolean }) {
  const errorId = `${name}-error`;
  return <label><span className="mb-2 block text-sm font-semibold">{label}</span><Input name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={fieldErrorClass(error)} {...props} /><FieldError id={errorId} error={error} /></label>;
}

function Area({ label, hint, name, error, ...props }: React.ComponentProps<typeof Textarea> & { label: string; hint?: string; name: string; error?: string }) {
  const errorId = `${name}-error`;
  return <label><span className="mb-2 block text-sm font-semibold">{label}</span>{hint ? <span className="-mt-1 mb-2 block text-xs text-secondary">{hint}</span> : null}<Textarea name={name} required aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={fieldErrorClass(error, "min-h-28")} {...props} /><FieldError id={errorId} error={error} /></label>;
}
