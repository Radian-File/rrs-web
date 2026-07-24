"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PortalActiveLink({ href, label, children, mobile = false, compact = false }: { href: string; label: string; children: React.ReactNode; mobile?: boolean; compact?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/owner" && href !== "/client" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      title={compact ? label : undefined}
      className={cn(
        mobile
          ? "relative flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-semibold transition-colors"
          : compact
            ? "group relative grid min-h-12 place-items-center border border-transparent px-2 py-2 text-sm font-semibold transition-colors"
            : "group relative flex min-h-11 items-center gap-3 border border-transparent px-3 py-2.5 text-sm font-semibold transition-colors",
        active
          ? mobile
            ? "text-accent-lime"
            : "border-border bg-surface-hover text-foreground"
          : "text-secondary hover:border-border hover:bg-surface-container hover:text-foreground",
      )}
    >
      {!mobile && (
        <span className={cn("absolute inset-y-2 left-0 w-0.5 transition-colors", active ? "bg-accent-lime" : "bg-transparent group-hover:bg-border-strong")} aria-hidden="true" />
      )}
      <span className={cn("grid shrink-0 place-items-center", active ? "text-accent-lime" : "text-muted group-hover:text-primary")}>{children}</span>
      <span className={mobile ? "max-w-full truncate" : compact ? "sr-only" : "truncate"}>{label}</span>
      {mobile && active && <span className="absolute inset-x-5 bottom-0 h-0.5 bg-accent-lime" aria-hidden="true" />}
    </Link>
  );
}
