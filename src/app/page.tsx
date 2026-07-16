import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageEntrance } from "@/components/page-entrance";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { formatIdr } from "@/lib/utils";

const services = [
  {
    category: "Web Development",
    title: "Responsive business website using Next.js",
    summary: "Fast, accessible, and designed around your business goals—not a generic template.",
    price: 5_000_000,
    delivery: "14–30 days",
    tags: ["Next.js", "SEO", "Responsive"],
  },
  {
    category: "Product Design",
    title: "Complete UI/UX design for web applications",
    summary: "Clear user flows and a scalable interface system ready for implementation.",
    price: 2_500_000,
    delivery: "10–21 days",
    tags: ["Figma", "UX", "Design System"],
  },
  {
    category: "Custom Application",
    title: "Full-stack web application for your workflow",
    summary: "Secure dashboards, client portals, and operational tools built to fit the process.",
    price: 8_000_000,
    delivery: "30–60 days",
    tags: ["Full-stack", "Database", "Dashboard"],
  },
];

const values = [
  ["01", "Focused expertise", "Work directly with a specialist who understands both product design and implementation."],
  ["02", "Clear quotations", "Review scope, timeline, payment terms, and exclusions before any project starts."],
  ["03", "Transparent progress", "Follow milestones, files, approvals, and project updates from one client portal."],
  ["04", "Reliable completion", "Structured delivery, payment, and verified review flow keep expectations aligned."],
];

const steps = [
  ["01", "Share the brief", "Tell me about the project, goals, budget range, and expected timeline."],
  ["02", "Discuss on WhatsApp", "We refine the scope, priorities, references, and realistic delivery plan."],
  ["03", "Review the quotation", "Receive an itemized quotation with clear scope, price, terms, and milestones."],
  ["04", "Track the project", "Approve the agreement, follow progress, review files, and manage invoices."],
  ["05", "Approve and complete", "Accept the final delivery and leave a verified project review."],
];

