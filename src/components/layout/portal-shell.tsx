import { Suspense } from "react";
import Link from "next/link";
import { Bell, type LucideIcon } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";

export type PortalNavItem = { label: string; href: string; icon: LucideIcon };

export async function PortalShell({ kind, title, userLabel, items, children }: { kind: "owner" | "client"; title: string; userLabel: string; items: PortalNavItem[]; children: React.ReactNode }) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const notificationHref = kind === "owner" ? "/owner/notifications" : "/client/notifications";

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-border bg-surface p-6 lg:block">
        <Brand />
        <p className="mt-10 px-3 text-xs font-bold uppercase tracking-[.14em] text-secondary">{title}</p>
        <nav className="mt-4 space-y-1" aria-label={`${title} navigation`}>
          {items.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-accent-soft hover:text-primary"><Icon className="size-4" />{label}</Link>)}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-5 md:px-8">
          <div className="lg:hidden"><Brand /></div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block"><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
            <Link href={notificationHref} className="grid size-9 place-items-center rounded-[10px] text-secondary hover:bg-accent-soft hover:text-primary" aria-label={dictionary.common.notifications}><Bell className="size-4" /></Link>
            <p className="hidden text-sm font-semibold md:block">{userLabel}</p>
            <SignOutButton label={dictionary.common.signOut} />
          </div>
        </header>
        <main className={cn("mx-auto max-w-[1440px] p-5 pb-24 md:p-8 lg:pb-8")}>{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface px-1 py-2 lg:hidden" aria-label="Mobile portal navigation">
          {items.slice(0, 5).map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="flex min-h-12 flex-col items-center justify-center gap-1 px-1 py-1 text-[10px] font-medium text-secondary hover:text-primary"><Icon className="size-5" /><span className="max-w-full truncate">{label}</span></Link>)}
        </nav>
      </div>
    </div>
  );
}
