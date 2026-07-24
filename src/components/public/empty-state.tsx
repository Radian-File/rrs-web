import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicEmptyState({
  titleId,
  icon: Icon,
  eyebrow,
  title,
  description,
  context,
  action,
  className,
}: {
  titleId: string;
  icon: LucideIcon;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  context?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-reveal
      data-composition="public-empty-state"
      className={cn(
        "mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16",
        className,
      )}
      aria-labelledby={titleId}
    >
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_78%_25%,rgba(200,237,115,.1),transparent_30%),linear-gradient(145deg,#252821,#1b1e1b)] px-6 py-16 text-center text-white shadow-[0_34px_100px_rgba(0,0,0,.28)] sm:px-10 lg:py-24">
        <span className="pointer-events-none absolute -right-4 -top-16 font-display text-[15rem] font-black leading-none tracking-[-.1em] text-white/[.025]" aria-hidden="true">
          00
        </span>
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-accent-lime/25 bg-accent-lime/10 text-accent-lime">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-accent-lime">
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] font-black uppercase leading-[.88] tracking-[-.06em]"
          >
            {title}
          </h2>
          {context && (
            <div className="mt-4 break-words text-xs font-bold uppercase tracking-[.1em] text-white/35">
              {context}
            </div>
          )}
          <div className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/52">
            {description}
          </div>
          {action && <div className="mt-7">{action}</div>}
        </div>
      </div>
    </section>
  );
}
