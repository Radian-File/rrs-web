import { cn } from "@/lib/utils";

export function PublicProductStage({
  titleId,
  eyebrow,
  index,
  meta,
  children,
  className,
  frameClassName,
}: {
  titleId: string;
  eyebrow: string;
  index: string;
  meta: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  frameClassName?: string;
}) {
  return (
    <section
      data-reveal
      data-composition="public-product-stage"
      className={cn(
        "mx-auto max-w-[1440px] px-5 pb-20 pt-16 md:px-8 lg:px-12 lg:pb-28 lg:pt-24 xl:px-16",
        className,
      )}
      aria-labelledby={titleId}
    >
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.19em] text-accent-lime">
            {eyebrow}
          </p>
          <p className="mt-2 text-xs text-secondary">
            {index} / {meta}
          </p>
        </div>
        <span className="hidden h-px flex-1 bg-border lg:block" aria-hidden="true" />
      </div>

      <article
        className={cn(
          "overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_75%_12%,rgba(200,237,115,.1),transparent_30%),linear-gradient(145deg,#302d1d,#1d201d_62%)] p-4 text-white shadow-[0_42px_120px_rgba(0,0,0,.34)] sm:p-6 lg:p-8",
          frameClassName,
        )}
      >
        {children}
      </article>
    </section>
  );
}
