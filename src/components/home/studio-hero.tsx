import Link from "next/link";
import { ArrowRight, FileCheck2, Layers3, ShieldCheck } from "lucide-react";
import { WorkflowArtifacts } from "@/components/home/workflow-artifacts";
import { Button } from "@/components/ui/button";

type StudioHeroProps = { isId: boolean; primaryHref: string; primaryLabel: string; primaryDetail: string | null };

export function StudioHero({ isId, primaryHref, primaryLabel, primaryDetail }: StudioHeroProps) {
  const copy = isId
    ? {
        eyebrow: "INDEPENDENT DIGITAL STUDIO — BEKASI",
        titleLines: ["WEBSITE & SISTEM DIGITAL,", "DENGAN SCOPE YANG JELAS."],
        description: "Untuk bisnis yang membutuhkan website, aplikasi, dashboard, atau alur kerja custom. Kita mulai dari brief, menyepakati quotation, lalu mengelola delivery dalam satu alur terdokumentasi.",
        pricingNote: "Tanpa checkout instan · Harga final mengikuti quotation yang disepakati",
        artifactLabel: "Contoh scope board RRS Studio",
      }
    : {
        eyebrow: "INDEPENDENT DIGITAL STUDIO — BEKASI",
        titleLines: ["DIGITAL PRODUCTS,", "WITH A CLEAR SCOPE."],
        description: "For businesses that need a website, application, dashboard, or custom workflow. We begin with a brief, agree the quotation, then manage delivery in one documented flow.",
        pricingNote: "No instant checkout · Final pricing follows the agreed quotation",
        artifactLabel: "RRS Studio scope board example",
      };

  return (
    <section data-hero-motion className="rrs-grain relative isolate min-h-[calc(100svh-72px)] overflow-hidden border-b border-border bg-[#101211] text-foreground" aria-labelledby="home-hero-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 left-[8%] w-px bg-white/[.045]" />
        <div className="absolute inset-y-0 right-[8%] w-px bg-white/[.045]" />
        <div className="absolute inset-x-0 top-[38%] h-px bg-white/[.045]" />
        <div className="absolute left-1/2 top-[20%] size-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-5 pb-0 pt-14 text-center md:px-8 lg:px-12 lg:pt-16 xl:px-16">
        <div data-hero-copy className="relative z-30 flex w-full max-w-[1320px] flex-col items-center">
          <div data-hero-eyebrow className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent-lime" aria-hidden="true" />
            <p className="text-[10px] font-extrabold uppercase tracking-[.19em] text-accent-lime sm:text-xs">{copy.eyebrow}</p>
          </div>

          <h1 id="home-hero-title" aria-label={copy.titleLines.join(" ")} className="mt-6 font-display text-[clamp(3.05rem,5.45vw,5.3rem)] font-black uppercase leading-[.82] tracking-[-.075em] text-[#f5f2ea]">
            {copy.titleLines.map((line) => (
              <span key={line} className="block overflow-hidden px-[.06em] pb-[.1em] lg:whitespace-nowrap [perspective:900px]">
                <span data-hero-line className="block origin-bottom">{line}</span>
              </span>
            ))}
          </h1>

          <p data-hero-body className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{copy.description}</p>

          <div data-hero-actions className="mt-7 flex flex-col items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-accent-lime px-7 text-background hover:bg-[#d7f58f]"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
            {primaryDetail && <p className="max-w-md text-xs leading-5 text-white/48">{primaryDetail}</p>}
          </div>

          <p data-hero-detail className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-white/38"><ShieldCheck className="size-3.5 text-accent-lime" aria-hidden="true" />{copy.pricingNote}</p>
        </div>

        <div data-hero-stage className="relative z-10 mt-3 w-full max-w-[1080px] [perspective:1400px]" aria-label={copy.artifactLabel}>
          <WorkflowArtifacts isId={isId} />
          <div data-hero-detail className="pointer-events-none absolute left-[1%] top-[42%] hidden size-16 rotate-[-12deg] place-items-center rounded-full border border-white/10 bg-[#292d2a] text-white/45 shadow-2xl lg:grid"><Layers3 className="size-6" aria-hidden="true" /></div>
          <div data-hero-detail className="pointer-events-none absolute right-[2%] top-[26%] hidden size-20 rotate-[9deg] place-items-center rounded-[18px] border border-accent-lime/30 bg-accent-lime text-background shadow-2xl lg:grid"><FileCheck2 className="size-8" aria-hidden="true" /></div>
          <div data-hero-detail className="pointer-events-none absolute bottom-[15%] right-[8%] hidden rounded-full border border-white/10 bg-[#242724] px-4 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-white/55 lg:block">Delivery approved</div>
        </div>
      </div>
    </section>
  );
}
