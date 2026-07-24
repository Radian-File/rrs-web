"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import {
  createStudioStackAction,
  setStudioStackPublicationAction,
  updateStudioStackAction,
} from "@/features/studio-stack/actions";
import {
  studioStackCategories,
  studioStackCategoryLabels,
  type StudioStackCategoryValue,
} from "@/features/studio-stack/schema";

export type StudioStackEditorItem = {
  id: string;
  name: string;
  category: StudioStackCategoryValue;
  sortOrder: number;
  isPublished: boolean;
};

const selectClass = "h-11 w-full rounded-[10px] border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export function StudioStackManager({ items }: { items: StudioStackEditorItem[] }) {
  return (
    <div className="space-y-8">
      <StackCreateForm />
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Current stack</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-.035em]">Control what shows up on About.</h3>
          </div>
          <p className="text-xs text-secondary">{items.filter((item) => item.isPublished).length} published · {items.length} total</p>
        </div>
        {items.length > 0 ? (
          <div className="mt-5 space-y-4">
            {items.map((item) => <StackItemEditor key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="mt-5 border border-dashed border-border bg-background p-6">
            <p className="font-semibold">Belum ada technology.</p>
            <p className="mt-2 text-sm leading-6 text-secondary">Tambahkan item sebagai draft, review category dan urutannya, lalu publish saat sudah siap.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StackCreateForm() {
  const [state, action, pending] = useActionState(createStudioStackAction, {});
  return (
    <form action={action} className="rounded-[18px] border border-border bg-background p-5 md:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-primary"><Plus className="size-4" aria-hidden="true" /></span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">New technology</p>
          <h3 className="mt-1 font-display text-xl font-extrabold">Add it as a draft first.</h3>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_120px_auto] md:items-end">
        <Field idPrefix="new" label="Technology" name="name" error={state.errors?.name?.[0]} placeholder="Next.js" />
        <CategoryField idPrefix="new" error={state.errors?.category?.[0]} />
        <Field idPrefix="new" label="Order" name="sortOrder" type="number" error={state.errors?.sortOrder?.[0]} defaultValue="0" />
        <Button type="submit" disabled={pending} className="h-11"><Plus className="size-4" aria-hidden="true" />{pending ? "Adding…" : "Add draft"}</Button>
      </div>
      {state.message && <p role="status" className="mt-4 text-sm font-semibold text-primary">{state.message}</p>}
    </form>
  );
}

function StackItemEditor({ item }: { item: StudioStackEditorItem }) {
  const [state, action, pending] = useActionState(updateStudioStackAction, {});
  return (
    <article className="rounded-[18px] border border-border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[.12em] ${item.isPublished ? "bg-accent-soft text-primary" : "bg-muted/10 text-secondary"}`}>{item.isPublished ? "Published" : "Draft"}</span>
          <span className="text-xs text-secondary">{studioStackCategoryLabels[item.category]}</span>
        </div>
        <form action={setStudioStackPublicationAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="isPublished" value={item.isPublished ? "false" : "true"} />
          <Button type="submit" variant="outline" size="sm">
            {item.isPublished ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            {item.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </form>
      </div>
      <form action={action} className="mt-5 grid gap-4 md:grid-cols-[1fr_220px_120px_auto] md:items-end">
        <input type="hidden" name="id" value={item.id} />
        <Field idPrefix={item.id} label="Technology" name="name" error={state.errors?.name?.[0]} defaultValue={item.name} />
        <CategoryField idPrefix={item.id} defaultValue={item.category} error={state.errors?.category?.[0]} />
        <Field idPrefix={item.id} label="Order" name="sortOrder" type="number" error={state.errors?.sortOrder?.[0]} defaultValue={String(item.sortOrder)} />
        <Button type="submit" variant="outline" disabled={pending} className="h-11"><Save className="size-4" aria-hidden="true" />{pending ? "Saving…" : "Save"}</Button>
      </form>
      {state.message && <p role="status" className="mt-4 text-sm font-semibold text-primary">{state.message}</p>}
    </article>
  );
}

function CategoryField({ idPrefix, defaultValue = "FRONTEND", error }: { idPrefix: string; defaultValue?: StudioStackCategoryValue; error?: string }) {
  const fieldId = `${idPrefix}-category`;
  const errorId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold">Category</label>
      <select id={fieldId} name="category" defaultValue={defaultValue} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={selectClass}>
        {studioStackCategories.map((category) => <option key={category} value={category}>{studioStackCategoryLabels[category]}</option>)}
      </select>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

function Field({
  idPrefix,
  label,
  name,
  type = "text",
  error,
  defaultValue,
  placeholder,
}: {
  idPrefix: string;
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const fieldId = `${idPrefix}-${name}`;
  const errorId = `${fieldId}-error`;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold">{label}</label>
      <Input id={fieldId} name={name} type={type} min={type === "number" ? 0 : undefined} max={type === "number" ? 9999 : undefined} required defaultValue={defaultValue} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={fieldErrorClass(error)} />
      <FieldError id={errorId} error={error} />
    </div>
  );
}
