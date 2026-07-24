import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
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
    <section className="border-y border-white/[.06] bg-[#1a1c1b] py-20 text-white lg:py-28" aria-labelledby="services-index-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-6 border-b border-white/10 pb-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.eyebrow}</p>
            <h2 id="services-index-title" className="mt-4 max-w-3xl font-display text-[clamp(2.7rem,4.8vw,5rem)] font-black uppercase leading-[.88] tracking-[-.065em]">{copy.title}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/52 lg:justify-self-end">{copy.description}</p>
        </div>

        <div data-reveal-group className="mt-8 space-y-5 lg:mt-12">
          {services.map((service, index) => {
            const number = index + 2;
            const variant = index % 3;
            const frameClass = variant === 0
              ? "border-t border-white/10 py-10 lg:grid-cols-[108px_minmax(0,1.18fr)_minmax(260px,.82fr)] lg:py-14"
              : variant === 1
                ? "rounded-[28px] border border-white/10 bg-[#242724] px-5 py-9 sm:px-8 lg:ml-[6%] lg:grid-cols-[108px_minmax(0,.95fr)_minmax(270px,.75fr)] lg:px-10 lg:py-12"
                : "border-y border-white/10 py-12 lg:mr-[7%] lg:grid-cols-[108px_minmax(0,.82fr)_minmax(310px,1.05fr)] lg:items-end lg:py-16";
            const headingClass = variant === 1 ? "lg:text-4xl" : variant === 2 ? "lg:text-[3.4rem]" : "lg:text-5xl";

            return (
              <article key={service.id} data-reveal-item className={`group grid min-w-0 gap-7 ${frameClass}`}>
                <div className="flex items-center justify-between gap-4 lg:block">
                  <p className="font-display text-3xl font-black tracking-[-.06em] text-white/24">{String(number).padStart(2, "0")}</p>
                  <p className="text-right text-[8px] font-black uppercase tracking-[.16em] text-accent-lime lg:mt-4 lg:text-left">{service.category}</p>
                </div>

                <div className="min-w-0">
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
                </div>

                <div className={`min-w-0 ${variant === 2 ? "lg:border-l lg:border-white/10 lg:pl-8" : "lg:justify-self-end lg:self-end"}`}>
                  <p className="text-[9px] font-bold uppercase tracking-[.14em] text-white/35">{copy.estimate}</p>
                  <p className="mt-2 font-display text-2xl font-black text-accent-lime">{service.estimate}</p>
                  <p className="mt-2 text-[10px] leading-5 text-white/36">{copy.estimateNote}</p>
                  <Button asChild variant="outline" className="mt-5 rounded-full border-white/15 bg-white/[.04] text-white hover:bg-white/[.08]">
                    <Link href={`/services/${service.slug}`}>
                      {copy.action}
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