export default async function Home() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const landingServices = isId ? [
    { category: "Web Development", title: "Website bisnis responsif dengan Next.js", summary: "Cepat, aksesibel, dan dirancang berdasarkan tujuan bisnis—bukan template generik.", price: 5_000_000, delivery: "14–30 hari", tags: ["Next.js", "SEO", "Responsive"] },
    { category: "Product Design", title: "Desain UI/UX lengkap untuk web application", summary: "User flow yang jelas dan interface system yang scalable serta siap diimplementasikan.", price: 2_500_000, delivery: "10–21 hari", tags: ["Figma", "UX", "Design System"] },
    { category: "Custom Application", title: "Web application full-stack untuk workflow Anda", summary: "Dashboard aman, client portal, dan tools operasional yang dibuat sesuai proses kerja.", price: 8_000_000, delivery: "30–60 hari", tags: ["Full-Stack", "Database", "Dashboard"] },
  ] : services;
  const landingValues = isId ? [["01", "Keahlian yang fokus", "Bekerja langsung dengan spesialis yang memahami desain produk dan implementasi."], ["02", "Quotation yang jelas", "Tinjau scope, timeline, pembayaran, dan pengecualian sebelum project dimulai."], ["03", "Progress transparan", "Pantau milestone, file, approval, dan pembaruan project dari client portal."], ["04", "Delivery terarah", "Alur delivery, pembayaran, dan review terverifikasi membantu menyamakan ekspektasi."]] : values;
  const landingSteps = isId ? [["01", "Kirim brief", "Ceritakan project, tujuan, rentang budget, dan timeline yang diharapkan."], ["02", "Diskusi di WhatsApp", "Kita menyusun scope, prioritas, referensi, dan rencana delivery yang realistis."], ["03", "Tinjau quotation", "Terima quotation terperinci dengan scope, harga, terms, dan milestone yang jelas."], ["04", "Pantau project", "Setujui agreement, ikuti progress, tinjau file, dan kelola invoice."], ["05", "Selesaikan project", "Setujui hasil akhir dan berikan review project yang terverifikasi."]] : steps;
  return (
    <>
      <SiteHeader />
      <PageEntrance><main>
        <section className="overflow-hidden border-b border-border">
          <div className="mx-auto grid max-w-[1280px] gap-16 px-5 py-20 md:px-8 lg:grid-cols-[1.02fr_.98fr] lg:px-16 lg:py-28">
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit">{dictionary.home.eyebrow}</Badge>
              <h1 className="text-balance font-display text-[clamp(2.75rem,6vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.055em]">
                {dictionary.home.title}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-secondary">
                {dictionary.home.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg"><Link href="/start-project">{dictionary.home.primary} <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="outline"><Link href="/services">{dictionary.home.secondary}</Link></Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-secondary">
                <ShieldCheck className="size-4 text-primary" /> {dictionary.home.trust}
              </p>
              <form action="/services" className="relative mt-10 max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-secondary" aria-hidden="true" />
                <Input name="q" aria-label="Search services" placeholder={dictionary.home.searchPlaceholder} className="h-14 pl-12 pr-32 shadow-sm" />
                <Button type="submit" size="sm" className="absolute right-2 top-2 h-10">{dictionary.common.search}</Button>
              </form>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-secondary">
                <span>{dictionary.home.popular}</span><Link href="/services?category=Web%20Development" className="hover:text-primary">Website Development</Link><Link href="/services?category=Design" className="hover:text-primary">UI/UX Design</Link><Link href="/services?category=Web%20Application" className="hover:text-primary">Web Application</Link>
              </div>
            </div>

            <div className="relative min-h-[540px] lg:min-h-[620px]" aria-label="RRS workflow preview">
              <div className="absolute inset-x-4 top-8 h-[460px] rounded-[28px] bg-primary" />
              <Card className="absolute left-0 top-0 w-[78%] transition-transform duration-300 hover:-translate-y-1 sm:w-[64%]">
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="grid size-12 place-items-center rounded-full bg-accent-soft font-display font-extrabold text-primary">RR</div>
                    <div><p className="font-display font-bold">Radian</p><p className="text-sm text-secondary">Web & Product Specialist</p></div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="flex items-center gap-1 font-semibold"><Star className="size-4 fill-primary text-primary" /> Project-focused</span>
                    <Badge variant="success">Available</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="absolute right-0 top-36 w-[88%] transition-transform duration-300 hover:-translate-y-1 sm:w-[76%]">
                <CardContent>
                  <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-secondary">Sample quotation</p><h2 className="mt-2 font-display text-xl font-extrabold">Company Profile Website</h2></div><Badge variant="warning">Review</Badge></div>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-secondary">UI/UX Design</span><span className="font-semibold">Rp2.000.000</span></div>
                    <div className="flex justify-between"><span className="text-secondary">Development</span><span className="font-semibold">Rp5.000.000</span></div>
                    <div className="flex justify-between"><span className="text-secondary">SEO Foundation</span><span className="font-semibold">Rp1.000.000</span></div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="font-semibold">Estimated total</span><span className="font-display text-xl font-extrabold text-primary">Rp8.000.000</span></div>
                </CardContent>
              </Card>

              <Card className="absolute bottom-0 left-5 w-[85%] border-0 bg-[#123f31] text-white sm:left-12 sm:w-[72%]">
                <CardContent>
                  <div className="flex items-center justify-between"><div><p className="text-sm text-white/65">Active project</p><p className="mt-1 font-display font-bold">Design & Development</p></div><LayoutDashboard className="size-5 text-[#9ad6b8]" /></div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[65%] rounded-full bg-[#9ad6b8]" /></div>
                  <div className="mt-3 flex justify-between text-xs text-white/65"><span>Development in progress</span><span>65%</span></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 lg:px-16 lg:py-[120px]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-primary">{dictionary.home.valueEyebrow}</p>
            <h2 className="text-balance mt-4 font-display text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">{dictionary.home.valueTitle}</h2>
          </div>
          <div data-reveal-group className="mt-14 grid border-y border-border md:grid-cols-2">
            {landingValues.map(([number, title, description], index) => (
              <article key={number} data-reveal-item className={`grid grid-cols-[48px_1fr] gap-5 py-8 md:p-9 ${index % 2 === 0 ? "md:border-r" : ""} ${index < 2 ? "md:border-b" : ""}`}>
                <span className="font-display text-sm font-extrabold text-primary">{number}</span>
                <div><h3 className="font-display text-xl font-extrabold">{title}</h3><p className="mt-3 max-w-md leading-7 text-secondary">{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section data-reveal className="bg-surface py-24 lg:py-[120px]">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-16">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div><p className="text-sm font-bold uppercase tracking-[.16em] text-primary">{dictionary.home.servicesEyebrow}</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">{dictionary.home.servicesTitle}</h2></div>
              <Button asChild variant="outline"><Link href="/services">{isId ? "Lihat semua layanan" : "View all services"} <ArrowRight className="size-4" /></Link></Button>
            </div>
            <div data-reveal-group className="mt-12 grid gap-5 lg:grid-cols-3">
              {landingServices.map((service) => (
                <Card key={service.title} data-reveal-item data-motion-card className="group overflow-hidden">
                  <CardContent className="flex h-full flex-col">
                    <div data-card-media className="mb-8 flex h-44 items-end rounded-[10px] bg-[linear-gradient(145deg,#e8f0ec,#d7e6dd)] p-5">
                      <span className="grid size-11 place-items-center rounded-[10px] bg-surface text-primary shadow-sm"><Sparkles className="size-5" /></span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">{service.category}</p>
                    <h3 className="mt-3 font-display text-xl font-extrabold leading-7">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-secondary">{service.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">{service.tags.map((tag) => <Badge key={tag} variant="neutral">{tag}</Badge>)}</div>
                    <div className="mt-auto flex items-end justify-between border-t border-border pt-6">
                      <div><p className="text-xs text-secondary">{isId ? "Mulai dari" : "Starting from"}</p><p className="mt-1 font-display text-lg font-extrabold">{formatIdr(service.price)}</p></div>
                      <span className="flex items-center gap-1 text-xs text-secondary"><Clock3 className="size-4" /> {service.delivery}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="process" data-reveal className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 lg:px-16 lg:py-[120px]">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start"><p className="text-sm font-bold uppercase tracking-[.16em] text-primary">{dictionary.home.processEyebrow}</p><h2 className="text-balance mt-4 font-display text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">{dictionary.home.processTitle}</h2><p className="mt-6 max-w-md leading-7 text-secondary">{dictionary.home.processDescription}</p></div>
            <ol data-reveal-group className="border-t border-border">
              {landingSteps.map(([number, title, description]) => (
                <li key={number} data-reveal-item className="grid grid-cols-[52px_1fr] gap-5 border-b border-border py-7 md:grid-cols-[72px_180px_1fr] md:gap-8">
                  <span className="font-display text-sm font-extrabold text-primary">{number}</span><h3 className="font-display text-lg font-extrabold">{title}</h3><p className="col-start-2 text-sm leading-6 text-secondary md:col-start-auto">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section data-reveal className="bg-primary py-24 text-white lg:py-[120px]">
          <div className="mx-auto grid max-w-[1280px] gap-14 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-16">
            <div className="flex flex-col justify-center"><Badge className="w-fit bg-white/10 text-white">{dictionary.home.quoteEyebrow}</Badge><h2 className="text-balance mt-5 font-display text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">{dictionary.home.quoteTitle}</h2><p className="mt-6 max-w-lg leading-7 text-white/70">{dictionary.home.quoteDescription}</p><ul className="mt-8 space-y-3 text-sm text-white/85">{(isId ? ["Scope dan harga terperinci", "Riwayat revisi berversi", "Persetujuan client yang aman", "Jadwal pembayaran sebelum invoice"] : ["Itemized scope and pricing", "Versioned revision history", "Secure client approval", "Payment schedule before invoicing"]).map((item) => <li key={item} className="flex items-center gap-3"><Check className="size-4 text-[#9ad6b8]" />{item}</li>)}</ul></div>
            <Card className="border-white/10 shadow-2xl">
              <CardContent className="p-6 md:p-9">
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary">Quotation #QT-2026-0012</p><h3 className="mt-2 font-display text-2xl font-extrabold">{isId ? "Website Company Profile" : "Company Profile Website"}</h3></div><Badge variant="warning" className="h-fit w-fit">{isId ? "Menunggu persetujuan" : "Waiting for approval"}</Badge></div>
                <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><div><p className="text-xs text-secondary">{isId ? "Disiapkan untuk" : "Prepared for"}</p><p className="mt-1 font-semibold">{isId ? "Nama client" : "Client Name"}</p></div><div><p className="text-xs text-secondary">{isId ? "Berlaku hingga" : "Valid until"}</p><p className="mt-1 font-semibold">30 July 2026</p></div></div>
                <div className="mt-7 space-y-4 border-y border-border py-6 text-sm">{[["UI/UX Design", "Rp2.000.000"], ["Website Development", "Rp5.000.000"], ["Basic SEO Setup", "Rp1.000.000"]].map(([item, price]) => <div key={item} className="flex justify-between gap-4"><span className="text-secondary">{item}</span><span className="font-semibold">{price}</span></div>)}</div>
                <div className="flex items-center justify-between py-6"><span className="font-semibold">{isId ? "Total" : "Grand total"}</span><span className="font-display text-2xl font-extrabold text-primary">Rp8.000.000</span></div>
                <div className="grid gap-3 sm:grid-cols-3"><Button>{isId ? "Setujui" : "Accept"}</Button><Button variant="outline">{isId ? "Minta revisi" : "Request revision"}</Button><Button variant="ghost">{isId ? "Tolak" : "Reject"}</Button></div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 lg:px-16 lg:py-[120px]">
          <div className="rounded-[20px] border border-border bg-surface px-6 py-12 text-center shadow-[0_18px_60px_rgba(21,21,21,0.05)] md:px-12 md:py-16">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent-soft text-primary"><MessageCircle className="size-5" /></span>
            <h2 className="text-balance mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">{dictionary.home.finalTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-secondary">{dictionary.home.finalDescription}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/start-project">{dictionary.home.primary} <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/services">{dictionary.home.secondary}</Link></Button></div>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-secondary"><FileCheck2 className="size-4 text-primary" /> {dictionary.home.noPayment}</p>
          </div>
        </section>
      </main></PageEntrance>
      <SiteFooter />
    </>
  );
}
