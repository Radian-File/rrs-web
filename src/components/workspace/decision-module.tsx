import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WorkspaceDecisionDetail = {
  label: string;
  value: string;
};

export function WorkspaceDecisionModule({
  titleId,
  icon: Icon,
  eyebrow,
  category,
  title,
  description,
  href,
  actionLabel,
  contextLabel,
  details,
  tone = "default",
  className,
}: {
  titleId: string;
  icon: LucideIcon;
  eyebrow: string;
  category: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  contextLabel: string;
  details: readonly WorkspaceDecisionDetail[];
  tone?: "default" | "warning";
  className?: string;
}) {
  const isWarning = tone === "warning";

  return (
    <section
      data-composition="workspace-decision-module"
      className={cn("mt-8", className)}
      aria-labelledby={titleId}
    >
      <article
        className={cn(
          "relative overflow-hidden border bg-surface",
          isWarning ? "border-warning/35" : "border-primary/35",
        )}
      >
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-1",
            isWarning ? "bg-warning" : "bg-accent-lime",
          )}
          aria-hidden="true"
        />
        <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,.65fr)]">
          <div className="px-6 py-7 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full border",
                  isWarning
                    ? "border-warning/25 bg-warning-soft text-warning"
                    : "border-accent-lime/20 bg-accent-lime-soft text-accent-lime",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[.18em]",
                    isWarning ? "text-warning" : "text-primary",
                  )}
                >
                  {eyebrow}
                </p>
                <p className="mt-1 text-xs font-semibold text-secondary">{category}</p>
              </div>
            </div>

            <h2
              id={titleId}
              className="mt-8 max-w-3xl font-display text-3xl font-bold tracking-[-.045em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-secondary sm:text-[15px]">
              {description}
            </p>
            <Button asChild size="lg" className="mt-7 w-full sm:w-fit">
              <Link href={href}>
                {actionLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <aside className="border-t border-border bg-background/30 px-6 py-7 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">
              {contextLabel}
            </p>
            <dl className="mt-5 divide-y divide-border">
              {details.map((detail) => (
                <div key={`${detail.label}-${detail.value}`} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-muted">
                    {detail.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold leading-6 text-foreground">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </article>
    </section>
  );
}
