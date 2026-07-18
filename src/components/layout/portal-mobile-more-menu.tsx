"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { MoreHorizontal, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function PortalMobileMoreMenu({ items, label = "More" }: { items: { label: string; href: string }[]; label?: string }) {
  const pathname = usePathname();
  const active = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return <Dialog.Root><Dialog.Trigger className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[8px] px-1 py-1 text-[10px] font-semibold ${active ? "bg-accent-soft text-primary" : "text-secondary hover:bg-surface-container"}`} aria-label={label}><MoreHorizontal className="size-5"/><span className="truncate">{label}</span></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20"/><Dialog.Content className="fixed inset-x-3 bottom-3 z-50 rounded-[18px] border border-border bg-surface p-4 shadow-2xl"><div className="flex items-center justify-between"><Dialog.Title className="font-display text-lg font-extrabold">{label}</Dialog.Title><Dialog.Close className="grid size-9 place-items-center rounded-[8px] text-secondary hover:bg-surface-container" aria-label="Close menu"><X className="size-5"/></Dialog.Close></div><nav className="mt-4 grid gap-2" aria-label={`${label} navigation`}>{items.map((item) => <Dialog.Close asChild key={item.href}><Link href={item.href} className={`rounded-[10px] px-4 py-3 text-sm font-semibold ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "bg-accent-soft text-primary" : "hover:bg-surface-container"}`}>{item.label}</Link></Dialog.Close>)}</nav></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
