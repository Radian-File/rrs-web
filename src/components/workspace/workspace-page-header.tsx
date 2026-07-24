import { cn } from "@/lib/utils";

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <header
      data-composition="workspace-page-header"
      className={cn(
        "flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "text-[11px] font-bold uppercase tracking-[.18em] text-primary",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
        <h1
          className={cn(
            "mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl",
            titleClassName,
          )}
        >
          {title}
        </h1>
        <div
          className={cn(
            "mt-3 max-w-2xl text-sm leading-6 text-secondary",
            descriptionClassName,
          )}
        >
          {description}
        </div>
      </div>
      {actions && <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>}
    </header>
  );
}
