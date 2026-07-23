import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, ExternalLink, FileCheck2, FolderKanban, MessageCircle, Quote, Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export type HomeProject = {
  id: string;
  title: string;
  summary: string;
  category: string;
  technologies: string[];
  coverImageUrl: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
};

export type HomeService = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  estimate: string;
  deliveryEstimate: string | null;
  technologies: string[];
};

export type HomeReview = {
  id: string;
  comment: string;
  overallRating: number;
  clientName: string;
  projectTitle: string;
};

export function StudioStatement({ isId }: { isId: boolean }) {
  const benefits = isId
    ? [
        ["01", "Scope sebelum development", "Requirement, batas pekerjaan, dan prioritas disepakati sebelum implementasi dimulai."],
        ["02", "Quotation yang dapat ditinjau", "Harga, timeline, pembayaran, revisi, dan exclusions ditulis secara formal."],
        ["03", "Satu portal untuk progress", "Milestone, file, approval, invoice, dan pembaruan project berada dalam satu tempat."],
        ["04", "Delivery yang terdokumentasi", "Hasil akhir, revisi, dan persetujuan Client tersimpan dengan jelas."],
      ]
    : [
        ["01", "Scope before development", "Requirements, boundaries, and priorities are agreed before implementation begins."],
        ["02", "A reviewable quotation", "Pricing, timeline, payments, revisions, and exclusions are documented formally."],
        ["03", "One portal for progress", "Milestones, files, approvals, invoices, and project updates stay in one place."],
        ["04", "Documented delivery", "Final work, revisions, and Client approval remain clear and traceable."],
      ];

  return (
    <section data-reveal data-statement-motion className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
      <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Prinsip kerja" : "Working principle"}</p>
          <h2 className="text-balance mt-5 font-display text-[clamp(2.7rem,5vw,5.2rem)] font-extrabold leading-[.94] tracking-[-.06em]">
            <span className="block overflow-hidden"><span data-motion-line className="block">{isId ? "Kejelasan bukan tambahan." : "Clarity is not an extra."}</span></span>
            <span className="block overflow-hidden"><span data-motion-line className="block text-accent-lime">{isId ? "Itu fondasi project." : "It is the project foundation."}</span></span>
          </h2>
          <p className="mt-7 max-w-lg text-base leading-8 text-secondary">
            {isId ? "Anda berkomunikasi langsung dengan orang yang merancang dan membangun project—tanpa lapisan account management yang menghilangkan konteks." : "You communicate directly with the person designing and building the project—without account-management layers that dilute context."}
          </p>
        </div>
        <ol data-reveal-group className="border-t border-border">
          {benefits.map(([number, title, description]) => (
            <li key={number} data-reveal-item className="grid gap-3 border-b border-border py-7 sm:grid-cols-[64px_1fr_1.15fr]">
              <span className="font-mono text-[10px] text-accent-lime">{number}</span>
              <h3 className="font-display text-xl font-bold tracking-[-.025em]">{title}</h3>
              <p className="text-sm leading-7 text-secondary">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SelectedWork({ isId, projects }: { isId: boolean; projects: HomeProject[] }) {
  return (
    <section className="border-y border-border bg-surface" aria-labelledby="selected-work-title">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Karya pilihan" : "Selected work"}</p>
            <h2 id="selected-work-title" className="mt-5 max-w-4xl font-display text-[clamp(2.7rem,5vw,5rem)] font-extrabold leading-[.96] tracking-[-.06em]">
              {isId ? "Project yang dapat diperiksa, bukan klaim yang dibuat-buat." : "Work you can examine, not claims we invented."}
            </h2>
          </div>
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-lime">{isId ? "Lihat semua karya" : "View all work"}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
        </div>

        {projects.length > 0 ? (
          <div className="mt-16 space-y-24 lg:space-y-32">
            {projects.map((project, index) => {
              const externalUrl = project.liveUrl ?? project.repositoryUrl;
              return (
                <article key={project.id} data-scroll-scene className="grid min-h-[70svh] items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div data-scene-visual className={index % 2 ? "lg:order-2" : ""}>
                    <div className="relative aspect-[16/11] overflow-hidden border border-border-strong bg-[#0b3027] p-6 shadow-[0_28px_90px_rgba(0,0,0,.28)] md:p-8" style={project.coverImageUrl ? { backgroundImage: `linear-gradient(rgba(5,20,16,.08),rgba(5,20,16,.34)),url(${project.coverImageUrl})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[.16em] text-white/60"><span>RRS / {project.category}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
                      {!project.coverImageUrl && <IntentionalProjectVisual title={project.title} />}
                    </div>
                  </div>
                  <div className={index % 2 ? "lg:order-1" : ""}>
                    <p data-scene-copy className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{project.category} / {String(index + 1).padStart(2, "0")}</p>
                    <h3 data-scene-copy className="mt-4 font-display text-[clamp(2.4rem,4.5vw,4.8rem)] font-extrabold leading-[.94] tracking-[-.055em]">{project.title}</h3>
                    <p data-scene-copy className="mt-6 max-w-xl text-base leading-8 text-secondary">{project.summary}</p>
                    <div data-scene-copy className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
                    {externalUrl && <a data-scene-copy href={externalUrl} target="_blank" rel="noreferrer" className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-lime">{isId ? "Buka project terverifikasi" : "Open verified project"}<ExternalLink className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div data-scroll-scene className="mt-16 grid gap-10 border-y border-border py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div data-scene-copy>
              <FolderKanban className="size-7 text-accent-lime" aria-hidden="true" />
              <h3 className="mt-6 font-display text-3xl font-bold tracking-[-.04em]">{isId ? "Karya terverifikasi sedang dikurasi." : "Verified work is being curated."}</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-secondary">{isId ? "Project hanya ditampilkan setelah deskripsi, asset, dan tautannya aman untuk dipublikasikan. Sementara itu, workflow di samping menunjukkan standar delivery yang sudah tersedia di RRS." : "Projects appear only after their descriptions, assets, and links are safe to publish. Meanwhile, the adjacent workflow shows the delivery standards already available in RRS."}</p>
            </div>
            <div data-scene-visual className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {(isId ? ["Scope terdokumentasi", "Progress dapat dipantau", "Delivery disetujui"] : ["Documented scope", "Trackable progress", "Approved delivery"]).map((item, index) => <div key={item} className="min-h-40 bg-background p-5"><span className="font-mono text-[10px] text-accent-lime">0{index + 1}</span><p className="mt-16 font-display text-lg font-bold">{item}</p></div>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProblemsSolved({ isId }: { isId: boolean }) {
  const problems = isId
    ? [
        ["Website belum meyakinkan", "Ubah informasi bisnis menjadi pengalaman yang jelas dan kredibel.", "website"],
        ["Operasi bergantung pada chat", "Bangun workflow internal yang lebih terstruktur dan dapat ditelusuri.", "internal system"],
        ["Data tersebar", "Satukan informasi penting dalam dashboard yang relevan untuk keputusan.", "dashboard"],
        ["Proses manual membuang waktu", "Hubungkan sistem dan otomatisasi langkah yang berulang.", "automation"],
        ["Scope belum jelas", "Mulai dari discovery, brief, dan quotation sebelum development.", "product"],
      ]
    : [
        ["The website is not convincing", "Turn business information into a clear, credible experience.", "website"],
        ["Operations depend on chat", "Build a more structured, traceable internal workflow.", "internal system"],
        ["Data is fragmented", "Bring decision-critical information into a relevant dashboard.", "dashboard"],
        ["Manual work consumes time", "Connect systems and automate repeatable steps.", "automation"],
        ["The scope is still unclear", "Start with discovery, a brief, and a quotation before development.", "product"],
      ];

  return (
    <section data-reveal className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
      <div className="grid gap-12 lg:grid-cols-[.58fr_1.42fr]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Masalah yang diselesaikan" : "Problems we solve"}</p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[.98] tracking-[-.05em]">{isId ? "Mulai dari kebutuhan, bukan template." : "Start with the need, not a template."}</h2>
        </div>
        <ol className="border-t border-border">
          {problems.map(([title, description, query], index) => (
            <li key={title} className="group border-b border-border">
              <Link href={`/services?q=${encodeURIComponent(query)}`} className="grid gap-4 py-7 transition-colors hover:bg-surface/40 sm:grid-cols-[52px_1fr_1.15fr_auto] sm:items-center">
                <span className="font-mono text-[10px] text-muted">0{index + 1}</span>
                <h3 className="font-display text-xl font-bold tracking-[-.025em] transition-transform group-hover:translate-x-1">{title}</h3>
                <p className="text-sm leading-7 text-secondary">{description}</p>
                <ArrowUpRight className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CapabilityMarquee({ isId }: { isId: boolean }) {
  const items = isId ? ["WEB DEVELOPMENT", "PRODUCT INTERFACE", "INTERNAL SYSTEM", "API INTEGRATION", "WORKFLOW AUTOMATION"] : ["WEB DEVELOPMENT", "PRODUCT INTERFACE", "INTERNAL SYSTEMS", "API INTEGRATION", "WORKFLOW AUTOMATION"];
  return (
    <div className="overflow-hidden border-y border-border bg-accent-lime py-3 text-background" aria-label={items.join(", ")}>
      <div className="rrs-marquee-track flex w-max gap-8 whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-[.1em]" aria-hidden="true">
        {[...items, ...items].map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-8"><span>{item}</span><span aria-hidden="true">✦</span></span>)}
      </div>
    </div>
  );
}

export function CuratedServices({ isId, services }: { isId: boolean; services: HomeService[] }) {
  return (
    <section className="border-b border-border bg-surface" aria-labelledby="home-services-title">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Layanan pilihan" : "Selected services"}</p><h2 id="home-services-title" className="mt-5 max-w-4xl font-display text-[clamp(2.7rem,5vw,5rem)] font-extrabold leading-[.96] tracking-[-.06em]">{isId ? "Kapabilitas yang mengikuti konteks project." : "Capabilities shaped around the project context."}</h2></div>
          <Button asChild variant="outline"><Link href="/services">{isId ? "Jelajahi katalog" : "Explore the catalogue"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
        </div>

        {services.length > 0 ? <ol className="mt-16 border-t border-border">{services.map((service, index) => (
          <li key={service.id} className="group border-b border-border">
            <Link href={`/services/${service.slug}`} className="grid gap-5 py-8 lg:grid-cols-[70px_1fr_1.15fr_240px_auto] lg:items-center">
              <span className="font-mono text-[10px] text-accent-lime">0{index + 1}</span>
              <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-primary">{service.category}</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-.035em] transition-transform group-hover:translate-x-1">{service.title}</h3></div>
              <p className="text-sm leading-7 text-secondary">{service.summary}</p>
              <div><p className="text-[10px] uppercase tracking-[.12em] text-muted">{isId ? "Estimasi awal" : "Starting estimate"}</p><p className="mt-1 font-display text-lg font-bold">{service.estimate}</p>{service.deliveryEstimate && <p className="mt-1 text-xs text-muted">{service.deliveryEstimate}</p>}</div>
              <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </li>
        ))}</ol> : <p className="mt-14 border-y border-border py-10 text-secondary">{isId ? "Layanan published sedang disiapkan." : "Published services are being prepared."}</p>}
        <p className="mt-6 text-xs text-muted">{isId ? "Semua nominal adalah estimasi awal. Harga final mengikuti scope dalam quotation Owner." : "All amounts are starting estimates. Final pricing follows the scope in the Owner-issued quotation."}</p>
      </div>
    </section>
  );
}

export function ProcessScene({ isId }: { isId: boolean }) {
  const steps = isId
    ? [["01", "Diskusi awal", "Guest dapat berdiskusi melalui contact form atau WhatsApp."], ["02", "Client account & technical brief", "Login menghubungkan identity Client dengan kebutuhan project."], ["03", "Scope & quotation", "Owner menyusun scope, timeline, revisi, pembayaran, dan harga final."], ["04", "Agreement & development", "Agreement, invoice, milestone, file, dan progress dikelola di portal."], ["05", "Delivery, approval & review", "Hasil ditinjau, disetujui, lalu dapat ditutup dengan review terverifikasi."]]
    : [["01", "Initial discussion", "Guests can discuss the project through the contact form or WhatsApp."], ["02", "Client account & technical brief", "Signing in connects the Client identity with the project requirements."], ["03", "Scope & quotation", "The Owner documents scope, timeline, revisions, payments, and final pricing."], ["04", "Agreement & development", "The agreement, invoices, milestones, files, and progress live in the portal."], ["05", "Delivery, approval & review", "The result is reviewed, approved, and may close with a verified review."]];
  return (
    <section id="process" data-process-motion className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
      <div className="grid gap-14 lg:grid-cols-[.62fr_1.38fr]">
        <div className="lg:sticky lg:top-28 lg:self-start"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Cara kerja" : "How it works"}</p><h2 className="mt-5 font-display text-4xl font-extrabold leading-[.98] tracking-[-.05em]">{isId ? "Dari diskusi hingga delivery." : "From discussion to delivery."}</h2><p className="mt-5 max-w-md text-sm leading-7 text-secondary">{isId ? "Setiap tahap memiliki output yang dapat ditinjau sebelum project bergerak lebih jauh." : "Every stage produces something reviewable before the project moves forward."}</p><Button asChild variant="outline" className="mt-7"><Link href="/cara-kerja">{isId ? "Lihat alur lengkap" : "See the complete workflow"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button></div>
        <ol className="relative border-t border-border"><span data-process-progress className="absolute bottom-0 left-[27px] top-0 hidden w-px bg-accent-lime sm:block" aria-hidden="true" />{steps.map(([number, title, description]) => <li key={number} data-process-step className="relative grid gap-3 border-b border-border py-8 sm:grid-cols-[56px_220px_1fr]"><span className="font-mono text-[10px] text-accent-lime">{number}</span><h3 className="font-display text-xl font-bold tracking-[-.025em]">{title}</h3><p className="text-sm leading-7 text-secondary">{description}</p></li>)}</ol>
      </div>
    </section>
  );
}

export function WorkflowProof({ isId }: { isId: boolean }) {
  const items = isId ? ["Versioned quotation", "Protected agreement", "Milestone, file & pesan", "Verifikasi invoice & pembayaran", "Persetujuan delivery", "Review terverifikasi"] : ["Versioned quotation", "Protected agreement", "Milestones, files & messages", "Invoice & payment verification", "Delivery approval", "Verified review"];
  return (
    <section data-scroll-scene className="border-y border-border bg-[#08251e] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-36 xl:px-16">
        <div data-scene-copy><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#bde77e]">{isId ? "Workflow sebagai bukti" : "Workflow as proof"}</p><h2 className="mt-5 font-display text-[clamp(2.7rem,5vw,5rem)] font-extrabold leading-[.96] tracking-[-.06em]">{isId ? "Ketahui apa yang dibangun sebelum pekerjaan dimulai." : "Know what will be built before the work begins."}</h2><p className="mt-6 max-w-lg text-base leading-8 text-white/65">{isId ? "RRS tidak berhenti pada landing page. Workflow formal menjaga keputusan tetap jelas hingga delivery." : "RRS does not stop at the landing page. The formal workflow keeps decisions clear through delivery."}</p><p className="mt-7 flex items-start gap-3 text-sm text-white/80"><FileCheck2 className="mt-0.5 size-5 shrink-0 text-[#bde77e]" aria-hidden="true" />{isId ? "Pembayaran berasal dari invoice setelah quotation dan agreement—not checkout dari halaman layanan." : "Payments originate from invoices after the quotation and agreement—not checkout from a service page."}</p></div>
        <div data-scene-visual className="grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2">{items.map((item, index) => <div key={item} className="flex min-h-36 flex-col justify-between bg-[#0b3027] p-6"><span className="font-mono text-[10px] text-[#bde77e]">0{index + 1}</span><p className="mt-8 flex items-start gap-3 text-sm font-semibold leading-6"><Check className="mt-1 size-4 shrink-0 text-[#bde77e]" aria-hidden="true" />{item}</p></div>)}</div>
      </div>
    </section>
  );
}

export function ReviewProof({ isId, reviews }: { isId: boolean; reviews: HomeReview[] }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Ulasan terverifikasi" : "Verified reviews"}</p><h2 className="mt-5 max-w-4xl font-display text-[clamp(2.7rem,5vw,5rem)] font-extrabold leading-[.96] tracking-[-.06em]">{isId ? "Feedback setelah pekerjaan benar-benar selesai." : "Feedback after the work was actually delivered."}</h2></div><Link href="/reviews" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-lime">{isId ? "Lihat semua ulasan" : "View all reviews"}<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
      {reviews.length > 0 ? <div data-reveal-group className="mt-14 grid gap-4 lg:grid-cols-3">{reviews.map((review, index) => <article key={review.id} data-reveal-item className={`relative border border-border bg-surface p-7 ${index === 1 ? "lg:translate-y-8" : ""}`}><Quote className="size-7 text-accent-lime" aria-hidden="true" /><blockquote className="mt-7 font-display text-xl font-semibold leading-8 tracking-[-.02em]">“{review.comment}”</blockquote><div className="mt-8 border-t border-border pt-5"><p className="font-bold">{review.clientName}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-primary"><BadgeCheck className="size-3.5" aria-hidden="true" />{review.projectTitle}</p><div className="mt-3 flex gap-1" aria-label={`${review.overallRating} out of 5 stars`}>{Array.from({ length: 5 }, (_, star) => <Star key={star} className={`size-3.5 ${star < review.overallRating ? "fill-accent-lime text-accent-lime" : "text-border"}`} aria-hidden="true" />)}</div></div></article>)}</div> : <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-3">{(isId ? ["Delivery ditinjau Client", "Approval tercatat", "Review hanya dari project selesai"] : ["Client-reviewed delivery", "Recorded approval", "Reviews only from completed projects"]).map((item, index) => <div key={item} className="min-h-36 bg-surface p-6"><ShieldCheck className="size-5 text-accent-lime" aria-hidden="true" /><p className="mt-8 font-display text-lg font-bold">{item}</p><span className="mt-2 block font-mono text-[9px] text-muted">0{index + 1}</span></div>)}</div>}
    </section>
  );
}

export function OwnerTeaser({ isId }: { isId: boolean }) {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-32 xl:px-16">
        <div className="flex aspect-[4/3] flex-col justify-between border border-border bg-[#0a2b23] p-6 text-white md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#bde77e]">RRS / Independent studio</p><p className="font-display text-[clamp(4rem,12vw,9rem)] font-extrabold leading-none tracking-[-.08em] text-white/10">01</p><p className="max-w-xs text-sm leading-7 text-white/65">{isId ? "Satu titik kontak yang bertanggung jawab dari arah hingga implementasi." : "One accountable point of contact from direction through implementation."}</p></div>
        <div className="self-center"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Tentang studio" : "About the studio"}</p><h2 className="mt-5 max-w-3xl font-display text-[clamp(2.7rem,5vw,5rem)] font-extrabold leading-[.96] tracking-[-.06em]">{isId ? "Kolaborasi langsung. Keputusan lebih singkat. Konteks tetap utuh." : "Direct collaboration. Shorter decisions. Context stays intact."}</h2><p className="mt-7 max-w-2xl text-base leading-8 text-secondary">{isId ? "RRS adalah independent digital studio di Bekasi yang menggabungkan product thinking, interface design, dan full-stack development dalam satu proses kerja." : "RRS is an independent digital studio in Bekasi, combining product thinking, interface design, and full-stack development in one working process."}</p><Button asChild variant="outline" className="mt-8"><Link href="/about">{isId ? "Kenali RRS" : "Learn about RRS"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button></div>
      </div>
    </section>
  );
}

export function HomeFaq({ isId }: { isId: boolean }) {
  const faq = isId ? [
    ["Apakah harga layanan sudah final?", "Belum. Harga pada katalog adalah estimasi awal. Harga final ditulis dalam quotation setelah scope ditinjau."],
    ["Mengapa technical brief perlu login?", "Akun menghubungkan identity Client dengan inquiry, quotation, agreement, project, invoice, file, dan approval yang bersifat privat."],
    ["Apakah diskusi bisa tanpa akun?", "Bisa. Contact form dan WhatsApp tetap terbuka untuk diskusi awal."],
    ["Kapan agreement muncul?", "Agreement tersedia setelah quotation diterima dan sebelum project memasuki pengerjaan formal."],
    ["Bagaimana pembayaran dan revisi bekerja?", "Jadwal pembayaran dan batas revisi ditulis pada quotation dan agreement. Pembayaran dilakukan melalui invoice."],
    ["Bagaimana progress dipantau?", "Client Portal menampilkan milestone, pesan, file, invoice, serta action yang perlu ditinjau."],
  ] : [
    ["Are service prices final?", "No. Catalogue prices are starting estimates. Final pricing is documented in the quotation after scope review."],
    ["Why does the technical brief require sign-in?", "The account connects the Client identity to private inquiries, quotations, agreements, projects, invoices, files, and approvals."],
    ["Can we discuss without an account?", "Yes. The contact form and WhatsApp remain available for the initial discussion."],
    ["When does the agreement appear?", "The agreement becomes available after quotation acceptance and before formal development begins."],
    ["How do payments and revisions work?", "The payment schedule and revision limits are documented in the quotation and agreement. Payments originate from invoices."],
    ["How is progress tracked?", "The Client Portal presents milestones, messages, files, invoices, and actions awaiting review."],
  ];
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-36 xl:px-16">
      <div className="grid gap-12 lg:grid-cols-[.62fr_1.38fr]"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">FAQ</p><h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-.05em]">{isId ? "Sebelum project dimulai." : "Before the project begins."}</h2></div><div className="border-t border-border">{faq.map(([question, answer], index) => <details key={question} className="group border-b border-border py-6"><summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-start gap-3 font-display text-lg font-bold tracking-[-.025em]"><span className="font-mono text-[9px] text-muted">0{index + 1}</span><span>{question}</span><span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p className="ml-11 mt-4 max-w-2xl text-sm leading-7 text-secondary">{answer}</p></details>)}</div></div>
    </section>
  );
}

export function FinalCta({ isId, primaryHref, primaryLabel }: { isId: boolean; primaryHref: string; primaryLabel: string }) {
  return (
    <section data-perspective-cta className="mx-auto max-w-[1440px] px-5 pb-24 [perspective:1200px] md:px-8 lg:px-12 lg:pb-36 xl:px-16">
      <div data-perspective-panel className="grid gap-10 border border-border bg-surface px-6 py-14 [transform-style:preserve-3d] sm:px-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:px-12 lg:py-20">
        <div data-perspective-content><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isId ? "Mulai dari konteks" : "Start with context"}</p><h2 className="mt-5 max-w-4xl font-display text-[clamp(2.7rem,5vw,5.2rem)] font-extrabold leading-[.94] tracking-[-.06em]">{isId ? "Punya project yang ingin dibangun?" : "Have a project you want to build?"}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-secondary">{isId ? "Mulai dari scope yang jelas sebelum development. Anda tetap dapat berdiskusi terlebih dahulu tanpa akun." : "Start with a clear scope before development. You can still discuss the project first without an account."}</p></div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Button asChild size="lg"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/contact"><MessageCircle className="size-4" aria-hidden="true" />{isId ? "Diskusi terlebih dahulu" : "Discuss first"}</Link></Button></div>
      </div>
      <form action="/services" className="relative mt-8 max-w-2xl"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-secondary" aria-hidden="true" /><input name="q" aria-label={isId ? "Cari layanan" : "Search services"} placeholder={isId ? "Cari website, dashboard, API, atau automation" : "Search websites, dashboards, APIs, or automation"} className="min-h-14 w-full border border-border bg-background pl-12 pr-28 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary" /><Button type="submit" size="sm" className="absolute right-2 top-2 h-10">{isId ? "Cari" : "Search"}</Button></form>
    </section>
  );
}

function IntentionalProjectVisual({ title }: { title: string }) {
  return <div className="mt-12 grid grid-cols-[.65fr_1.35fr] gap-4"><div className="space-y-3"><div className="h-2 w-20 bg-[#bde77e]" /><div className="h-2 w-28 bg-white/20" /><div className="mt-8 h-32 border border-white/15" /></div><div className="border border-white/15 p-5"><div className="grid grid-cols-3 gap-3">{[1, 2, 3].map((item) => <div key={item} className="h-20 bg-white/10" />)}</div><div className="mt-6 h-2 w-2/3 bg-white/20" /><p className="mt-6 font-display text-2xl font-bold text-white">{title}</p></div></div>;
}
