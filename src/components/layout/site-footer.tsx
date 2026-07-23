import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { Brand } from "@/components/brand";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { getServerEnv } from "@/lib/env";
import { createWhatsAppUrl, formatWhatsAppNumber } from "@/lib/whatsapp";

export async function SiteFooter() {
  const [locale, session] = await Promise.all([getLocale(), auth()]);
  const dictionary = getDictionary(locale);
  const env = getServerEnv();
  const isId = locale === "id";
  const role = session?.user?.role;
  const whatsappNumber = formatWhatsAppNumber(env.OWNER_WHATSAPP_NUMBER);
  const whatsapp = createWhatsAppUrl(
    env.OWNER_WHATSAPP_NUMBER,
    isId
      ? "Halo RRS Studio, saya ingin mendiskusikan kebutuhan project digital."
      : "Hello RRS Studio, I would like to discuss a digital project.",
  );
  const primaryHref = role === "OWNER" ? "/owner" : role === "CLIENT" ? "/start-project" : loginUrl("/start-project");
  const primaryLabel = role === "OWNER" ? dictionary.portal.ownerWorkspace : dictionary.nav.startProject;
  const accountHref = role === "OWNER" ? "/owner" : role === "CLIENT" ? "/client" : "/login";
  const accountLabel = role === "OWNER" ? dictionary.portal.ownerWorkspace : role === "CLIENT" ? dictionary.portal.clientPortal : dictionary.nav.signIn;
  const navigation = [
    [dictionary.nav.services, "/services"],
    [dictionary.nav.portfolio, "/portfolio"],
    [dictionary.nav.process, "/cara-kerja"],
    [dictionary.nav.reviews, "/reviews"],
    [dictionary.nav.about, "/about"],
  ] as const;

  return (
    <footer className="border-t border-border bg-[#090c0a]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 lg:px-12 lg:py-20 xl:px-16">
        <div className="grid gap-12 border-b border-border pb-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <Brand />
            <h2 className="mt-9 max-w-3xl font-display text-[clamp(2.5rem,5.2vw,5.25rem)] font-extrabold leading-[.93] tracking-[-.065em]">
              {isId ? "Mulai dengan scope yang jelas." : "Start with a clear scope."}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-secondary">{dictionary.footer.description}</p>
            <Link href={primaryHref} className="group mt-8 inline-flex min-h-12 items-center gap-5 bg-accent-lime px-5 text-sm font-bold text-background">
              {primaryLabel}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <FooterColumn title={isId ? "Jelajahi" : "Explore"} links={navigation} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">{isId ? "Akun" : "Account"}</p>
              <ul className="mt-5 space-y-3">
                <li><Link href={accountHref} className="text-sm font-semibold text-secondary hover:text-foreground">{accountLabel}</Link></li>
                <li><Link href="/contact" className="text-sm font-semibold text-secondary hover:text-foreground">{isId ? "Kontak" : "Contact"}</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">{isId ? "Diskusi" : "Discuss"}</p>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-start gap-2 text-sm font-semibold leading-6 text-secondary hover:text-foreground">
                <span>WhatsApp<br />{whatsappNumber}</span>
                <ArrowUpRight className="mt-1 size-4 text-accent-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 pt-6 text-xs text-muted sm:flex-row">
          <span>© 2026 RRS Studio. {dictionary.footer.copyright}</span>
          <span>{isId ? "Independent digital studio · Bekasi, Indonesia" : "Independent digital studio · Bekasi, Indonesia"}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm font-semibold text-secondary hover:text-foreground">{label}</Link></li>)}
      </ul>
    </div>
  );
}
