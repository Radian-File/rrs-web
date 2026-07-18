import { Suspense } from "react";
import Link from "next/link";
import { Bell, type LucideIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PortalActiveLink } from "@/components/layout/portal-active-link";
import { PortalPageEntrance } from "@/components/layout/portal-page-entrance";
import { PortalMobileMoreMenu } from "@/components/layout/portal-mobile-more-menu";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";

export type PortalNavItem = { label: string; href: string; icon: LucideIcon };

export async function PortalShell({ kind, title, userLabel, unreadCount = 0, items, children }: { kind: "owner" | "client"; title: string; userLabel: string; unreadCount?: number; items: PortalNavItem[]; children: React.ReactNode }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const notificationHref = kind === "owner" ? "/owner/notifications" : "/client/notifications";

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-border bg-surface p-6 lg:block">
        <Brand />
        <p className="mt-10 px-3 text-xs font-bold uppercase tracking-[.14em] text-secondary">{title}</p>
        <nav className="mt-4 space-y-1" aria-label={`${title} navigation`}>
          {items.map(({ label, href, icon: Icon }) => <PortalActiveLink key={href} href={href} label={label}><Icon className="size-4" /></PortalActiveLink>)}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-5 md:px-8">
          <div className="lg:hidden"><Brand /></div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block"><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
            <Link href={notificationHref} className="relative grid size-9 place-items-center rounded-[10px] text-secondary hover:bg-accent-soft hover:text-primary" aria-label={`${dictionary.common.notifications}${unreadCount ? ` (${unreadCount})` : ""}`}><Bell className="size-4" />{unreadCount>0&&<span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-error px-1 text-[9px] font-bold leading-4 text-white">{Math.min(unreadCount,99)}</span>}</Link>
            <p className="hidden text-sm font-semibold md:block">{userLabel}</p>
            <SignOutButton label={dictionary.common.signOut} />
          </div>
        </header>
        <main className={cn("mx-auto max-w-[1440px] p-5 pb-24 md:p-8 lg:pb-8")}><Breadcrumbs homeLabel={dictionary.portal.overview} items={items.map(({label,href})=>({label,href}))}/><PortalPageEntrance>{children}</PortalPageEntrance></main>
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface px-1 py-2 lg:hidden" aria-label="Mobile portal navigation">
          {items.slice(0, 4).map(({ label, href, icon: Icon }) => <PortalActiveLink key={href} href={href} label={label} mobile><Icon className="size-5" /></PortalActiveLink>)}
          <PortalMobileMoreMenu items={items.slice(4).map(({ label, href }) => ({ label, href }))} label={locale === "id" ? "Lainnya" : "More"} />
        </nav>
      </div>
    </div>
  );
}
