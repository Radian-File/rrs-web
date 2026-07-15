"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs({ homeLabel, items }: { homeLabel: string; items: { label: string; href: string }[] }) {
  const pathname = usePathname();
  if (pathname === "/owner" || pathname === "/client") return null;
  const matched = [...items].filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort((a, b) => a.href.length - b.href.length);
  const current = matched.at(-1);
  if (!current) return null;
  const homeHref = pathname.startsWith("/owner") ? "/owner" : "/client";
  const isDetail = pathname !== current.href;
  return <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 overflow-hidden text-xs text-secondary"><Link href={homeHref} className="shrink-0 hover:text-primary">{homeLabel}</Link><ChevronRight className="size-3 shrink-0"/><Link href={current.href} className="truncate hover:text-primary">{current.label}</Link>{isDetail&&<><ChevronRight className="size-3 shrink-0"/><span aria-current="page" className="truncate font-semibold text-foreground">Detail</span></>}</nav>;
}
