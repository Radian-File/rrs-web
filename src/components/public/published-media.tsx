import { cn } from "@/lib/utils";

export function PublishedMediaFrame({
  chromeLabel,
  children,
  ariaLabel,
  className,
  bodyClassName,
  chromeLabelClassName,
}: {
  chromeLabel: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  bodyClassName?: string;
  chromeLabelClassName?: string;
}) {
  return (
    <div
      data-composition="published-media-frame"
      className={cn("overflow-hidden border border-white/10 bg-[#202320]", className)}
      role={ariaLabel ? "group" : undefined}
      aria-label={ariaLabel}
    >
      <div className="flex h-9 items-center gap-2 border-b border-white/10 pb-4">
        <span className="size-2 rounded-full bg-[#f37b65]" aria-hidden="true" />
        <span className="size-2 rounded-full bg-[#e7c35c]" aria-hidden="true" />
        <span className="size-2 rounded-full bg-[#69b77c]" aria-hidden="true" />
        <span
          className={cn(
            "ml-auto text-[8px] font-black uppercase tracking-[.15em] text-white/38",
            chromeLabelClassName,
          )}
        >
          {chromeLabel}
        </span>
      </div>
      <div className={cn("mt-5", bodyClassName)}>{children}</div>
    </div>
  );
}
