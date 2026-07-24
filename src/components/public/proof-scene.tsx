import { cn } from "@/lib/utils";

export function PublicProofScene({
  index,
  eyebrow,
  title,
  summary,
  visual,
  meta,
  action,
  reverse = false,
}: {
  index: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  summary: React.ReactNode;
  visual: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <article
      data-reveal-item
      data-composition="public-proof-scene"
      className="grid min-w-0 gap-8 border-b border-white/10 py-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:items-center lg:gap-14 lg:py-18"
    >
      <div className={cn("min-w-0", reverse && "lg:order-2")}>{visual}</div>
      <div className={cn("min-w-0", reverse && "lg:order-1")}>
        <div className="flex items-center gap-4">
          <span className="font-display text-3xl font-black tracking-[-.06em] text-white/22">{index}</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>
        <p className="mt-7 text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{eyebrow}</p>
        <h2 className="mt-4 break-words font-display text-[clamp(2.5rem,4.5vw,4.8rem)] font-black uppercase leading-[.88] tracking-[-.06em]">
          {title}
        </h2>
        <div className="mt-5 max-w-2xl text-sm leading-7 text-white/55">{summary}</div>
        {meta && <div className="mt-6">{meta}</div>}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </article>
  );
}
