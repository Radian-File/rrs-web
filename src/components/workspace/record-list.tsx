import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkspaceRecordList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ol className={cn("divide-y divide-border", className)}>{children}</ol>;
}

export function WorkspaceRecordLink({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  trailing,
  iconClassName,
  titleClassName,
  trailingClassName,
  className,
}: {
  href: string;
  icon: LucideIcon;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  trailingClassName?: string;
  className?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group grid min-w-0 gap-3 px-5 py-4 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center md:px-6",
          className,
        )}
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface-container text-primary",
            iconClassName,
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          {eyebrow && (
            <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-muted">
              {eyebrow}
            </span>
          )}
          <span className={cn("block text-sm font-bold", eyebrow && "mt-1", titleClassName)}>
            {title}
          </span>
          {description && (
            <span className="mt-1 block min-w-0 break-words text-xs leading-5 text-secondary">
              {description}
            </span>
          )}
        </span>
        {trailing && (
          <span
            className={cn(
              "flex items-center gap-2 text-xs text-secondary sm:justify-self-end",
              trailingClassName,
            )}
          >
            {trailing}
          </span>
        )}
      </Link>
    </li>
  );
}
