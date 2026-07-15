"use client";

import { useActionState } from "react";
import { createServiceAction, updateServiceAction } from "@/features/services/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type EditableService = { id: string; title: string; slug: string; summary: string; description: string; category: string; startingPrice: string | null; deliveryEstimate: string | null; revisionGuidance: string | null; deliverables: string[]; technologies: string[]; coverImageUrl: string | null; isFeatured: boolean; isPublished: boolean };

export function ServiceEditor({ service }: { service?: EditableService }) {
  const [state, action, pending] = useActionState(service ? updateServiceAction : createServiceAction, {});
  const error = (name: string) => state.errors?.[name]?.[0];
  return <form action={action} className="space-y-6">
    {service && <input type="hidden" name="id" value={service.id} />}
    <section className="grid gap-5 md:grid-cols-2">
      <Field label="Nama layanan" name="title" defaultValue={service?.title} error={error("title")} />
      <Field label="Slug URL" name="slug" defaultValue={service?.slug} placeholder="website-development" error={error("slug")} />
      <Field label="Kategori" name="category" defaultValue={service?.category} placeholder="Web Development" error={error("category")} />
      <Field label="Harga mulai dari (IDR)" name="startingPrice" type="number" min="0" step="1000" defaultValue={service?.startingPrice ?? ""} error={error("startingPrice")} />
      <Field label="Estimasi pengerjaan" name="deliveryEstimate" defaultValue={service?.deliveryEstimate ?? ""} placeholder="14–30 hari" error={error("deliveryEstimate")} />
      <Field label="Panduan revisi" name="revisionGuidance" defaultValue={service?.revisionGuidance ?? ""} placeholder="Sesuai quotation" error={error("revisionGuidance")} />
      <Field label="URL cover image (opsional)" name="coverImageUrl" type="url" defaultValue={service?.coverImageUrl ?? ""} className="md:col-span-2" error={error("coverImageUrl")} />
    </section>
    <Area label="Ringkasan layanan" name="summary" defaultValue={service?.summary} className="min-h-24" error={error("summary")} />
    <Area label="Deskripsi lengkap" name="description" defaultValue={service?.description} error={error("description")} />
    <div className="grid gap-6 md:grid-cols-2">
      <Area label="Deliverables" hint="Satu item per baris." name="deliverables" defaultValue={service?.deliverables.join("\n")} error={error("deliverables")} />
      <Area label="Teknologi / keahlian" hint="Satu item per baris." name="technologies" defaultValue={service?.technologies.join("\n")} error={error("technologies")} />
    </div>
    <div className="flex flex-wrap gap-5 rounded-[14px] border border-border bg-surface-container/40 p-5"><Check label="Tampilkan sebagai layanan unggulan" name="isFeatured" defaultChecked={service?.isFeatured ?? false} /><Check label="Publikasikan ke halaman publik" name="isPublished" defaultChecked={service?.isPublished ?? false} /></div>
    {state.message && <p role="status" className="rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">{state.message}</p>}
    <div className="flex justify-end"><Button size="lg" disabled={pending}>{pending ? "Menyimpan…" : service ? "Simpan perubahan" : "Buat layanan"}</Button></div>
  </form>;
}

function Field({ label, name, error, className, ...props }: React.ComponentProps<typeof Input> & { label: string; name: string; error?: string }) { return <label className={className}><span className="mb-2 block text-sm font-semibold">{label}</span><Input name={name} required={name !== "startingPrice" && name !== "deliveryEstimate" && name !== "revisionGuidance" && name !== "coverImageUrl"} {...props} />{error && <span role="alert" className="mt-2 block text-xs text-error">{error}</span>}</label>; }
function Area({ label, hint, name, error, className, ...props }: React.ComponentProps<typeof Textarea> & { label: string; hint?: string; name: string; error?: string }) { return <label><span className="mb-2 block text-sm font-semibold">{label}</span>{hint && <span className="-mt-1 mb-2 block text-xs text-secondary">{hint}</span>}<Textarea name={name} required className={className} {...props} />{error && <span role="alert" className="mt-2 block text-xs text-error">{error}</span>}</label>; }
function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked: boolean }) { return <label className="flex items-center gap-3 text-sm font-semibold"><input name={name} type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-primary" />{label}</label>; }
