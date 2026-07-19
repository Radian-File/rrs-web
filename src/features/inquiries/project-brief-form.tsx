"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { submitProjectBrief } from "@/features/inquiries/actions";
import { projectBriefSchema } from "@/features/inquiries/schemas";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";

const selectClass = "h-12 w-full rounded-[12px] border border-border bg-surface px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";
const stepOneSchema = projectBriefSchema.pick({ clientName: true, clientPhone: true, clientEmail: true, companyName: true, serviceSlug: true });
const stepTwoSchema = projectBriefSchema.pick({ projectTitle: true, projectType: true, targetUsers: true, projectDescription: true, projectGoals: true, requiredFeatures: true });

export function ProjectBriefForm({ services, selectedService, client }: { services: { slug: string; title: string }[]; selectedService?: string; client: { name: string; email: string; phone: string; companyName: string } }) {
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = `rrs:brief:${selectedService ?? "custom"}`;
  const [step, setStep] = useState(1);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [state, action, pending] = useActionState(submitProjectBrief, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message), ["attachment"]);
  const error = (name: string) => clientErrors[name]?.[0] ?? state.errors?.[name]?.[0];
  useEffect(() => {
    const raw = window.sessionStorage.getItem(draftKey);
    if (!raw || !formRef.current) return;
    try {
      const draft = JSON.parse(raw) as { expiresAt: number; values: Record<string, string> };
      if (draft.expiresAt < Date.now()) { window.sessionStorage.removeItem(draftKey); return; }
      for (const [name, value] of Object.entries(draft.values)) {
        const element = formRef.current.elements.namedItem(name);
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) element.value = value;
      }
    } catch { window.sessionStorage.removeItem(draftKey); }
  }, [draftKey]);
  const saveDraft = () => {
    if (!formRef.current) return;
    const values: Record<string, string> = {};
    for (const element of Array.from(formRef.current.elements)) {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) || !element.name || element.type === "file" || ["clientName", "clientEmail", "clientPhone", "companyName"].includes(element.name)) continue;
      values[element.name] = element.value;
    }
    window.sessionStorage.setItem(draftKey, JSON.stringify({ expiresAt: Date.now() + 30 * 60 * 1000, values }));
  };
  const continueToNextStep = () => {
    if (!formRef.current) return;
    const result = (step === 1 ? stepOneSchema : stepTwoSchema).safeParse(Object.fromEntries(new FormData(formRef.current)));
    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }
    setClientErrors({});
    setStep((value) => Math.min(3, value + 1));
  };

  return <form ref={formRef} action={action} onSubmit={() => { saveDraft(); capture(); }} onInput={(event) => { saveDraft(); const name = (event.target as HTMLInputElement).name; if (name in clientErrors) setClientErrors((errors) => { const next = { ...errors }; delete next[name]; return next; }); }}>
    <div className="mb-8 flex items-center gap-3">{[1,2,3].map((item)=><div key={item} className="flex flex-1 items-center gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${step>=item?"bg-primary text-white":"bg-surface-container text-secondary"}`}>{item}</span>{item<3&&<span className={`h-px flex-1 ${step>item?"bg-primary":"bg-border"}`}/>}</div>)}</div>
    <section hidden={step!==1} className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" name="clientName" defaultValue={client.name} readOnly error={error("clientName")} />
      <Field label="WhatsApp number" name="clientPhone" defaultValue={client.phone} readOnly error={error("clientPhone")} />
      <Field label="Email" name="clientEmail" type="email" defaultValue={client.email} readOnly error={error("clientEmail")} hint="Identitas brief diambil dari akun Client yang sedang login." />
      <Field label="Company (optional)" name="companyName" defaultValue={client.companyName} readOnly required={false} error={error("companyName")} />
      <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Service of interest</span><select name="serviceSlug" defaultValue={selectedService ?? ""} className={selectClass}><option value="">Custom / not sure yet</option>{services.map((service)=><option key={service.slug} value={service.slug}>{service.title}</option>)}</select></label>
    </section>
    <section hidden={step!==2} className="grid gap-5 sm:grid-cols-2">
      <Field label="Judul project" name="projectTitle" className="sm:col-span-2" error={error("projectTitle")} />
      <Field label="Jenis project" name="projectType" placeholder="Website, dashboard, redesign…" error={error("projectType")} />
      <Field label="Target user (opsional)" name="targetUsers" required={false} error={error("targetUsers")} />
      <Field label="Rentang budget" name="budgetRange" required={false} placeholder="Rp5.000.000–Rp10.000.000" error={error("budgetRange")} />
      <Area label="Deskripsi project" name="projectDescription" className="sm:col-span-2" placeholder="Jelaskan konteks saat ini dan project yang ingin dibangun." error={error("projectDescription")} />
      <Area label="Tujuan project" name="projectGoals" className="sm:col-span-2" placeholder="Apa yang ingin ditingkatkan atau dicapai melalui project ini?" error={error("projectGoals")} />
      <Area label="Fitur yang dibutuhkan" name="requiredFeatures" className="sm:col-span-2" placeholder="Satu fitur per baris" error={error("requiredFeatures")} />
    </section>
    <section hidden={step!==3} className="grid gap-5 sm:grid-cols-2">
      <Field label="Target deadline (opsional)" name="expectedDeadline" type="date" required={false} error={error("expectedDeadline")} />
      <Area label="Reference links (optional)" name="referenceLinks" required={false} className="sm:col-span-2" placeholder="One link per line" error={error("referenceLinks")} />
      <label><span className="mb-2 block text-sm font-semibold">Design status</span><select name="hasDesign" className={selectClass}><option value="no">No design yet</option><option value="partial">Partial / reference only</option><option value="yes">Design is ready</option></select></label>
      <label><span className="mb-2 block text-sm font-semibold">Project mode</span><select name="projectMode" className={selectClass}><option value="new">New project</option><option value="redesign">Redesign</option></select></label>
      <label><span className="mb-2 block text-sm font-semibold">Domain</span><select name="hasDomain" className={selectClass}><option value="no">Not yet</option><option value="yes">Already available</option></select></label>
      <label><span className="mb-2 block text-sm font-semibold">Hosting</span><select name="hasHosting" className={selectClass}><option value="no">Not yet</option><option value="yes">Already available</option></select></label>
      <label><span className="mb-2 block text-sm font-semibold">Maintenance</span><select name="needsMaintenance" className={selectClass}><option value="no">Not sure / not needed</option><option value="yes">Needed</option></select></label>
      <label><span className="mb-2 block text-sm font-semibold">Supporting file (optional)</span><Input name="attachment" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="pt-3" /><span className="mt-2 block text-xs text-secondary">JPG, PNG, WebP, or PDF. Maximum 10 MB.</span></label>
    </section>
    {state.message&&<p role="alert" className="mt-6 rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error">{state.message}</p>}
    <div className="mt-8 flex justify-between gap-3"><Button type="button" variant="ghost" disabled={step===1||pending} onClick={()=>{ setClientErrors({}); setStep((value)=>Math.max(1,value-1)); }}><ArrowLeft className="size-4"/>Back</Button>{step<3?<Button type="button" onClick={continueToNextStep}>Continue<ArrowRight className="size-4"/></Button>:<Button type="submit" disabled={pending}>{pending?"Submitting…":"Submit Project Brief"}</Button>}</div>
  </form>;
}

function Field({label,name,type="text",required=true,error,className,placeholder,hint,defaultValue,readOnly=false}:{label:string;name:string;type?:string;required?:boolean;error?:string;className?:string;placeholder?:string;hint?:string;defaultValue?:string;readOnly?:boolean}){const errorId=`${name}-error`;const hintId=`${name}-hint`;return <label className={className}><span className="mb-2 block text-sm font-semibold">{label}</span><Input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} readOnly={readOnly} aria-invalid={Boolean(error)} aria-describedby={[hint?hintId:"",error?errorId:""].filter(Boolean).join(" ")||undefined} className={fieldErrorClass(error)}/>{hint&&<span id={hintId} className="mt-2 block text-xs leading-5 text-secondary">{hint}</span>}<FieldError id={errorId} error={error}/></label>}
function Area({label,name,required=true,error,className,placeholder}:{label:string;name:string;required?:boolean;error?:string;className?:string;placeholder?:string}){const errorId=`${name}-error`;return <label className={className}><span className="mb-2 block text-sm font-semibold">{label}</span><Textarea name={name} required={required} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} className={fieldErrorClass(error)}/><FieldError id={errorId} error={error}/></label>}
