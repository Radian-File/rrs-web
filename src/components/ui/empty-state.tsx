import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-[18px] border border-dashed border-border-strong/70 bg-surface/70 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="mb-5 grid size-12 place-items-center rounded-full border border-accent-lime/20 bg-accent-lime-soft text-accent-lime">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{description}</p>
    </div>
  );
}
