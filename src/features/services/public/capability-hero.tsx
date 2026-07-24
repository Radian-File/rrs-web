import Link from "next/link";
import { ArrowDown, FileCheck2, Layers3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceTypeOption } from "@/features/services/public/types";

export function ServicesCapabilityHero({ isId, types }: { isId: boolean; types: ServiceTypeOption[] }) {
  const copy = isId
    ? {
        eyebrow: "SERVICE DISCOVERY / RRS STUDIO",
        titleLines: ["KAPABILITAS DIGITAL,", "DIBENTUK DARI", "KEBUTUHAN NYATA."],
        description:
          "Jelajahi layanan untuk website, aplikasi, dashboard, internal system, API, dan workflow. Pilih titik awal; scope final tetap ditinjau bersama.",
        action: "Jelajahi kapabilitas",
        pricingNote: "Estimasi awal · Scope, timeline, dan harga final melalui quotation",
        catalogue: "Katalog published",
        profile: "Peta kapabilitas",
        emptyProfile: "Layanan disusun berdasarkan scope",
        quotation: "Quotation-first",
        quotationDetail: "Harga final setelah scope ditinjau",
      }
    : {
        eyebrow: "SERVICE DISCOVERY / RRS STUDIO",
        titleLines: ["DIGITAL CAPABILITY,", "SHAPED AROUND", "THE REAL NEED."],
        description:
          "Explore services for websites, applications, dashboards, internal systems, APIs, and workflows. Choose a starting point; the final scope is reviewed together.",
        action: "Explore capabilities",
        pricingNote: "Starting estimates · Final scope, timeline, and price through a quotation",
        catalogue: "Published catalogue",
        profile: "Capability map",
        emptyProfile: "Services are shaped around scope",
        quotation: "Quotation-first",
        quotationDetail: "Final pricing follows scope review",
      };

  const publishedTypes = types.filter((type) => type.count > 0).slice(0, 4);

  return (
    <section
      className="rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_78%_34%,rgba(82,164,119,.2),transparent_28%),linear-gradient(180deg,#101211_0%,#171a18_100%)] text-white"
      aria-labelledby="services-hero-title"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
        <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
        <div className="absolute inset-x-0 top-[35%] h-px bg-white/[.045]" />
        <div className="absolute -right-28 top-20 size-[30rem] rounded-full border border-white/[.045]" />
        <div className="absolute -right-12 top-36 size-[20rem] rounded-full border border-accent-lime/10" />
      </div>

      <div className="relative mx-auto grid min-h-[600px] max-w-[1440px] gap-12 px-5 pb-24 pt-16 md:px-8 md:pt-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-32 lg:pt-24 xl:px-16">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent-lime" aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime sm:text-xs">{copy.eyebrow}</p>
          </div>

          <h1
            id="services-hero-title"
            aria-label={copy.titleLines.join(" ")}
            className="mt-7 font-display text-[clamp(3.15rem,5.75vw,6.4rem)] font-black uppercase leading-[.82] tracking-[-.075em] text-[#f5f2ea]"
          >
            {copy.titleLines.map((line) => (
              <span key={line} className="block pb-[.08em] lg:whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{copy.description}</p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-full bg-accent-lime px-7 text-background hover:bg-[#d7f58f]">
              <Link href="#services-discovery">
                {copy.action}
                <ArrowDown className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="flex max-w-md items-start gap-2 text-[10px] font-bold uppercase leading-5 tracking-[.11em] text-white/38">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent-lime" aria-hidden="true" />
              {copy.pricingNote}
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] lg:justify-self-end" aria-label={copy.profile}>
          <div className="absolute -left-4 top-[22%] hidden size-16 rotate-[-10deg] place-items-center rounded-[18px] border border-white/10 bg-[#292d2a] text-white/48 shadow-2xl sm:grid" aria-hidden="true">
            <Layers3 className="size-6" />
          </div>
          <div className="absolute -right-3 bottom-[18%] hidden size-20 rotate-[8deg] place-items-center rounded-full border border-accent-lime/30 bg-accent-lime text-background shadow-2xl sm:grid" aria-hidden="true">
            <FileCheck2 className="size-8" />
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[#202320]/95 p-4 shadow-[0_42px_100px_rgba(0,0,0,.42)] sm:p-6">
            <div className="flex h-9 items-center gap-2 border-b border-white/10 pb-4">
              <span className="size-2 rounded-full bg-[#f37b65]" aria-hidden="true" />
              <span className="size-2 rounded-full bg-[#e7c35c]" aria-hidden="true" />
              <span className="size-2 rounded-full bg-[#69b77c]" aria-hidden="true" />
              <span className="ml-auto text-[8px] font-black uppercase tracking-[.15em] text-white/38">RRS / {copy.catalogue}</span>
            </div>

            <div className="mt-5 rounded-[20px] border border-white/10 bg-[#292c2a] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[9px] font-black uppercase tracking-[.17em] text-accent-lime">{copy.profile}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-white/38">Published</span>
              </div>

              <div className="mt-7 space-y-3">
                {publishedTypes.length > 0 ? (
                  publishedTypes.map((type, index) => (
                    <div key={type.slug} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                      <span className="font-display text-sm font-black text-white/30">0{index + 1}</span>
                      <span className="min-w-0 truncate text-sm font-bold text-white/82">{type.name}</span>
                      <span className="rounded-full bg-white/[.06] px-2.5 py-1 text-[9px] font-bold text-white/42">{type.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-sm leading-7 text-white/52">{copy.emptyProfile}</p>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-[16px] border border-white/10 bg-[#181a19] p-4">
                <p className="text-[8px] font-black uppercase tracking-[.14em] text-white/35">RRS / 01</p>
                <div className="mt-8 h-1.5 w-16 bg-accent-lime" aria-hidden="true" />
                <div className="mt-2 h-1.5 w-24 bg-white/12" aria-hidden="true" />
              </div>
              <div className="rounded-[16px] border border-[#5f805a] bg-[#30472f] p-4">
                <p className="text-[8px] font-black uppercase tracking-[.14em] text-accent-lime">{copy.quotation}</p>
                <p className="mt-7 font-display text-lg font-black leading-[1] tracking-[-.035em]">{copy.quotationDetail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
