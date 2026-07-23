import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { auth } from "@/auth";
import { PageEntrance } from "@/components/page-entrance";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/contact/contact-form";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { getServerEnv } from "@/lib/env";
import { createWhatsAppUrl, formatWhatsAppNumber } from "@/lib/whatsapp";

export async function generateMetadata():Promise<Metadata>{const isId=(await getLocale())==="id";return{title:isId?"Kontak":"Contact",description:isId?"Diskusikan kebutuhan project digital melalui contact form atau WhatsApp sebelum technical brief dan quotation.":"Discuss a digital project through the contact form or WhatsApp before the technical brief and quotation."};}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const [{ sent }, locale, session] = await Promise.all([searchParams, getLocale(), auth()]);
  const env = getServerEnv();
  const isId = locale === "id";
  const role = session?.user?.role;
  const whatsappNumber = formatWhatsAppNumber(env.OWNER_WHATSAPP_NUMBER);
  const whatsapp = createWhatsAppUrl(env.OWNER_WHATSAPP_NUMBER, sent
    ? (isId ? `Halo RRS Studio, saya baru mengirim pesan melalui website. Reference contact: ${sent}. Saya ingin melanjutkan diskusi.` : `Hello RRS Studio, I have just submitted a website message. Contact reference: ${sent}. I would like to continue the discussion.`)
    : (isId ? "Halo RRS Studio, saya ingin berdiskusi mengenai kebutuhan project digital." : "Hello RRS Studio, I would like to discuss a digital project."));
  const projectHref = role === "OWNER" ? "/owner" : role === "CLIENT" ? "/start-project" : loginUrl("/start-project");
  const projectLabel = role === "OWNER" ? (isId ? "Buka Owner Workspace" : "Open Owner Workspace") : role === "CLIENT" ? (isId ? "Ajukan quotation" : "Request a quotation") : (isId ? "Login untuk mengajukan quotation" : "Sign in to request a quotation");

  return <><SiteHeader /><PageEntrance><main>
    <section className="border-b border-border"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-12 lg:py-28 xl:px-16"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Kontak" : "Contact"}</p><h1 className="text-balance mt-6 max-w-5xl font-display text-[clamp(3rem,6.5vw,6.2rem)] font-extrabold leading-[.93] tracking-[-.065em]">{isId ? "Pahami kebutuhan sebelum menentukan solusi." : "Understand the need before defining the solution."}</h1></div><p className="max-w-xl text-lg leading-8 text-secondary">{isId ? "Gunakan WhatsApp untuk diskusi awal, form untuk pertanyaan umum, atau Client account untuk mengirim technical brief formal." : "Use WhatsApp for an initial discussion, the form for general questions, or a Client account to submit a formal technical brief."}</p></div></section>
    <section data-reveal className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:px-8 lg:grid-cols-[.7fr_1.3fr] lg:px-12 lg:py-28 xl:px-16">
      <div>
        <div className="border-y border-border py-7"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">WhatsApp</p><p className="mt-3 font-display text-2xl font-bold">{whatsappNumber}</p><Button asChild variant="outline" className="mt-5"><a href={whatsapp} target="_blank" rel="noreferrer" aria-label={isId ? "Diskusi melalui WhatsApp" : "Discuss through WhatsApp"}><MessageCircle className="size-4" aria-hidden="true" />{isId ? "Diskusi langsung" : "Discuss directly"}</a></Button></div>
        <div className="border-b border-border py-7"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">{isId ? "Workflow formal" : "Formal workflow"}</p><p className="mt-3 text-sm leading-7 text-secondary">{isId ? "Technical brief menghubungkan kebutuhan, identity Client, quotation, dan project dalam satu alur privat." : "The technical brief connects the requirements, Client identity, quotation, and project in one private workflow."}</p><Link href={projectHref} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-lime">{projectLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
      </div>
      <div className="border border-border bg-surface p-6 md:p-10">
        {sent && <div className="mb-7 border-l-2 border-accent-lime bg-accent-soft p-5"><p className="text-sm font-semibold text-foreground">{isId ? "Pesan diterima dan tersimpan." : "Your message has been received and stored."}</p><p className="mt-2 text-sm leading-6 text-secondary">{isId ? "Lanjutkan ke WhatsApp jika Anda ingin memulai diskusi lebih cepat. Reference contact sudah disertakan." : "Continue on WhatsApp if you would like to begin the discussion sooner. Your contact reference is included."}</p><Button asChild className="mt-4"><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle className="size-4" aria-hidden="true" />{isId ? "Lanjut ke WhatsApp" : "Continue on WhatsApp"}</a></Button><p className="mt-4 text-xs text-secondary">{isId ? "Sudah memiliki Client Portal?" : "Already have a Client Portal?"} <Link href="/login" className="font-semibold text-primary hover:underline">{isId ? "Masuk" : "Sign in"}</Link> {isId ? "atau" : "or"} <Link href="/register" className="font-semibold text-primary hover:underline">{isId ? "buat akun" : "create an account"}</Link>.</p></div>}
        <ContactForm isId={isId} />
      </div>
    </section>
  </main></PageEntrance><SiteFooter /></>;
}
