import { Suspense } from "react";
import Link from "next/link";
import { Bell, ExternalLink, type LucideIcon } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PortalActiveLink } from "@/components/layout/portal-active-link";
import { PortalMobileMoreMenu } from "@/components/layout/portal-mobile-more-menu";
import { PortalPageEntrance } from "@/components/layout/portal-page-entrance";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export type PortalNavItem = { label: string; href: string; icon: LucideIcon };

type PortalShellProps = {
  kind: "owner" | "client";
  title: string;
  userLabel: string;
  unreadCount?: number;
  items: PortalNavItem[];
  children: React.ReactNode;
};

export async function PortalShell({ kind, title, userLabel, unreadCount = 0, items, children }: PortalShellProps) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const notificationHref = kind === "owner" ? "/owner/notifications" : "/client/notifications";
  const workspaceLabel = kind === "owner" ? dictionary.portal.ownerWorkspace : dictionary.portal.clientPortal;

  return (
    <div className={`min-h-screen bg-background lg:grid ${kind === "owner" ? "lg:grid-cols-[88px_minmax(0,1fr)]" : "lg:grid-cols-[236px_minmax(0,1fr)]"}`}>
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-[#0a0d0b] lg:flex">
        <div className={kind === "owner" ? "grid min-h-[76px] place-items-center border-b border-border" : "border-b border-border px-6 py-5"}>
          <Brand compact={kind === "owner"} />
        </div>
        <div className={kind === "owner" ? "flex-1 overflow-y-auto px-2 py-4" : "flex-1 overflow-y-auto px-4 py-6"}>
          {kind !== "owner" && <div className="px-3">
            <p className="text-[9px] font-bold uppercase tracking-[.2em] text-accent-lime">RRS / {kind}</p>
            <p className="mt-2 truncate font-display text-lg font-bold tracking-[-.03em] text-foreground">{title}</p>
          </div>}
          <nav className={kind === "owner" ? "space-y-1" : "mt-7 space-y-1"} aria-label={`${title} navigation`}>
            {items.map(({ label, href, icon: Icon }) => (
              <PortalActiveLink key={href} href={href} label={label} compact={kind === "owner"}><Icon className={kind === "owner" ? "size-5" : "size-[18px]"} aria-hidden="true" /></PortalActiveLink>
            ))}
          </nav>
        </div>
        <div className={kind === "owner" ? "border-t border-border p-2" : "border-t border-border p-4"}>
          <Link href="/" title={kind === "owner" ? dictionary.portal.home : undefined} className={kind === "owner" ? "grid min-h-12 place-items-center border border-border text-secondary hover:bg-surface-hover hover:text-foreground" : "flex min-h-11 items-center justify-between border border-border px-3 text-sm font-semibold text-secondary hover:bg-surface-hover hover:text-foreground"}>
            <span className={kind === "owner" ? "sr-only" : undefined}>{dictionary.portal.home}</span><ExternalLink className="size-4 text-muted" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex min-h-[68px] items-center justify-between border-b border-border bg-background/94 px-5 backdrop-blur-xl md:px-8">
          <div className="lg:hidden"><Brand /></div>
          <div className="hidden lg:block">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-muted">{workspaceLabel}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{userLabel}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block"><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
            <Link
              href={notificationHref}
              className="relative grid size-11 place-items-center border border-border bg-surface text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
              aria-label={`${dictionary.common.notifications}${unreadCount ? ` (${unreadCount})` : ""}`}
            >
              <Bell className="size-4" aria-hidden="true" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-error-strong px-1 text-[9px] font-bold leading-5 text-error-strong-foreground">{Math.min(unreadCount, 99)}</span>}
            </Link>
            <div className="hidden md:block"><SignOutButton label={dictionary.common.signOut} /></div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-5 pb-24 md:p-8 lg:pb-10 xl:p-10">
          <Breadcrumbs homeLabel={dictionary.portal.overview} items={items.map(({ label, href }) => ({ label, href }))} />
          <PortalPageEntrance>{children}</PortalPageEntrance>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid min-h-[70px] grid-cols-5 border-t border-border bg-background/96 px-1 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden" aria-label="Mobile portal navigation">
          {items.slice(0, 4).map(({ label, href, icon: Icon }) => (
            <PortalActiveLink key={href} href={href} label={label} mobile><Icon className="size-5" aria-hidden="true" /></PortalActiveLink>
          ))}
          <PortalMobileMoreMenu items={items.slice(4).map(({ label, href }) => ({ label, href }))} label={locale === "id" ? "Lainnya" : "More"} footer={<SignOutButton label={dictionary.common.signOut} showLabel />} />
        </nav>
      </div>
    </div>
  );
}
