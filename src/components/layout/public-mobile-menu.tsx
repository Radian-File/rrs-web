"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/features/auth/sign-out-button";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type MenuLink = { label: string; href: string };

type PublicMobileMenuProps = {
  locale: Locale;
  links: MenuLink[];
  accountLinks: MenuLink[];
  role?: "OWNER" | "CLIENT";
  labels: {
    open: string;
    close: string;
    navigation: string;
    account: string;
    signIn: string;
    startProject: string;
    signOut: string;
  };
  loginHref: string;
  startHref: string;
};

export function PublicMobileMenu({ locale, links, accountLinks, role, labels, loginHref, startHref }: PublicMobileMenuProps) {
  const pathname = usePathname();

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="grid size-11 place-items-center border border-border bg-surface text-foreground transition-colors hover:border-border-strong hover:bg-surface-hover lg:hidden"
        aria-label={labels.open}
      >
        <Menu className="size-5" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/72 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[80] flex w-[min(92vw,390px)] flex-col border-l border-border bg-background p-5 shadow-[-24px_0_64px_rgba(0,0,0,.42)] sm:p-7">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <Dialog.Title className="font-display text-lg font-bold tracking-[-.03em]">{labels.navigation}</Dialog.Title>
            <Dialog.Close className="grid size-11 place-items-center border border-border text-secondary hover:bg-surface-hover hover:text-foreground" aria-label={labels.close}>
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <nav className="mt-7" aria-label={labels.navigation}>
            <ul className="divide-y divide-border border-y border-border">
              {links.map((item, index) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Dialog.Close asChild>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 text-sm font-semibold transition-colors",
                          active ? "text-accent-lime" : "text-secondary hover:text-foreground",
                        )}
                      >
                        <span className="font-mono text-[10px] text-muted">0{index + 1}</span>
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </Dialog.Close>
                  </li>
                );
              })}
            </ul>
          </nav>

          {role && accountLinks.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">{labels.account}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {accountLinks.map((item) => (
                  <Dialog.Close asChild key={item.href}>
                    <Link href={item.href} className="border border-border bg-surface px-3 py-3 text-sm font-semibold text-secondary hover:border-primary hover:text-foreground">
                      {item.label}
                    </Link>
                  </Dialog.Close>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto border-t border-border pt-5">
            <div className="flex items-center justify-between gap-4">
              <LanguageSwitcher locale={locale} />
              {role ? <SignOutButton label={labels.signOut} /> : <Dialog.Close asChild><Link href={loginHref} className="text-sm font-semibold text-secondary hover:text-foreground">{labels.signIn}</Link></Dialog.Close>}
            </div>
            {!role && (
              <Dialog.Close asChild>
                <Link href={startHref} className="mt-5 flex min-h-12 items-center justify-between bg-accent-lime px-4 text-sm font-bold text-background">
                  {labels.startProject}<ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Dialog.Close>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
