import { ArrowRight, LockKeyhole } from "lucide-react";

export function AuthContinuation({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section
      data-composition="auth-continuation"
      className="mb-6 grid grid-cols-[auto_1fr] gap-3 border border-primary/20 bg-accent-soft/70 p-4"
      aria-label={eyebrow}
    >
      <span className="grid size-10 place-items-center rounded-full border border-primary/25 bg-background/30 text-primary">
        <LockKeyhole className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[.16em] text-primary">{eyebrow}</p>
        <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
          {title}
          <ArrowRight className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
        </p>
        <p className="mt-1 text-xs leading-5 text-secondary">{description}</p>
      </div>
    </section>
  );
}
