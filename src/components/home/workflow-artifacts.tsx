import { Check, FileCheck2 } from "lucide-react";

type WorkflowArtifactsProps = {
  isId: boolean;
};

export function WorkflowArtifacts({ isId }: WorkflowArtifactsProps) {
  const copy = isId
    ? {
        figureLabel: "Kolase antarmuka workflow RRS untuk demonstrasi",
        caption: "Seluruh antarmuka dan status di bawah hanya untuk demonstrasi.",
        demo: "Demonstrasi",
        quotation: "RRS / Quotation",
        quotationTitle: "QT-DEMO-024",
        quotationStatus: "Draft ditinjau",
        preparedFor: "Disiapkan untuk",
        demoWorkspace: "Workspace demonstrasi",
        project: "Project",
        projectName: "Sistem website editorial",
        scope: "Ringkasan scope",
        scopeItems: ["Arah produk & konten", "Sistem antarmuka", "Development & QA"],
        finalEstimate: "Estimasi final",
        afterDiscussion: "Disusun setelah diskusi scope",
        progress: "RRS / Progress project",
        progressTitle: "Build & quality assurance",
        progressStatus: "Tahap aktif · 03 dari 05",
        progressSteps: ["Discovery selesai", "Arah disetujui", "Development berjalan"],
        operations: "RRS / Operasional",
        operationsTitle: "Ringkasan workflow",
        focus: "Fokus saat ini",
        focusValue: "Build & QA",
        next: "Berikutnya",
        nextValue: "Tinjauan client",
        record: "Dokumentasi",
        recordValue: "Aktif",
      }
    : {
        figureLabel: "Demonstration collage of the RRS workflow interface",
        caption: "All interfaces and statuses below are for demonstration only.",
        demo: "Demonstration",
        quotation: "RRS / Quotation",
        quotationTitle: "QT-DEMO-024",
        quotationStatus: "Draft in review",
        preparedFor: "Prepared for",
        demoWorkspace: "Demonstration workspace",
        project: "Project",
        projectName: "Editorial website system",
        scope: "Scope summary",
        scopeItems: ["Product & content direction", "Interface system", "Development & QA"],
        finalEstimate: "Final estimate",
        afterDiscussion: "Prepared after the scope discussion",
        progress: "RRS / Project progress",
        progressTitle: "Build & quality assurance",
        progressStatus: "Active stage · 03 of 05",
        progressSteps: ["Discovery complete", "Direction approved", "Development in progress"],
        operations: "RRS / Operations",
        operationsTitle: "Workflow overview",
        focus: "Current focus",
        focusValue: "Build & QA",
        next: "Up next",
        nextValue: "Client review",
        record: "Documentation",
        recordValue: "Active",
      };

  return (
    <figure
      className="relative mx-auto min-h-[700px] w-full max-w-[680px] sm:min-h-[660px] lg:min-h-[650px]"
      aria-label={copy.figureLabel}
    >
      <figcaption className="absolute bottom-0 left-0 z-40 max-w-[15rem] text-[10px] font-semibold uppercase leading-5 tracking-[0.14em] text-muted sm:text-xs">
        {copy.caption}
      </figcaption>

      <article
        className="absolute right-0 top-0 z-10 w-[78%] border border-primary/40 bg-primary-strong p-4 text-primary-strong-foreground shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:w-[68%] sm:p-6"
        aria-labelledby="demo-operations-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary-strong-foreground/15 pb-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary-strong-foreground sm:text-[10px]">
            {copy.operations}
          </p>
          <DemoLabel label={copy.demo} tone="dark" />
        </div>
        <h2 id="demo-operations-title" className="mt-4 font-display text-lg font-extrabold tracking-[-0.03em] sm:text-xl">
          {copy.operationsTitle}
        </h2>
        <dl className="mt-5 grid grid-cols-3 gap-px bg-primary-strong-foreground/15 text-xs">
          <OperationCell label={copy.focus} value={copy.focusValue} />
          <OperationCell label={copy.next} value={copy.nextValue} />
          <OperationCell label={copy.record} value={copy.recordValue} />
        </dl>
      </article>

      <article
        className="absolute left-0 top-[90px] z-20 w-[92%] border border-border-strong bg-surface-elevated p-4 text-foreground shadow-[0_28px_90px_rgba(0,0,0,0.3)] sm:top-[86px] sm:w-[79%] sm:p-7"
        aria-labelledby="demo-quotation-title"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4 sm:pb-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[10px]">
              {copy.quotation}
            </p>
            <h2 id="demo-quotation-title" className="mt-2 font-display text-xl font-extrabold tracking-[-0.04em] sm:text-2xl">
              {copy.quotationTitle}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DemoLabel label={copy.demo} />
            <span className="bg-warning-soft px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-warning sm:text-[10px]">
              {copy.quotationStatus}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-b border-border py-4 text-xs sm:gap-5 sm:py-5">
          <Meta label={copy.preparedFor} value={copy.demoWorkspace} />
          <Meta label={copy.project} value={copy.projectName} />
        </dl>

        <div className="py-4 sm:py-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-secondary sm:text-[10px]">{copy.scope}</p>
          <ol className="mt-3 divide-y divide-border border-y border-border">
            {copy.scopeItems.map((item, index) => (
              <li key={item} className="flex items-center gap-3 py-2.5 text-[11px] font-semibold sm:text-xs">
                <span className="font-mono text-[9px] text-primary">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-border pt-4 sm:pt-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-secondary sm:text-[10px]">{copy.finalEstimate}</p>
            <p className="mt-1 max-w-[13rem] text-[11px] font-semibold leading-5 sm:text-xs">{copy.afterDiscussion}</p>
          </div>
          <FileCheck2 className="size-6 shrink-0 text-primary" aria-hidden="true" />
        </div>
      </article>

      <article
        className="absolute bottom-10 right-0 z-30 w-[78%] border border-border bg-surface p-4 text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:bottom-12 sm:w-[60%] sm:p-6"
        aria-labelledby="demo-progress-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[10px]">{copy.progress}</p>
          <DemoLabel label={copy.demo} />
        </div>
        <h2 id="demo-progress-title" className="mt-4 font-display text-base font-extrabold tracking-[-0.025em] sm:text-lg">
          {copy.progressTitle}
        </h2>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">{copy.progressStatus}</p>
        <ol className="mt-4 space-y-2.5">
          {copy.progressSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-2.5 text-[11px] font-medium sm:text-xs">
              <span
                className={
                  index < 2
                    ? "grid size-4 shrink-0 place-items-center bg-primary-strong text-primary-strong-foreground"
                    : "grid size-4 shrink-0 place-items-center border border-primary bg-accent-soft text-primary"
                }
              >
                {index < 2 ? <Check className="size-2.5" aria-hidden="true" /> : <span className="size-1.5 bg-primary" />}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </article>
    </figure>
  );
}

function DemoLabel({ label, tone = "light" }: { label: string; tone?: "light" | "dark" }) {
  return (
    <span
      className={
        tone === "dark"
          ? "border border-primary-strong-foreground/25 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-primary-strong-foreground sm:text-[9px]"
          : "border border-primary/25 bg-accent-soft px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-primary sm:text-[9px]"
      }
    >
      {label}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-secondary sm:text-[10px]">{label}</dt>
      <dd className="mt-1.5 text-[11px] font-semibold leading-5 sm:text-xs">{value}</dd>
    </div>
  );
}

function OperationCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-primary-hover p-3">
      <dt className="text-[8px] font-bold uppercase tracking-[0.12em] text-primary-strong-foreground sm:text-[9px]">{label}</dt>
      <dd className="mt-1.5 font-semibold leading-4 text-primary-strong-foreground">{value}</dd>
    </div>
  );
}
