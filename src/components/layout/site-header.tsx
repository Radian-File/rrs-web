import { Suspense } from "react";
import Link from "next/link";
import { ChevronDown, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PublicHeaderFrame } from "@/components/layout/public-header-frame";
import { PublicMobileMenu } from "@/components/layout/public-mobile-menu";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";

type Role = "OWNER" | "CLIENT";
type NavLink = { label: string; href: string };

export async function SiteHeader() {
  const [locale, session] = await Promise.all([getLocale(), auth()]);
  const dictionary = getDictionary(locale);
  const role = session?.user?.role as Role | undefined;
  const links: NavLink[] = [
    { label: dictionary.nav.services, href: "/services" },
    { label: dictionary.nav.process, href: "/cara-kerja" },
    { label: dictionary.nav.reviews, href: "/reviews" },
    { label: dictionary.nav.about, href: "/about" },
  ];
  const accountLinks = getAccountLinks(role, dictionary.portal);
  const startHref = loginUrl("/start-project");
  const isId = locale === "id";

  return (
    <PublicHeaderFrame>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-5 px-5 transition-[height] duration-300 md:px-8 lg:px-12 xl:px-16">
        <Brand compact />
        <nav className="hidden items-center gap-9 lg:flex" aria-label={isId ? "Navigasi utama" : "Primary navigation"}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-[13px] font-bold text-white/72 transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Suspense><LanguageSwitcher locale={locale} /></Suspense>
          </div>
          {role ? (
            <ProfileMenu
              role={role}
              links={accountLinks}
              profileLabel={dictionary.portal.profile}
              signOutLabel={dictionary.common.signOut}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm" className="rounded-full text-white/75 hover:bg-white/[.06] hover:text-white"><Link href="/login">{dictionary.nav.signIn}</Link></Button>
              <Button asChild size="sm" className="rounded-full bg-accent-lime px-5 text-background hover:bg-[#d7f58f]"><Link href={startHref}>{dictionary.nav.startProject}</Link></Button>
            </div>
          )}
          <PublicMobileMenu
            locale={locale}
            links={links}
            accountLinks={accountLinks}
            role={role}
            loginHref="/login"
            startHref={startHref}
            labels={{
              open: isId ? "Buka navigasi" : "Open navigation",
              close: isId ? "Tutup navigasi" : "Close navigation",
              navigation: isId ? "Navigasi" : "Navigation",
              account: isId ? "Akun" : "Account",
              signIn: dictionary.nav.signIn,
              startProject: dictionary.nav.startProject,
              signOut: dictionary.common.signOut,
            }}
          />
        </div>
      </div>
    </PublicHeaderFrame>
  );
}

function ProfileMenu({ role, links, profileLabel, signOutLabel }: { role: Role; links: NavLink[]; profileLabel: string; signOutLabel: string }) {
  return (
    <details className="group relative hidden sm:block">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 text-sm font-semibold text-foreground transition-colors hover:border-white/20 hover:bg-white/[.08] [&::-webkit-details-marker]:hidden">
        <UserRound className="size-4 text-accent-lime" aria-hidden="true" />
        <span>{role === "OWNER" ? "Owner" : profileLabel}</span>
        <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-12 w-64 border border-border bg-surface-elevated p-2 shadow-[0_24px_60px_rgba(0,0,0,.42)]">
        <nav aria-label={profileLabel}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="block px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-hover hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-2 border-t border-border px-1 pt-2"><SignOutButton label={signOutLabel} /></div>
      </div>
    </details>
  );
}

function getAccountLinks(role: Role | undefined, portal: ReturnType<typeof getDictionary>["portal"]): NavLink[] {
  if (role === "CLIENT") {
    return [
      { label: portal.overview, href: "/client" },
      { label: portal.quotations, href: "/client/quotations" },
      { label: portal.projects, href: "/client/projects" },
      { label: portal.profile, href: "/client/profile" },
    ];
  }
  if (role === "OWNER") {
    return [
      { label: portal.ownerWorkspace, href: "/owner" },
      { label: portal.analytics, href: "/owner/analytics" },
      { label: portal.settings, href: "/owner/settings" },
    ];
  }
  return [];
}
