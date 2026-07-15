import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, className }: { icon: LucideIcon; title: string; description: string; className?: string }) {
  return (
    <div className={cn("flex min-h-56 flex-col items-center justify-center rounded-[20px] border border-dashed border-border bg-surface px-6 text-center", className)}>
      <span className="mb-4 grid size-11 place-items-center rounded-full bg-accent-soft text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{description}</p>
    </div>
  );
}
