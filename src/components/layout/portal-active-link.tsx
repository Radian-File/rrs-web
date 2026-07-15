"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PortalActiveLink({ href, label, children, mobile = false }: { href: string; label: string; children: React.ReactNode; mobile?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/owner" && href !== "/client" && pathname.startsWith(`${href}/`));
  return <Link href={href} aria-current={active ? "page" : undefined} className={cn(mobile ? "relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-[8px] px-1 py-1 text-[10px] font-medium transition-colors" : "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-accent-soft text-primary" : "text-secondary hover:bg-accent-soft hover:text-primary")}>{children}<span className={mobile ? "max-w-full truncate" : undefined}>{label}</span>{mobile && active && <span className="absolute inset-x-4 -bottom-2 h-0.5 rounded-full bg-primary" />}</Link>;
}
