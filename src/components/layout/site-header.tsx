import { Suspense } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";

export async function SiteHeader() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const links = [
    [dictionary.nav.services, "/services"],
    [dictionary.nav.portfolio, "/portfolio"],
    [dictionary.nav.process, "/cara-kerja"],
    [dictionary.nav.reviews, "/reviews"],
    [dictionary.nav.about, "/about"],
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between px-5 md:px-8 lg:px-12 xl:px-16">
        <Brand />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-[13px] font-semibold text-secondary transition-colors hover:text-foreground">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block"><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/login">{dictionary.nav.signIn}</Link></Button>
          <Button asChild size="sm"><Link href={loginUrl("/start-project")}>{dictionary.nav.startProject}</Link></Button>
          <details className="group relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-[10px] transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden" aria-label="Open navigation menu"><Menu className="size-5" /></summary>
            <nav className="absolute right-0 top-12 w-60 rounded-[14px] border border-border bg-surface p-2 shadow-xl" aria-label="Mobile navigation">
              <div className="mb-2 p-2 md:hidden"><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
              {links.map(([label, href]) => <Link key={href} href={href} className="block rounded-[8px] px-3 py-2.5 text-sm font-medium text-secondary hover:bg-accent-soft hover:text-primary">{label}</Link>)}
              <Link href="/login" className="mt-1 block border-t border-border px-3 pt-3 text-sm font-semibold text-primary sm:hidden">{dictionary.nav.signIn}</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
