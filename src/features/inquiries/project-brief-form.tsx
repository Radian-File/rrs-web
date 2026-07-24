"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ConversionNotice } from "@/components/conversion/conversion-notice";
import { ConversionStepper } from "@/components/conversion/conversion-stepper";
import { Button } from "@/components/ui/button";
import { FieldError, fieldErrorClass } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRetainedFormValues } from "@/components/ui/use-retained-form-values";
import { submitProjectBrief } from "@/features/inquiries/actions";
import { projectBriefSchema } from "@/features/inquiries/schemas";
import { cn } from "@/lib/utils";

const selectClass =
  "h-12 w-full rounded-[10px] border border-border-strong bg-background/70 px-4 text-sm text-foreground outline-none transition-[background-color,border-color,box-shadow] duration-150 focus:border-primary focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error aria-invalid:bg-error-soft/30";
const stepOneSchema = projectBriefSchema.pick({
  clientName: true,
  clientPhone: true,
  clientEmail: true,
  companyName: true,
  serviceSlug: true,
});
const stepTwoSchema = projectBriefSchema.pick({
  projectTitle: true,
  projectType: true,
  targetUsers: true,
  projectDescription: true,
  projectGoals: true,
  requiredFeatures: true,
});

export function ProjectBriefForm({
  services,
  selectedService,
  client,
  isId,
}: {
  services: { slug: string; title: string }[];
  selectedService?: string;
  client: { id: string; name: string; email: string; phone: string; companyName: string };
  isId: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const draftKey = `rrs:brief:${client.id}:${selectedService ?? "custom"}`;
  const [step, setStep] = useState(1);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [draftRestored, setDraftRestored] = useState(false);
  const [state, action, pending] = useActionState(submitProjectBrief, {});
  const { capture } = useRetainedFormValues(formRef, Boolean(state.errors || state.message), ["attachment"]);
  const error = (name: string) => clientErrors[name]?.[0] ?? state.errors?.[name]?.[0];
  const copy = isId
    ? {
        formLabel: "Technical brief",
        progressLabel: "Progres technical brief",
        stepStatuses: { complete: "selesai", current: "langkah saat ini", upcoming: "belum dimulai" },
        steps: ["Identitas", "Kebutuhan", "Kesiapan"],
        stepDetails: [
          {
            kicker: "Langkah 1 dari 3",
            title: "Konfirmasi identitas dan layanan",
            description: "Data kontak berasal dari akun Client yang sedang login dan tidak dapat diedit dari brief ini.",
          },
          {
            kicker: "Langkah 2 dari 3",
            title: "Jelaskan kebutuhan project",
            description: "Berikan konteks yang cukup agar ruang lingkup awal dapat ditinjau sebelum quotation dibuat.",
          },
          {
            kicker: "Langkah 3 dari 3",
            title: "Lengkapi detail kesiapan",
            description: "Tambahkan deadline, referensi, dan kesiapan teknis bila informasinya sudah tersedia.",
          },
        ],
        identityHint: "Identitas brief diambil dari akun Client yang sedang login.",
        draftTitle: "Draft browser dipulihkan",
        draftDescription: "Isian tersimpan telah dikembalikan. File pendukung perlu dipilih kembali sebelum dikirim.",
        back: "Kembali",
        continue: "Lanjutkan",
        submitting: "Mengirim…",
        submit: "Kirim Technical Brief",
        fields: {
          clientName: "Nama lengkap",
          clientPhone: "Nomor WhatsApp",
          clientEmail: "Email",
          companyName: "Perusahaan (opsional)",
          serviceSlug: "Layanan yang diminati",
          projectTitle: "Judul project",
          projectType: "Jenis project",
          targetUsers: "Target user (opsional)",
          budgetRange: "Rentang budget (opsional)",
          projectDescription: "Deskripsi project",
          projectGoals: "Tujuan project",
          requiredFeatures: "Fitur yang dibutuhkan",
          expectedDeadline: "Target deadline (opsional)",
          referenceLinks: "Link referensi (opsional)",
          hasDesign: "Status desain",
          projectMode: "Mode project",
          hasDomain: "Domain",
          hasHosting: "Hosting",
          needsMaintenance: "Maintenance",
          attachment: "File pendukung (opsional)",
        },
        placeholders: {
          projectType: "Website, dashboard, redesign…",
          budgetRange: "Rp5.000.000–Rp10.000.000",
          projectDescription: "Jelaskan konteks saat ini dan project yang ingin dibangun.",
          projectGoals: "Apa yang ingin ditingkatkan atau dicapai melalui project ini?",
          requiredFeatures: "Satu fitur per baris",
          referenceLinks: "Satu link per baris",
        },
        options: {
          customService: "Custom / belum yakin",
          designNo: "Belum ada desain",
          designPartial: "Sebagian / hanya referensi",
          designYes: "Desain sudah siap",
          projectNew: "Project baru",
          projectRedesign: "Redesign",
          no: "Belum",
          yes: "Sudah tersedia",
          maintenanceNo: "Belum yakin / tidak dibutuhkan",
          maintenanceYes: "Dibutuhkan",
        },
        fileHint: "JPG, PNG, WebP, atau PDF. Maksimum 10 MB. File tidak disimpan dalam draft browser.",
      }
    : {
        formLabel: "Technical brief",
        progressLabel: "Technical brief progress",
        stepStatuses: { complete: "complete", current: "current step", upcoming: "not started" },
        steps: ["Identity", "Requirements", "Readiness"],
        stepDetails: [
          {
            kicker: "Step 1 of 3",
            title: "Confirm your identity and service",
            description: "Contact details come from the signed-in Client account and cannot be edited from this brief.",
          },
          {
            kicker: "Step 2 of 3",
            title: "Describe the project requirements",
            description: "Provide enough context for the initial scope to be reviewed before a quotation is created.",
          },
          {
            kicker: "Step 3 of 3",
            title: "Complete the readiness details",
            description: "Add the deadline, references, and technical readiness when that information is available.",
          },
        ],
        identityHint: "The brief identity comes from the signed-in Client account.",
        draftTitle: "Browser draft restored",
        draftDescription: "Saved entries have been restored. Select the supporting file again before submitting.",
        back: "Back",
        continue: "Continue",
        submitting: "Submitting…",
        submit: "Submit Technical Brief",
        fields: {
          clientName: "Full name",
          clientPhone: "WhatsApp number",
          clientEmail: "Email",
          companyName: "Company (optional)",
          serviceSlug: "Service of interest",
          projectTitle: "Project title",
          projectType: "Project type",
          targetUsers: "Target users (optional)",
          budgetRange: "Budget range (optional)",
          projectDescription: "Project description",
          projectGoals: "Project goals",
          requiredFeatures: "Required features",
          expectedDeadline: "Target deadline (optional)",
          referenceLinks: "Reference links (optional)",
          hasDesign: "Design status",
          projectMode: "Project mode",
          hasDomain: "Domain",
          hasHosting: "Hosting",
          needsMaintenance: "Maintenance",
          attachment: "Supporting file (optional)",
        },
        placeholders: {
          projectType: "Website, dashboard, redesign…",
          budgetRange: "IDR 5,000,000–IDR 10,000,000",
          projectDescription: "Describe the current context and the project you want to build.",
          projectGoals: "What should this project improve or achieve?",
          requiredFeatures: "One feature per line",
          referenceLinks: "One link per line",
        },
        options: {
          customService: "Custom / not sure yet",
          designNo: "No design yet",
          designPartial: "Partial / reference only",
          designYes: "Design is ready",
          projectNew: "New project",
          projectRedesign: "Redesign",
          no: "Not yet",
          yes: "Already available",
          maintenanceNo: "Not sure / not needed",
          maintenanceYes: "Needed",
        },
        fileHint: "JPG, PNG, WebP, or PDF. Maximum 10 MB. Files are not stored in the browser draft.",
      };
  const activeStep = copy.stepDetails[step - 1];

  useEffect(() => {
    const raw = window.sessionStorage.getItem(draftKey);
    if (!raw || !formRef.current) return;
    try {
      const draft = JSON.parse(raw) as { expiresAt: number; values: Record<string, string> };
      if (draft.expiresAt < Date.now()) {
        window.sessionStorage.removeItem(draftKey);
        return;
      }
      for (const [name, value] of Object.entries(draft.values)) {
        const element = formRef.current.elements.namedItem(name);
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        ) {
          element.value = value;
        }
      }
      if (Object.keys(draft.values).length > 0) {
        window.requestAnimationFrame(() => setDraftRestored(true));
      }
    } catch {
      window.sessionStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  const saveDraft = () => {
    if (!formRef.current) return;
    const values: Record<string, string> = {};
    for (const element of Array.from(formRef.current.elements)) {
      if (
        !(
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        ) ||
        !element.name ||
        element.type === "file" ||
        ["clientName", "clientEmail", "clientPhone", "companyName"].includes(element.name)
      ) {
        continue;
      }
      values[element.name] = element.value;
    }
    window.sessionStorage.setItem(
      draftKey,
      JSON.stringify({ expiresAt: Date.now() + 30 * 60 * 1000, values }),
    );
  };

  const focusStepHeading = () => {
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const focusFirstError = (fieldErrors: Record<string, string[] | undefined>) => {
    const firstInvalidName = Object.keys(fieldErrors).find((name) => fieldErrors[name]?.length);
    if (!firstInvalidName || !formRef.current) return;
    const element = formRef.current.elements.namedItem(firstInvalidName);
    window.requestAnimationFrame(() => {
      if (element instanceof HTMLElement) element.focus();
    });
  };

  const continueToNextStep = () => {
    if (!formRef.current) return;
    const result = (step === 1 ? stepOneSchema : stepTwoSchema).safeParse(
      Object.fromEntries(new FormData(formRef.current)),
    );
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setClientErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }
    setClientErrors({});
    setStep((value) => Math.min(3, value + 1));
    focusStepHeading();
  };

  return (
    <form
      ref={formRef}
      action={action}
      aria-label={copy.formLabel}
      onSubmit={() => {
        saveDraft();
        capture();
      }}
      onInput={(event) => {
        saveDraft();
        const name = (event.target as HTMLInputElement).name;
        if (name in clientErrors) {
          setClientErrors((errors) => {
            const next = { ...errors };
            delete next[name];
            return next;
          });
        }
      }}
    >
      <ConversionStepper
        currentStep={step}
        label={copy.progressLabel}
        statusLabels={copy.stepStatuses}
        steps={copy.steps}
      />

      <div className="mt-7 border-t border-border pt-7 md:mt-8 md:pt-8">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{activeStep.kicker}</p>
        <h2
          ref={stepHeadingRef}
          id="technical-brief-step-heading"
          tabIndex={-1}
          className="mt-3 scroll-mt-28 font-display text-2xl font-bold tracking-[-.035em] outline-none md:text-3xl"
        >
          {activeStep.title}
        </h2>
        <p id="technical-brief-step-description" className="mt-3 max-w-2xl text-sm leading-7 text-secondary">
          {activeStep.description}
        </p>
      </div>

      {draftRestored ? (
        <div className="mt-6">
          <ConversionNotice title={copy.draftTitle}>{copy.draftDescription}</ConversionNotice>
        </div>
      ) : null}

      <section
        id="brief-step-1"
        hidden={step !== 1}
        aria-labelledby="technical-brief-step-heading"
        aria-describedby="technical-brief-step-description"
        className="mt-7"
      >
        <div className="mb-6 border-l-2 border-primary bg-accent-soft/55 px-4 py-3 text-sm leading-6 text-secondary">
          {copy.identityHint}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={copy.fields.clientName}
            name="clientName"
            defaultValue={client.name}
            readOnly
            error={error("clientName")}
          />
          <Field
            label={copy.fields.clientPhone}
            name="clientPhone"
            defaultValue={client.phone}
            readOnly
            error={error("clientPhone")}
          />
          <Field
            label={copy.fields.clientEmail}
            name="clientEmail"
            type="email"
            defaultValue={client.email}
            readOnly
            error={error("clientEmail")}
            hint={copy.identityHint}
          />
          <Field
            label={copy.fields.companyName}
            name="companyName"
            defaultValue={client.companyName}
            readOnly
            required={false}
            error={error("companyName")}
          />
          <SelectField
            label={copy.fields.serviceSlug}
            name="serviceSlug"
            defaultValue={selectedService ?? ""}
            error={error("serviceSlug")}
            className="sm:col-span-2"
          >
            <option value="">{copy.options.customService}</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </SelectField>
        </div>
      </section>

      <section
        id="brief-step-2"
        hidden={step !== 2}
        aria-labelledby="technical-brief-step-heading"
        aria-describedby="technical-brief-step-description"
        className="mt-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={copy.fields.projectTitle}
            name="projectTitle"
            className="sm:col-span-2"
            error={error("projectTitle")}
          />
          <Field
            label={copy.fields.projectType}
            name="projectType"
            placeholder={copy.placeholders.projectType}
            error={error("projectType")}
          />
          <Field
            label={copy.fields.targetUsers}
            name="targetUsers"
            required={false}
            error={error("targetUsers")}
          />
          <Field
            label={copy.fields.budgetRange}
            name="budgetRange"
            required={false}
            placeholder={copy.placeholders.budgetRange}
            error={error("budgetRange")}
          />
          <Area
            label={copy.fields.projectDescription}
            name="projectDescription"
            className="sm:col-span-2"
            placeholder={copy.placeholders.projectDescription}
            error={error("projectDescription")}
          />
          <Area
            label={copy.fields.projectGoals}
            name="projectGoals"
            className="sm:col-span-2"
            placeholder={copy.placeholders.projectGoals}
            error={error("projectGoals")}
          />
          <Area
            label={copy.fields.requiredFeatures}
            name="requiredFeatures"
            className="sm:col-span-2"
            placeholder={copy.placeholders.requiredFeatures}
            error={error("requiredFeatures")}
          />
        </div>
      </section>

      <section
        id="brief-step-3"
        hidden={step !== 3}
        aria-labelledby="technical-brief-step-heading"
        aria-describedby="technical-brief-step-description"
        className="mt-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={copy.fields.expectedDeadline}
            name="expectedDeadline"
            type="date"
            required={false}
            error={error("expectedDeadline")}
          />
          <Area
            label={copy.fields.referenceLinks}
            name="referenceLinks"
            required={false}
            className="sm:col-span-2"
            placeholder={copy.placeholders.referenceLinks}
            error={error("referenceLinks")}
          />
          <SelectField label={copy.fields.hasDesign} name="hasDesign" error={error("hasDesign")}>
            <option value="no">{copy.options.designNo}</option>
            <option value="partial">{copy.options.designPartial}</option>
            <option value="yes">{copy.options.designYes}</option>
          </SelectField>
          <SelectField label={copy.fields.projectMode} name="projectMode" error={error("projectMode")}>
            <option value="new">{copy.options.projectNew}</option>
            <option value="redesign">{copy.options.projectRedesign}</option>
          </SelectField>
          <SelectField label={copy.fields.hasDomain} name="hasDomain" error={error("hasDomain")}>
            <option value="no">{copy.options.no}</option>
            <option value="yes">{copy.options.yes}</option>
          </SelectField>
          <SelectField label={copy.fields.hasHosting} name="hasHosting" error={error("hasHosting")}>
            <option value="no">{copy.options.no}</option>
            <option value="yes">{copy.options.yes}</option>
          </SelectField>
          <SelectField label={copy.fields.needsMaintenance} name="needsMaintenance" error={error("needsMaintenance")}>
            <option value="no">{copy.options.maintenanceNo}</option>
            <option value="yes">{copy.options.maintenanceYes}</option>
          </SelectField>
          <div>
            <label htmlFor="attachment" className="mb-2 block text-sm font-semibold text-foreground">
              {copy.fields.attachment}
            </label>
            <Input
              id="attachment"
              name="attachment"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              aria-describedby="attachment-hint"
              className="h-auto min-h-16 py-3"
            />
            <span id="attachment-hint" className="mt-2 block text-xs leading-5 text-secondary">
              {copy.fileHint}
            </span>
          </div>
        </div>
      </section>

      {state.message ? (
        <div className="mt-6">
          <ConversionNotice tone="error">{state.message}</ConversionNotice>
        </div>
      ) : null}

      <div className="-mx-5 mt-8 border-t border-border px-5 pt-5 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1 || pending}
            className="w-full sm:w-auto"
            onClick={() => {
              setClientErrors({});
              setStep((value) => Math.max(1, value - 1));
              focusStepHeading();
            }}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.back}
          </Button>
          {step < 3 ? (
            <Button type="button" className="w-full sm:w-auto" onClick={continueToNextStep}>
              {copy.continue}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? copy.submitting : copy.submit}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  error,
  className,
  placeholder,
  hint,
  defaultValue,
  readOnly = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
  readOnly?: boolean;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={[hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
        className={fieldErrorClass(error, "bg-background/70")}
      />
      {hint ? (
        <span id={hintId} className="mt-2 block text-xs leading-5 text-secondary">
          {hint}
        </span>
      ) : null}
      <FieldError id={errorId} error={error} />
    </div>
  );
}

function Area({
  label,
  name,
  required = true,
  error,
  className,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <Textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldErrorClass(error, "bg-background/70")}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  error,
  className,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(selectClass, error && "border-error bg-error-soft/30")}
      >
        {children}
      </select>
      <FieldError id={errorId} error={error} />
    </div>
  );
}
