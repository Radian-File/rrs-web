import { cn } from "@/lib/utils";

export function PublicDiscoveryHero({
  titleId,
  eyebrow,
  titleLines,
  description,
  actions,
  visual,
  visualLabel,
  className,
  titleClassName,
}: {
  titleId: string;
  eyebrow: string;
  titleLines: readonly string[];
  description: React.ReactNode;
  actions: React.ReactNode;
  visual: React.ReactNode;
  visualLabel: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <section
      data-composition="public-discovery-hero"
      className={cn(
        "rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_78%_34%,rgba(82,164,119,.2),transparent_28%),linear-gradient(180deg,#101211_0%,#171a18_100%)] text-white",
        className,
      )}
      aria-labelledby={titleId}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
        <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
        <div className="absolute inset-x-0 top-[35%] h-px bg-white/[.045]" />
        <div className="absolute -right-28 top-20 size-[30rem] rounded-full border border-white/[.045]" />
        <div className="absolute -right-12 top-36 size-[20rem] rounded-full border border-accent-lime/10" />
      </div>

      <div className="relative mx-auto grid min-h-[600px] max-w-[1440px] gap-12 px-5 pb-24 pt-16 md:px-8 md:pt-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-32 lg:pt-24 xl:px-16">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent-lime" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime sm:text-xs">
              {eyebrow}
            </p>
          </div>

          <h1
            id={titleId}
            aria-label={titleLines.join(" ")}
            className={cn(
              "mt-7 font-display text-[clamp(3.15rem,5.75vw,6.4rem)] font-black uppercase leading-[.82] tracking-[-.075em] text-[#f5f2ea]",
              titleClassName,
            )}
          >
            {titleLines.map((line) => (
              <span key={line} className="block pb-[.08em] lg:whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-7 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
            {description}
          </div>
          <div className="mt-8">{actions}</div>
        </div>

        <div
          role="group"
          className="relative mx-auto w-full max-w-[540px] lg:justify-self-end"
          aria-label={visualLabel}
        >
          {visual}
        </div>
      </div>
    </section>
  );
}
