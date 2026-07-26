import Link from "next/link";
import { ArrowDown, FileCheck2, Layers3, ShieldCheck } from "lucide-react";
import { PublicDiscoveryHero } from "@/components/public/discovery-hero";
import { PublishedMediaFrame } from "@/components/public/published-media";
import { Button } from "@/components/ui/button";
import type { ServiceTypeOption } from "@/features/services/public/types";

export function ServicesCapabilityHero({ isId, types }: { isId: boolean; types: ServiceTypeOption[] }) {
  const copy = isId
    ? {
        eyebrow: "SERVICE DISCOVERY / RRS STUDIO",
        titleLines: ["TEMUKAN TITIK AWAL", "YANG SESUAI UNTUK", "PROYEK ANDA."],
        description:
          "Pilih layanan dan tingkat kompleksitas yang paling mendekati kebutuhan Anda. RRS meninjau ruang lingkup sebelum menyiapkan quotation.",
        action: "Lihat layanan",
        pricingNote: "Estimasi awal · Ruang lingkup, timeline, dan harga final dijelaskan dalam quotation",
        catalogue: "Layanan tersedia",
        profile: "Peta layanan",
        emptyProfile: "Layanan disusun berdasarkan ruang lingkup",
        quotation: "Quotation setelah review",
        quotationDetail: "Harga final mengikuti ruang lingkup yang disepakati",
      }
    : {
        eyebrow: "SERVICE DISCOVERY / RRS STUDIO",
        titleLines: ["FIND THE RIGHT", "STARTING POINT FOR", "YOUR PROJECT."],
        description:
          "Choose the service and complexity level that most closely matches your need. RRS reviews the scope before preparing a quotation.",
        action: "View services",
        pricingNote: "Starting estimates · Scope, timeline, and final price are defined in the quotation",
        catalogue: "Available services",
        profile: "Service map",
        emptyProfile: "Services are shaped around scope",
        quotation: "Quotation after review",
        quotationDetail: "Final pricing follows the agreed scope",
      };

  const publishedTypes = types.filter((type) => type.count > 0).slice(0, 4);

  return (
    <PublicDiscoveryHero
      titleId="services-hero-title"
      eyebrow={copy.eyebrow}
      titleLines={copy.titleLines}
      description={<p>{copy.description}</p>}
      actions={
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
      }
      visualLabel={copy.profile}
      visual={
        <CapabilityMapVisual
          publishedTypes={publishedTypes}
          catalogue={copy.catalogue}
          profile={copy.profile}
          emptyProfile={copy.emptyProfile}
          quotation={copy.quotation}
          quotationDetail={copy.quotationDetail}
        />
      }
    />
  );
}

function CapabilityMapVisual({
  publishedTypes,
  catalogue,
  profile,
  emptyProfile,
  quotation,
  quotationDetail,
}: {
  publishedTypes: ServiceTypeOption[];
  catalogue: string;
  profile: string;
  emptyProfile: string;
  quotation: string;
  quotationDetail: string;
}) {
  return (
    <>
      <div className="absolute -left-4 top-[22%] hidden size-16 rotate-[-10deg] place-items-center rounded-[18px] border border-white/10 bg-[#292d2a] text-white/48 shadow-2xl sm:grid" aria-hidden="true">
        <Layers3 className="size-6" />
      </div>
      <div className="absolute -right-3 bottom-[18%] hidden size-20 rotate-[8deg] place-items-center rounded-full border border-accent-lime/30 bg-accent-lime text-background shadow-2xl sm:grid" aria-hidden="true">
        <FileCheck2 className="size-8" />
      </div>

      <PublishedMediaFrame
        chromeLabel={<>RRS / {catalogue}</>}
        className="relative rounded-[28px] border-white/12 p-4 shadow-[0_42px_100px_rgba(0,0,0,.42)] sm:p-6"
      >
        <div className="rounded-[20px] border border-white/10 bg-[#292c2a] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[9px] font-black uppercase tracking-[.17em] text-accent-lime">{profile}</p>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-white/38">
              Published
            </span>
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
              <p className="py-6 text-sm leading-7 text-white/52">{emptyProfile}</p>
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
            <p className="text-[8px] font-black uppercase tracking-[.14em] text-accent-lime">{quotation}</p>
            <p className="mt-7 font-display text-lg font-black leading-[1] tracking-[-.035em]">{quotationDetail}</p>
          </div>
        </div>
      </PublishedMediaFrame>
    </>
  );
}
