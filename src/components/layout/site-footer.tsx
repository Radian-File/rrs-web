import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { auth } from "@/auth";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
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
  const whatsapp = createWhatsAppUrl(env.OWNER_WHATSAPP_NUMBER, isId ? "Halo RRS Studio, saya ingin mendiskusikan kebutuhan project digital." : "Hello RRS Studio, I would like to discuss a digital project.");
  const primaryHref = role === "OWNER" ? "/owner" : role === "CLIENT" ? "/start-project" : loginUrl("/start-project");
  const primaryLabel = role === "OWNER" ? dictionary.portal.ownerWorkspace : (isId ? "Mulai brief proyek" : "Start a project brief");
  const accountHref = role === "OWNER" ? "/owner" : role === "CLIENT" ? "/client" : "/login";
  const accountLabel = role === "OWNER" ? dictionary.portal.ownerWorkspace : role === "CLIENT" ? dictionary.portal.clientPortal : dictionary.nav.signIn;
  const navigation = [[dictionary.nav.services, "/services"], [dictionary.nav.process, "/cara-kerja"], [dictionary.nav.reviews, "/reviews"], [dictionary.nav.about, "/about"]] as const;

  return (
    <footer data-perspective-cta className="rrs-grain relative overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(200,237,115,.14),transparent_30%),linear-gradient(180deg,#373018,#211f17)] px-4 py-20 [perspective:1400px] sm:px-6 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-black/10" aria-hidden="true" />
      <div data-perspective-panel className="relative z-10 mx-auto max-w-[1180px] overflow-hidden rounded-[28px] border border-white/12 bg-[#171918] text-white shadow-[0_48px_130px_rgba(0,0,0,.48)] [transform-style:preserve-3d]">
        <div data-perspective-content className="grid gap-10 border-b border-white/10 bg-[#262826] px-6 py-10 sm:px-9 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:px-12 lg:py-14">
          <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{isId ? "PROJECT BERIKUTNYA" : "YOUR NEXT PROJECT"}</p><p className="mt-4 max-w-xs text-sm leading-6 text-white/48">{isId ? "Mulai dari diskusi atau masuk ke workflow formal saat konteksnya sudah siap." : "Begin with a discussion or enter the formal workflow when the context is ready."}</p></div>
          <div><h2 className="font-display text-[clamp(2.7rem,5.4vw,5.3rem)] font-black uppercase leading-[.84] tracking-[-.065em]">{isId ? "BANGUN DENGAN ARAH, BUKAN ASUMSI." : "BUILD WITH DIRECTION, NOT ASSUMPTIONS."}</h2><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="rounded-full bg-accent-lime px-7 text-background hover:bg-[#d7f58f]"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline" className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/[.07]"><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle className="size-4" aria-hidden="true" />{isId ? "Diskusi dulu" : "Discuss first"}</a></Button></div></div>
        </div>

        <div className="grid gap-12 px-6 py-10 sm:px-9 lg:grid-cols-[1fr_1.35fr] lg:px-12 lg:py-12">
          <div><Brand /><p className="mt-6 max-w-sm text-sm leading-7 text-white/48">{dictionary.footer.description}</p><p className="mt-7 text-[9px] font-black uppercase tracking-[.16em] text-accent-lime">Independent digital studio · Bekasi, Indonesia</p></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn title={isId ? "Jelajahi" : "Explore"} links={navigation} />
            <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{isId ? "Akun" : "Account"}</p><ul className="mt-5 space-y-3"><li><Link href={accountHref} className="text-sm font-bold text-white/62 hover:text-white">{accountLabel}</Link></li><li><Link href="/contact" className="text-sm font-bold text-white/62 hover:text-white">{isId ? "Kontak" : "Contact"}</Link></li></ul></div>
            <div className="col-span-2 sm:col-span-1"><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">WhatsApp</p><a href={whatsapp} target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-start gap-2 text-sm font-bold leading-6 text-white/62 hover:text-white"><span>{whatsappNumber}</span><ArrowUpRight className="mt-1 size-4 text-accent-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a></div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/10 px-6 py-5 text-[10px] text-white/32 sm:flex-row sm:px-9 lg:px-12"><span>© 2026 RRS Studio. {dictionary.footer.copyright}</span><span>{isId ? "Privacy dan Terms dipublikasikan setelah legal review." : "Privacy and Terms will be published after legal review."}</span></div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{title}</p><ul className="mt-5 space-y-3">{links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm font-bold text-white/62 hover:text-white">{label}</Link></li>)}</ul></div>;
}
