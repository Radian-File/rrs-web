import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { PublicEditorialIndex } from "@/components/public/editorial-index";
import { Button } from "@/components/ui/button";
import type { ServiceDiscoveryItem } from "@/features/services/public/types";

export function ServiceEditorialIndex({
  services,
  isId,
  mode,
}: {
  services: ServiceDiscoveryItem[];
  isId: boolean;
  mode: "curated" | "results";
}) {
  const copy = isId
    ? mode === "curated"
      ? {
          eyebrow: "Pilihan RRS Studio",
          title: "Pilihan utama.",
          description: "Service yang paling worth checking out sebagai titik awal. Final scope dan price tetap dikunci lewat quotation.",
          deliveryFallback: "Timeline mengikuti scope",
          estimate: "Starting estimate",
          action: "Cek service",
        }
      : {
          eyebrow: "Hasil discovery",
          title: "Service yang match.",
          description: "Semua hasil di bawah berasal dari service published yang sesuai dengan keyword atau service type pilihanmu.",
          deliveryFallback: "Timeline mengikuti scope",
          estimate: "Starting estimate",
          action: "Cek service",
        }
    : mode === "curated"
      ? {
          eyebrow: "RRS Studio picks",
          title: "Top picks.",
          description: "Services worth checking out as a starting point. The final scope and price are still confirmed through a quotation.",
          deliveryFallback: "Timeline follows the scope",
          estimate: "Starting estimate",
          action: "Explore service",
        }
      : {
          eyebrow: "Discovery results",
          title: "Services that match.",
          description: "Every result below is a published service matching the selected keyword or service type.",
          deliveryFallback: "Timeline follows the scope",
          estimate: "Starting estimate",
          action: "Explore service",
        };

  return (
    <PublicEditorialIndex
      titleId="services-index-title"
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((service, index) => (
          <article key={service.id} data-reveal-item className="group flex min-w-0 flex-col rounded-[24px] border border-white/10 bg-[#242724] p-5 transition-colors hover:border-white/20 hover:bg-[#292c2a] sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-display text-2xl font-black tracking-[-.06em] text-white/24">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 break-words text-[8px] font-black uppercase tracking-[.16em] text-accent-lime">{service.serviceTypeName ?? service.category}</p>
              </div>
              {service.isFeatured && mode === "curated" && <span className="rounded-full border border-accent-lime/25 bg-accent-lime/10 px-3 py-1 text-[8px] font-black uppercase tracking-[.13em] text-accent-lime">Top pick</span>}
            </div>

            <h3 className="mt-8 break-words font-display text-3xl font-black uppercase leading-[.94] tracking-[-.055em] text-white sm:text-4xl">{service.title}</h3>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">{service.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/42"><Clock3 className="size-3.5 text-accent-lime" aria-hidden="true" />{service.deliveryEstimate ?? copy.deliveryFallback}</span>
              {service.technologies.slice(0, 3).map((technology) => <span key={technology} className="text-[9px] font-bold uppercase tracking-[.1em] text-white/30">{technology}</span>)}
            </div>

            <div className="mt-auto grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[.14em] text-white/35">{copy.estimate}</p>
                <p className="mt-2 break-words font-display text-2xl font-black text-accent-lime">{service.estimate}</p>
              </div>
              <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/[.04] text-white hover:bg-white/[.08]">
                <Link href={`/services/${service.slug}`}>{copy.action}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </PublicEditorialIndex>
  );
}
