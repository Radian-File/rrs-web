import Link from "next/link";
import { Brand } from "@/components/brand";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { getServerEnv } from "@/lib/env";
import { createWhatsAppUrl, formatWhatsAppNumber } from "@/lib/whatsapp";

export async function SiteFooter() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const env = getServerEnv();
  const whatsappNumber = formatWhatsAppNumber(env.OWNER_WHATSAPP_NUMBER);
  const whatsapp = createWhatsAppUrl(env.OWNER_WHATSAPP_NUMBER, "Halo Radhiansyah Putra, saya ingin berdiskusi mengenai project digital.");
  const groups = [
    { title: dictionary.footer.services, links: [["Web Development", "/services"], ["UI/UX Design", "/services"], ["Web Applications", "/services"]] },
    { title: dictionary.footer.clients, links: [[dictionary.nav.process, "/#process"], [dictionary.nav.startProject, "/start-project"], [dictionary.portal.clientPortal, "/login"]] },
    { title: dictionary.footer.company, links: [[dictionary.nav.about, "/about"], ["Kontak", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
  ] as const;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8 lg:px-16">
        <div><Brand /><p className="mt-4 max-w-sm text-sm leading-6 text-secondary">{dictionary.footer.description}</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">WhatsApp: {whatsappNumber}</a></div>
        {groups.map((group) => <div key={group.title}><h2 className="text-sm font-bold">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-secondary transition-colors hover:text-primary">{label}</Link></li>)}</ul></div>)}
      </div>
      <div className="border-t border-border px-5 py-6 text-center text-xs text-secondary">© 2026 RRS Freelancer. {dictionary.footer.copyright}</div>
    </footer>
  );
}
