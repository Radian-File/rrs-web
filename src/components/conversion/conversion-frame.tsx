import { CircleUserRound, LockKeyhole } from "lucide-react";

export function ConversionFrame({
  eyebrow,
  title,
  description,
  identity,
  context,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  identity: React.ReactNode;
  context: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section data-composition="conversion-frame" className="relative isolate overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
        <div className="absolute -left-28 top-20 size-80 rounded-full bg-accent-soft/55 blur-3xl" />
        <div className="absolute -right-24 top-64 size-72 rounded-full bg-accent-lime-soft/20 blur-3xl" />
        <div className="absolute inset-y-0 left-[11%] hidden w-px bg-border/35 lg:block" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-5 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12">
        {identity}

        <header className="grid gap-5 border-b border-border py-8 md:py-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p>
            <h1 className="text-balance mt-4 max-w-4xl font-display text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[.95] tracking-[-.06em]">
              {title}
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-secondary md:text-base md:leading-8">{description}</p>
        </header>

        <div className="grid gap-6 pt-6 md:gap-8 md:pt-8 lg:grid-cols-[minmax(15rem,19rem)_minmax(0,1fr)] lg:items-start xl:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">{context}</div>
          <div className="order-1 min-w-0 lg:order-2">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function ConversionIdentity({
  label,
  name,
  email,
  status,
  serviceLabel,
  service,
}: {
  label: string;
  name: string;
  email: string;
  status: string;
  serviceLabel: string;
  service: string;
}) {
  return (
    <section
      aria-label={label}
      className="grid border border-border bg-surface/80 shadow-[0_14px_44px_rgba(0,0,0,0.16)] sm:grid-cols-[minmax(0,1fr)_auto]"
    >
      <div className="flex min-w-0 items-center gap-3 p-4 sm:p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/35 bg-accent-soft text-primary">
          <CircleUserRound className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">{label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-0.5 break-all text-xs text-secondary">{email}</p>
        </div>
        <span className="ml-auto hidden shrink-0 items-center gap-2 rounded-full border border-primary/25 bg-accent-soft px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-primary md:inline-flex">
          <span className="size-1.5 rounded-full bg-accent-lime" aria-hidden="true" />
          {status}
        </span>
      </div>
      <div className="border-t border-border px-4 py-3 sm:flex sm:min-w-56 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">{serviceLabel}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{service}</p>
      </div>
    </section>
  );
}

export function ConversionContextPanel({
  label,
  items,
  workflowTitle,
  workflowDescription,
}: {
  label: string;
  items: string[];
  workflowTitle: string;
  workflowDescription: string;
}) {
  return (
    <aside aria-label={label} className="overflow-hidden border border-border bg-surface/55">
      <div className="p-5 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{label}</p>
        <ol className="mt-5 border-t border-border">
          {items.map((item, index) => (
            <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-border py-4 text-sm leading-6 text-secondary">
              <span className="font-mono text-[10px] font-semibold text-primary" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="border-t border-border bg-accent-soft/55 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">{workflowTitle}</p>
            <p className="mt-2 text-xs leading-6 text-secondary">{workflowDescription}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ConversionFormPanel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <section
      aria-label={label}
      className="relative overflow-hidden border border-border-strong bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/10 via-accent-lime/80 to-primary/10" aria-hidden="true" />
      <div className="p-5 sm:p-6 md:p-8 lg:p-10">{children}</div>
    </section>
  );
}
