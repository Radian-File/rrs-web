import Link from "next/link";
import { ArrowDownRight, ArrowRight, ShieldCheck } from "lucide-react";
import { WorkflowArtifacts } from "@/components/home/workflow-artifacts";
import { Button } from "@/components/ui/button";

type StudioHeroProps = { isId: boolean; primaryHref: string; primaryLabel: string };

export function StudioHero({ isId, primaryHref, primaryLabel }: StudioHeroProps) {
  const copy = isId
    ? {
        eyebrow: "RRS — Independent Web & Product Studio",
        titleLines: ["Karya digital yang baik", "dimulai dari kejelasan."],
        description: "RRS merancang dan membangun website serta aplikasi dengan scope, quotation, progress, dan delivery yang terdokumentasi—agar setiap keputusan memiliki konteks.",
        secondaryCta: "Lihat Cara Kerja",
        pricingNote: "Tanpa checkout instan. Harga final disusun melalui quotation.",
        disciplinesLabel: "Fokus studio",
        disciplines: ["Arah & strategi", "Desain produk", "Development"],
        artifactLabel: "Workflow RRS — antarmuka demonstrasi",
      }
    : {
        eyebrow: "RRS — Independent Web & Product Studio",
        titleLines: ["Great digital work", "starts with clarity."],
        description: "RRS designs and builds websites and applications with documented scope, quotations, progress, and delivery—so every decision remains grounded in context.",
        secondaryCta: "See How It Works",
        pricingNote: "No instant checkout. Final pricing is prepared through a quotation.",
        disciplinesLabel: "Studio focus",
        disciplines: ["Direction & strategy", "Product design", "Development"],
        artifactLabel: "RRS workflow — demonstration interfaces",
      };

  return (
    <section data-hero-motion className="relative isolate overflow-hidden border-b border-border bg-background text-foreground" aria-labelledby="home-hero-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 left-[7%] w-px bg-foreground/[0.07]" />
        <div className="absolute inset-y-0 left-1/2 hidden w-px bg-foreground/[0.07] lg:block" />
        <div className="absolute inset-x-0 top-[18%] h-px bg-foreground/[0.07]" />
        <div className="absolute right-[-12%] top-[8%] size-[30rem] rounded-full bg-primary/20 blur-[140px] sm:size-[42rem]" />
        <p className="absolute -right-7 bottom-[-3rem] font-display text-[9rem] font-extrabold leading-none tracking-[-0.09em] text-foreground/[0.025] sm:text-[16rem] lg:text-[22rem]">RRS</p>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-72px)] max-w-[1440px] gap-14 px-5 py-14 sm:py-16 md:px-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(520px,1.14fr)] lg:items-center lg:gap-8 lg:px-12 lg:py-20 xl:gap-14 xl:px-16">
        <div data-hero-copy className="relative z-10 max-w-[700px] lg:py-10">
          <div data-hero-eyebrow className="flex items-center gap-3">
            <span className="size-2 bg-accent-lime" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary sm:text-xs">{copy.eyebrow}</p>
          </div>

          <h1 id="home-hero-title" className="text-balance mt-7 font-display text-[clamp(3.15rem,7.2vw,6.85rem)] font-extrabold leading-[0.91] tracking-[-0.075em] text-foreground lg:text-[clamp(3.5rem,5.8vw,5.75rem)]">
            {copy.titleLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[.08em] -mb-[.08em] [perspective:900px]">
                <span data-hero-line className="block origin-bottom">{line}</span>
              </span>
            ))}
          </h1>

          <p data-hero-body className="mt-7 max-w-xl text-base leading-7 text-secondary sm:text-lg sm:leading-8">{copy.description}</p>

          <div data-hero-actions className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto"><Link href={primaryHref}>{primaryLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="w-full border-border-strong bg-transparent text-foreground hover:bg-surface-hover sm:w-auto"><Link href="/cara-kerja">{copy.secondaryCta}<ArrowDownRight className="size-4" aria-hidden="true" /></Link></Button>
          </div>

          <p data-hero-detail className="mt-5 flex max-w-lg items-start gap-2.5 text-xs font-medium leading-5 text-muted sm:text-sm sm:leading-6">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-lime" aria-hidden="true" />{copy.pricingNote}
          </p>

          <div data-hero-detail className="mt-10 border-y border-border py-4 sm:mt-12">
            <p className="sr-only">{copy.disciplinesLabel}</p>
            <ol className="grid grid-cols-3 gap-3">
              {copy.disciplines.map((discipline, index) => (
                <li key={discipline} className="border-l border-border pl-3 first:border-l-0 first:pl-0 sm:pl-4">
                  <span className="block font-mono text-[9px] text-accent-lime sm:text-[10px]">0{index + 1}</span>
                  <span className="mt-1.5 block text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-secondary sm:text-xs">{discipline}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div data-hero-stage className="relative z-10 lg:pl-2 [perspective:1200px]" aria-label={copy.artifactLabel}>
          <WorkflowArtifacts isId={isId} />
        </div>
      </div>
    </section>
  );
}
