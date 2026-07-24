import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { EditorialIndexRow, PublicEditorialIndex } from "@/components/public/editorial-index";
import { Button } from "@/components/ui/button";
import type { ServiceDiscoveryItem } from "@/features/services/public/types";

export function ServiceEditorialIndex({ services, isId }: { services: ServiceDiscoveryItem[]; isId: boolean }) {
  const copy = isId
    ? {
        eyebrow: "Editorial index",
        title: "Layanan lain, disusun untuk dipindai.",
        description: "Bandingkan konteks, timeline, teknologi, dan estimasi awal tanpa menganggapnya sebagai paket final.",
        deliveryFallback: "Timeline mengikuti scope",
        estimate: "Estimasi awal",
        estimateNote: "Harga final melalui quotation.",
        action: "Buka layanan",
      }
    : {
        eyebrow: "Editorial index",
        title: "More services, arranged for scanning.",
        description: "Compare context, timeline, technology, and starting estimates without treating them as final packages.",
        deliveryFallback: "Timeline follows scope",
        estimate: "Starting estimate",
        estimateNote: "Final pricing follows the quotation.",
        action: "Open service",
      };

  return (
    <PublicEditorialIndex
      titleId="services-index-title"
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    >
      {services.map((service, index) => {
        const number = index + 2;
        const variant = (index % 3) as 0 | 1 | 2;
        const headingClass = variant === 1 ? "lg:text-4xl" : variant === 2 ? "lg:text-[3.4rem]" : "lg:text-5xl";

        return (
          <EditorialIndexRow
            key={service.id}
            number={String(number).padStart(2, "0")}
            category={service.category}
            variant={variant}
            aside={
              <>
                <p className="text-[9px] font-bold uppercase tracking-[.14em] text-white/35">{copy.estimate}</p>
                <p className="mt-2 font-display text-2xl font-black text-accent-lime">{service.estimate}</p>
                <p className="mt-2 text-[10px] leading-5 text-white/36">{copy.estimateNote}</p>
                <Button asChild variant="outline" className="mt-5 rounded-full border-white/15 bg-white/[.04] text-white hover:bg-white/[.08]">
                  <Link href={`/services/${service.slug}`}>
                    {copy.action}
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </Button>
              </>
            }
          >
            <h3 className={`break-words font-display text-3xl font-black uppercase leading-[.92] tracking-[-.055em] ${headingClass}`}>{service.title}</h3>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">{service.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/42">
                <Clock3 className="size-3.5 text-accent-lime" aria-hidden="true" />
                {service.deliveryEstimate ?? copy.deliveryFallback}
              </span>
              {service.technologies.slice(0, 4).map((technology) => (
                <span key={technology} className="text-[9px] font-bold uppercase tracking-[.1em] text-white/30">{technology}</span>
              ))}
            </div>
          </EditorialIndexRow>
        );
      })}
    </PublicEditorialIndex>
  );
}
