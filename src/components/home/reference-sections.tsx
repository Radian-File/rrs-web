import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardList, FileCheck2, FileSignature, FolderKanban, PackageCheck, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeProject, HomeService } from "@/components/home/home-sections";

export function ReferenceServices({ isId, services }: { isId: boolean; services: HomeService[] }) {
  const lead = services[0];
  const headline = isId ? ["SEMUA YANG DIBUTUHKAN,", "DALAM SATU PROSES."] : ["EVERYTHING YOU NEED,", "IN ONE CLEAR PROCESS."];

  return (
    <section data-statement-motion className="rrs-grain relative overflow-hidden border-b border-white/[.06] bg-[#1a1c1b] text-white" aria-labelledby="reference-services-title">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-24 md:px-8 lg:px-12 lg:py-32 xl:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center text-center">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{isId ? "LAYANAN RRS" : "RRS SERVICES"}</p>
          <h2 id="reference-services-title" aria-label={headline.join(" ")} className="mt-5 font-display text-[clamp(3rem,5.8vw,5.8rem)] font-black uppercase leading-[.84] tracking-[-.07em]">
            {headline.map((line) => <span key={line} className="block overflow-hidden pb-[.08em] lg:whitespace-nowrap"><span data-motion-line className="block">{line}</span></span>)}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">{isId ? "Dari kebutuhan awal hingga delivery, setiap keputusan tetap terhubung dalam workflow yang dapat ditinjau." : "From the initial need through delivery, every decision remains connected in one reviewable workflow."}</p>
          <Button asChild size="lg" className="mt-7 rounded-full bg-accent-lime px-7 text-background hover:bg-[#d7f58f]"><Link href="/services">{isId ? "Lihat semua layanan" : "Explore all services"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
        </div>

        <div data-scroll-scene className="relative mt-20 overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_70%_10%,rgba(200,237,115,.11),transparent_30%),linear-gradient(145deg,#2e2b1d,#1d201d_65%)] p-4 shadow-[0_40px_120px_rgba(0,0,0,.35)] sm:p-6 lg:min-h-[720px] lg:p-8">
          <div className="grid min-h-[640px] gap-5 lg:grid-cols-[64px_.72fr_1.28fr]">
            <nav className="hidden flex-col items-center gap-3 rounded-[20px] border border-white/10 bg-black/15 px-2 py-5 lg:flex" aria-label={isId ? "Layanan pilihan" : "Selected services"}>
              <span className="grid size-10 place-items-center rounded-full bg-accent-lime font-display text-lg font-black text-background">R</span>
              <span className="my-2 h-px w-6 bg-white/10" />
              {(services.length ? services : [{ id: "capability", slug: "", title: "RRS", summary: "", category: "Studio", estimate: "", deliveryEstimate: null, technologies: [] }]).slice(0, 4).map((service, index) => <Link key={service.id} href={service.slug ? `/services/${service.slug}` : "/services"} aria-label={service.title} className={`grid size-10 place-items-center rounded-full border text-[10px] font-black transition-colors ${index === 0 ? "border-white bg-white text-background" : "border-white/10 bg-white/[.04] text-white/38 hover:border-accent-lime/40 hover:text-accent-lime"}`}>0{index + 1}</Link>)}
            </nav>

            <div data-scene-copy className="flex flex-col justify-end rounded-[22px] border border-white/10 bg-black/12 p-6 sm:p-8 lg:p-10">
              <p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">RRS / {lead?.category ?? (isId ? "Digital studio" : "Digital studio")}</p>
              <h3 className="mt-5 font-display text-[clamp(2.5rem,4.8vw,5.1rem)] font-black uppercase leading-[.86] tracking-[-.065em]">{lead?.title ?? (isId ? "Scope yang jelas sebelum development" : "Clear scope before development")}</h3>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/58">{lead?.summary ?? (isId ? "Website, aplikasi, dashboard, API, dan workflow digital dirancang berdasarkan kebutuhan yang dapat diverifikasi." : "Websites, applications, dashboards, APIs, and digital workflows are designed around verifiable needs.")}</p>
              {lead && <div className="mt-8 border-t border-white/12 pt-5"><p className="text-[9px] uppercase tracking-[.14em] text-white/35">{isId ? "Estimasi awal" : "Starting estimate"}</p><p className="mt-2 font-display text-2xl font-black text-accent-lime">{lead.estimate}</p><p className="mt-1 text-[10px] text-white/38">{isId ? "Harga final mengikuti quotation." : "Final pricing follows the quotation."}</p><Link href={`/services/${lead.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent-lime">{isId ? "Lihat detail layanan" : "View service details"}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>}
            </div>

            <div data-scene-visual className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#202320] p-4 sm:p-6 lg:p-8">
              <div className="flex h-9 items-center gap-2 border-b border-white/10 pb-4"><span className="size-2 rounded-full bg-[#f37b65]" /><span className="size-2 rounded-full bg-[#e7c35c]" /><span className="size-2 rounded-full bg-[#69b77c]" /><span className="ml-auto rounded-full border border-white/10 px-2 py-1 text-[7px] font-bold uppercase tracking-[.12em] text-white/38">{isId ? "Data published" : "Published data"}</span></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(services.length ? services : []).slice(0, 4).map((service, index) => <Link key={service.id} href={`/services/${service.slug}`} className={`group flex min-h-48 flex-col justify-between rounded-[16px] border p-5 transition-transform hover:-translate-y-1 ${index === 0 ? "border-[#5f805a] bg-[#30472f]" : index === 1 ? "border-[#565a63] bg-[#30343a]" : index === 2 ? "border-[#68545e] bg-[#3b3036]" : "border-white/10 bg-[#292c2a]"}`}>
                  <div className="flex items-start justify-between gap-3"><p className="text-[8px] font-black uppercase tracking-[.14em] text-white/45">0{index + 1} / {service.category}</p><ArrowUpRight className="size-3.5 text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></div>
                  <div><h4 className="font-display text-xl font-black leading-[.95] tracking-[-.035em]">{service.title}</h4><p className="mt-3 text-[10px] leading-5 text-white/45">{service.deliveryEstimate ?? (isId ? "Timeline mengikuti scope" : "Timeline follows scope")}</p><p className="mt-3 text-xs font-bold text-accent-lime">{service.estimate}</p></div>
                </Link>)}
                {services.length === 0 && <div className="col-span-2 grid min-h-[420px] place-items-center rounded-[16px] border border-dashed border-white/15 text-center"><div><FolderKanban className="mx-auto size-8 text-accent-lime" aria-hidden="true" /><p className="mt-5 font-display text-2xl font-black">{isId ? "Layanan published sedang disiapkan" : "Published services are being prepared"}</p><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/48">{isId ? "Katalog hanya menampilkan layanan yang telah dikonfirmasi Owner." : "The catalogue only displays services confirmed by the Owner."}</p></div></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReferenceSelectedWork({ isId, projects }: { isId: boolean; projects: HomeProject[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="bg-[#1a1c1b] py-24 text-white lg:py-32" aria-labelledby="reference-work-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-5xl text-center"><p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{isId ? "KARYA PILIHAN" : "SELECTED WORK"}</p><h2 id="reference-work-title" className="mt-5 font-display text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[.86] tracking-[-.07em]">{isId ? "PROJECT NYATA, DITAMPILKAN DENGAN KONTEKS." : "REAL WORK, SHOWN WITH CONTEXT."}</h2></div>
        <div className="mt-20 space-y-16 lg:space-y-24">{projects.map((project, index) => {
          const externalUrl = project.liveUrl ?? project.repositoryUrl;
          const tones = ["from-[#35301d] to-[#25261f]", "from-[#2d3438] to-[#202321]", "from-[#3b2e35] to-[#242322]"];
          return <article key={project.id} data-scroll-scene className={`overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${tones[index % tones.length]} p-5 shadow-[0_34px_100px_rgba(0,0,0,.3)] sm:p-8 lg:p-10`}>
            <div className="grid min-h-[590px] gap-10 lg:grid-cols-[.68fr_1.32fr] lg:items-end">
              <div data-scene-copy className="flex h-full flex-col justify-between py-2"><div><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">0{index + 1} / {project.category}</p><h3 className="mt-6 font-display text-[clamp(2.8rem,5vw,5.5rem)] font-black uppercase leading-[.84] tracking-[-.065em]">{project.title}</h3><p className="mt-6 max-w-lg text-sm leading-7 text-white/55">{project.summary}</p><div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/35">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>{externalUrl && <a href={externalUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-accent-lime px-5 py-3 text-sm font-black text-background">{isId ? "Buka project" : "Open project"}<ArrowUpRight className="size-4" aria-hidden="true" /></a>}</div>
              <div data-scene-visual className="relative min-h-[430px] overflow-hidden rounded-[22px] border border-white/12 bg-[#202320] shadow-[0_26px_80px_rgba(0,0,0,.38)]" style={project.coverImageUrl ? { backgroundImage: `linear-gradient(rgba(10,14,12,.08),rgba(10,14,12,.34)),url(${project.coverImageUrl})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
                <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-[#333633] px-4"><span className="size-2 rounded-full bg-[#f37b65]" /><span className="size-2 rounded-full bg-[#e7c35c]" /><span className="size-2 rounded-full bg-[#69b77c]" /><p className="ml-auto text-[8px] font-bold uppercase tracking-[.12em] text-white/35">RRS / {project.category}</p></div>
                {!project.coverImageUrl && <div className="grid min-h-[390px] place-items-center p-8"><div className="w-full max-w-xl"><div className="grid grid-cols-[.7fr_1.3fr] gap-4"><div className="space-y-3"><div className="h-2 w-20 bg-accent-lime" /><div className="h-2 w-28 bg-white/15" /><div className="mt-8 h-32 rounded-[12px] border border-white/10 bg-white/[.03]" /></div><div className="rounded-[14px] border border-white/10 bg-white/[.03] p-5"><div className="grid grid-cols-3 gap-3">{[1, 2, 3].map((item) => <div key={item} className="h-20 rounded-[10px] bg-white/[.06]" />)}</div><p className="mt-8 font-display text-2xl font-black uppercase tracking-[-.04em]">{project.title}</p></div></div></div></div>}
              </div>
            </div>
          </article>;
        })}</div>
      </div>
    </section>
  );
}

export function ReferenceFeatureObjects({ isId }: { isId: boolean }) {
  const headline = isId ? ["DIBUAT UNTUK MENJAGA", "PROJECT TETAP JELAS."] : ["BUILT TO KEEP", "COMPLEX WORK CLEAR."];
  const features = isId
    ? [
        { label: "Technical brief", detail: "Konteks terstruktur", icon: ClipboardList, shape: "wide" },
        { label: "Quotation", detail: "Scope & harga", icon: FileCheck2, shape: "circle" },
        { label: "Agreement", detail: "Protected record", icon: FileSignature, shape: "square" },
        { label: "Project", detail: "Milestone & file", icon: FolderKanban, shape: "wide" },
        { label: "Invoice", detail: "Payment verification", icon: ReceiptText, shape: "square" },
        { label: "Delivery", detail: "Approval & review", icon: PackageCheck, shape: "circle" },
      ]
    : [
        { label: "Technical brief", detail: "Structured context", icon: ClipboardList, shape: "wide" },
        { label: "Quotation", detail: "Scope & pricing", icon: FileCheck2, shape: "circle" },
        { label: "Agreement", detail: "Protected record", icon: FileSignature, shape: "square" },
        { label: "Project", detail: "Milestones & files", icon: FolderKanban, shape: "wide" },
        { label: "Invoice", detail: "Payment verification", icon: ReceiptText, shape: "square" },
        { label: "Delivery", detail: "Approval & review", icon: PackageCheck, shape: "circle" },
      ];

  return (
    <section data-feature-strip className="rrs-grain relative min-h-[850px] overflow-hidden border-y border-white/[.06] bg-[#1e201f] text-white">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-12 pt-24 text-center md:px-8 lg:px-12 lg:pt-32 xl:px-16">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{isId ? "WORKFLOW UTAMA" : "CORE WORKFLOW"}</p>
        <h2 aria-label={headline.join(" ")} className="mx-auto mt-5 max-w-[1320px] font-display text-[clamp(3rem,5.9vw,6rem)] font-black uppercase leading-[.84] tracking-[-.07em]">{headline.map((line) => <span key={line} className="block lg:whitespace-nowrap">{line}</span>)}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/52">{isId ? "Bukan kumpulan fitur dekoratif—setiap bagian mengikuti workflow RRS yang sudah berjalan." : "Not a collection of decorative features—every object represents the workflow RRS already operates."}</p>
        <Button asChild size="lg" className="mt-7 rounded-full bg-accent-lime px-7 text-background hover:bg-[#d7f58f]"><Link href="/cara-kerja">{isId ? "Pelajari workflow" : "Explore the workflow"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
      </div>

      <div className="relative z-10 mx-auto mt-8 grid max-w-6xl grid-cols-2 items-end gap-4 px-5 pb-20 sm:grid-cols-3 md:px-8 lg:left-1/2 lg:mx-0 lg:mt-12 lg:flex lg:w-max lg:max-w-none lg:-translate-x-1/2 lg:justify-center lg:gap-7 lg:px-6" aria-label={isId ? "Kapabilitas workflow RRS" : "RRS workflow capabilities"}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const tone = ["bg-[#3a2f34]", "bg-[#303532]", "bg-[#f1eee5] text-[#1a1c1b]", "bg-[#303a43]", "bg-accent-lime text-background", "bg-[#34301f]"][index];
          const sizing = feature.shape === "wide" ? "h-44 w-full rounded-[20px] lg:h-56 lg:w-80" : feature.shape === "square" ? "aspect-square w-full rounded-[24px] lg:size-52 lg:rounded-[28px]" : "aspect-square w-full rounded-full lg:size-48";
          return <article key={feature.label} data-feature-object className={`flex shrink-0 flex-col items-center justify-center border border-white/10 p-6 text-center shadow-[0_26px_70px_rgba(0,0,0,.3)] ${sizing} ${tone} ${index % 2 ? "lg:translate-y-8" : ""}`}>
            <Icon className="size-14 opacity-80" aria-hidden="true" />
            <h3 className="mt-5 font-display text-xl font-black uppercase tracking-[-.035em]">{feature.label}</h3>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[.12em] opacity-48">{feature.detail}</p>
          </article>;
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#151716] to-transparent" aria-hidden="true" />
    </section>
  );
}
