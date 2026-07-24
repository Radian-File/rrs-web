import { cn } from "@/lib/utils";

export function WorkspaceModule({
  titleId,
  children,
  className,
  as = "section",
}: {
  titleId: string;
  children: React.ReactNode;
  className?: string;
  as?: "section" | "aside";
}) {
  const Component = as;

  return (
    <Component
      data-composition="workspace-module"
      className={cn("min-w-0 overflow-hidden rounded-[16px] border border-border bg-surface", className)}
      aria-labelledby={titleId}
    >
      {children}
    </Component>
  );
}

export function WorkspaceModuleHeader({
  titleId,
  eyebrow,
  title,
  description,
  aside,
  className,
  contentClassName,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: {
  titleId: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <header className={cn("border-b border-border p-5 md:p-6", className)}>
      <div
        className={cn(
          "flex flex-col justify-between gap-4 sm:flex-row sm:items-start",
          contentClassName,
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[.16em] text-primary",
              eyebrowClassName,
            )}
          >
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className={cn(
              "mt-2 font-display text-2xl font-extrabold tracking-[-.035em]",
              titleClassName,
            )}
          >
            {title}
          </h2>
          {description && (
            <div
              className={cn(
                "mt-3 max-w-xl text-sm leading-6 text-secondary",
                descriptionClassName,
              )}
            >
              {description}
            </div>
          )}
        </div>
        {aside && <div className="w-fit shrink-0">{aside}</div>}
      </div>
    </header>
  );
}
