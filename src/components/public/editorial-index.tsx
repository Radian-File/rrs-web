import { cn } from "@/lib/utils";

export function PublicEditorialIndex({
  titleId,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  titleId: string;
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-composition="public-editorial-index"
      className={cn("border-y border-white/[.06] bg-[#1a1c1b] py-20 text-white lg:py-28", className)}
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-6 border-b border-white/10 pb-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.2em] text-accent-lime">
              {eyebrow}
            </p>
            <h2
              id={titleId}
              className="mt-4 max-w-3xl font-display text-[clamp(2.7rem,4.8vw,5rem)] font-black uppercase leading-[.88] tracking-[-.065em]"
            >
              {title}
            </h2>
          </div>
          <div className="max-w-xl text-sm leading-7 text-white/52 lg:justify-self-end">
            {description}
          </div>
        </div>

        <div data-reveal-group className="mt-8 space-y-5 lg:mt-12">
          {children}
        </div>
      </div>
    </section>
  );
}

export function EditorialIndexRow({
  number,
  category,
  variant,
  children,
  aside,
  className,
}: {
  number: string;
  category: React.ReactNode;
  variant: 0 | 1 | 2;
  children: React.ReactNode;
  aside: React.ReactNode;
  className?: string;
}) {
  const frameClass =
    variant === 0
      ? "border-t border-white/10 py-10 lg:grid-cols-[108px_minmax(0,1.18fr)_minmax(260px,.82fr)] lg:py-14"
      : variant === 1
        ? "rounded-[28px] border border-white/10 bg-[#242724] px-5 py-9 sm:px-8 lg:ml-[6%] lg:grid-cols-[108px_minmax(0,.95fr)_minmax(270px,.75fr)] lg:px-10 lg:py-12"
        : "border-y border-white/10 py-12 lg:mr-[7%] lg:grid-cols-[108px_minmax(0,.82fr)_minmax(310px,1.05fr)] lg:items-end lg:py-16";

  return (
    <article
      data-reveal-item
      className={cn("group grid min-w-0 gap-7", frameClass, className)}
    >
      <div className="flex items-center justify-between gap-4 lg:block">
        <p className="font-display text-3xl font-black tracking-[-.06em] text-white/24">
          {number}
        </p>
        <div className="text-right text-[8px] font-black uppercase tracking-[.16em] text-accent-lime lg:mt-4 lg:text-left">
          {category}
        </div>
      </div>
      <div className="min-w-0">{children}</div>
      <div
        className={cn(
          "min-w-0",
          variant === 2
            ? "lg:border-l lg:border-white/10 lg:pl-8"
            : "lg:justify-self-end lg:self-end",
        )}
      >
        {aside}
      </div>
    </article>
  );
}
