import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { getServerEnv } from "@/lib/env";
import { createWhatsAppUrl, formatWhatsAppNumber } from "@/lib/whatsapp";

export async function SiteFooter() {
  const locale = await getLocale(); const dictionary = getDictionary(locale); const env = getServerEnv();
  const whatsappNumber = formatWhatsAppNumber(env.OWNER_WHATSAPP_NUMBER);
  const whatsapp = createWhatsAppUrl(env.OWNER_WHATSAPP_NUMBER, "Halo Radhiansyah Putra, saya ingin berdiskusi mengenai project digital.");
  const links = [[dictionary.nav.services,"/services"],[dictionary.nav.portfolio,"/portfolio"],[dictionary.nav.process,"/cara-kerja"],[dictionary.nav.about,"/about"],[dictionary.nav.startProject,"/start-project"]] as const;
  return <footer className="border-t border-border bg-surface"><div className="mx-auto max-w-[1360px] px-5 py-14 md:px-8 lg:px-12 xl:px-16"><div className="grid gap-12 border-b border-border pb-12 lg:grid-cols-[1.35fr_.65fr]"><div><Brand/><p className="mt-5 max-w-lg text-sm leading-7 text-secondary">{dictionary.footer.description}</p><p className="mt-7 text-xs font-semibold uppercase tracking-[.15em] text-secondary">Independent Web & Product Studio · Indonesia</p></div><div className="grid grid-cols-2 gap-8"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary">Explore</p><ul className="mt-4 space-y-3">{links.map(([label,href])=><li key={href}><Link href={href} className="text-sm font-semibold hover:text-primary">{label}</Link></li>)}</ul></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary">Contact</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">WhatsApp<br/>{whatsappNumber}<ArrowUpRight className="size-4"/></a><Link href="/login" className="mt-5 block text-sm text-secondary hover:text-primary">{dictionary.portal.clientPortal}</Link></div></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-secondary sm:flex-row"><span>© 2026 RRS Studio. {dictionary.footer.copyright}</span><span>Scope before assumptions.</span></div></div></footer>;
}
