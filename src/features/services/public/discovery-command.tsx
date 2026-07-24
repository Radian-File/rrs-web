import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ServiceTypeFilter } from "@/components/service-type-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ServiceTypeOption } from "@/features/services/public/types";

export function ServicesDiscoveryCommand({
  isId,
  types,
  type,
  query,
  resultCount,
  resultsLabel,
  activeLabel,
  clearLabel,
}: {
  isId: boolean;
  types: ServiceTypeOption[];
  type?: string;
  query: string;
  resultCount: number;
  resultsLabel: string;
  activeLabel: string | null;
  clearLabel: string;
}) {
  const copy = isId
    ? {
        eyebrow: "Perintah pencarian",
        title: "Temukan titik awal yang paling relevan.",
        description: "Cari berdasarkan kebutuhan, teknologi, atau pilih jenis layanan.",
        searchLabel: "Cari dalam katalog layanan",
        placeholder: "Cari website, dashboard, API, atau teknologi",
        typeLabel: "Jenis layanan",
        allLabel: "Semua layanan",
        submit: "Cari",
      }
    : {
        eyebrow: "Discovery command",
        title: "Find the most relevant starting point.",
        description: "Search by need or technology, or choose a service type.",
        searchLabel: "Search the service catalogue",
        placeholder: "Search websites, dashboards, APIs, or technology",
        typeLabel: "Service type",
        allLabel: "All services",
        submit: "Search",
      };

  return (
    <section id="services-discovery" className="relative z-20 scroll-mt-24 px-5 md:px-8 lg:px-12 xl:px-16" aria-labelledby="services-command-title">
      <div className="mx-auto -mt-10 max-w-[1280px] overflow-hidden rounded-[26px] border border-white/10 bg-[#242724] shadow-[0_30px_90px_rgba(0,0,0,.34)] lg:-mt-16">
        <div className="grid gap-4 px-5 pb-5 pt-6 sm:px-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end lg:px-8 lg:pb-7 lg:pt-8">
          <div>
            <div className="flex items-center gap-2 text-accent-lime">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              <p className="text-[9px] font-black uppercase tracking-[.18em]">{copy.eyebrow}</p>
            </div>
            <h2 id="services-command-title" className="mt-3 font-display text-2xl font-black tracking-[-.045em] text-white sm:text-3xl">{copy.title}</h2>
            <p id="services-command-description" className="mt-2 text-xs leading-6 text-white/46">{copy.description}</p>
          </div>

          <form method="get" action="/services" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]" aria-describedby="services-command-description">
            <div className="relative min-w-0">
              <label htmlFor="service-search" className="sr-only">{copy.searchLabel}</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/38" aria-hidden="true" />
              <Input
                id="service-search"
                type="search"
                name="q"
                defaultValue={query}
                placeholder={copy.placeholder}
                className="h-14 rounded-[14px] border-white/12 bg-[#181a19] pl-12 text-white placeholder:text-white/30"
              />
            </div>
            <ServiceTypeFilter types={types} value={type} query={query} label={copy.typeLabel} allLabel={copy.allLabel} />
            <Button type="submit" className="h-14 rounded-[14px] px-6">
              <Search className="size-4" aria-hidden="true" />
              {copy.submit}
            </Button>
          </form>
        </div>

        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-white/[.08] bg-[#1d1f1e] px-5 py-3 sm:px-7 lg:px-8">
          <p role="status" aria-live="polite" className="min-w-0 text-xs text-white/48 sm:text-sm">
            <span className="font-bold text-white">{resultCount}</span> {resultsLabel}
            {activeLabel && <span className="break-words"> · {activeLabel}</span>}
          </p>
          {(query || type) && (
            <Button asChild variant="ghost" size="sm" className="rounded-full border-white/10 text-white hover:bg-white/[.06]">
              <Link href="/services">{clearLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
