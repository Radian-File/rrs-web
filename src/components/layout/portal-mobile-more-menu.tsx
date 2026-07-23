"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { MoreHorizontal, X } from "lucide-react";

export function PortalMobileMoreMenu({ items, label = "More" }: { items: { label: string; href: string }[]; label?: string }) {
  const pathname = usePathname();
  const active = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={`relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-semibold ${active ? "text-accent-lime" : "text-secondary hover:text-foreground"}`}
        aria-label={label}
      >
        <MoreHorizontal className="size-5" aria-hidden="true" />
        <span className="truncate">{label}</span>
        {active && <span className="absolute inset-x-5 bottom-0 h-0.5 bg-accent-lime" aria-hidden="true" />}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-3 bottom-3 z-50 border border-border bg-surface-elevated p-5 shadow-[0_24px_80px_rgba(0,0,0,.5)]">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Dialog.Title className="font-display text-lg font-bold tracking-[-.03em]">{label}</Dialog.Title>
            <Dialog.Close className="grid size-11 place-items-center border border-border text-secondary hover:bg-surface-hover hover:text-foreground" aria-label={`Close ${label}`}>
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav className="mt-4 grid grid-cols-2 gap-2" aria-label={`${label} navigation`}>
            {items.map((item) => {
              const itemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Dialog.Close asChild key={item.href}>
                  <Link href={item.href} aria-current={itemActive ? "page" : undefined} className={`border px-4 py-3 text-sm font-semibold ${itemActive ? "border-primary bg-accent-soft text-foreground" : "border-border bg-surface text-secondary hover:bg-surface-hover hover:text-foreground"}`}>
                    {item.label}
                  </Link>
                </Dialog.Close>
              );
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
