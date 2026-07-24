import Link from "next/link";
import { ArrowUpRight, Check, Clock3, FileCheck2, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceDiscoveryItem } from "@/features/services/public/types";

export function ServiceProductStage({ service, isId }: { service: ServiceDiscoveryItem; isId: boolean }) {
  const copy = isId
    ? {
        eyebrow: "Layanan published / hasil utama",
        stageLabel: "Profil layanan published",
        overview: "Titik awal",
        estimate: "Estimasi awal",
        estimateNote: "Harga final mengikuti scope yang disetujui dalam quotation.",
        delivery: "Estimasi pengerjaan",
        deliveryFallback: "Timeline mengikuti scope",
        deliverables: "Contoh deliverables dalam layanan",
        technologies: "Teknologi & keahlian",
        quotation: "Scope dan harga final",
        quotationDetail: "Ditinjau dan didokumentasikan melalui quotation sebelum commitment.",
        action: "Lihat detail layanan",
      }
    : {
        eyebrow: "Published service / primary result",
        stageLabel: "Published service profile",
        overview: "Starting point",
        estimate: "Starting estimate",
        estimateNote: "Final pricing follows the scope agreed in the quotation.",
        delivery: "Estimated delivery",
        deliveryFallback: "Timeline follows scope",
        deliverables: "Service deliverables",
        technologies: "Technology & expertise",
        quotation: "Final scope and pricing",
        quotationDetail: "Reviewed and documented through a quotation before commitment.",
        action: "View service details",
      };

  const deliverables = service.deliverables.slice(0, 4);
  const technologies = service.technologies.slice(0, 6);

  return (
    <section data-reveal className="mx-auto max-w-[1440px] px-5 pb-20 pt-16 md:px-8 lg:px-12 lg:pb-28 lg:pt-24 xl:px-16" aria-labelledby="primary-service-title">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.19em] text-accent-lime">{copy.eyebrow}</p>
          <p className="mt-2 text-xs text-secondary">01 / {service.category}</p>
        </div>
        <span className="hidden h-px flex-1 bg-border lg:block" aria-hidden="true" />
      </div>

      <article className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_75%_12%,rgba(200,237,115,.1),transparent_30%),linear-gradient(145deg,#302d1d,#1d201d_62%)] p-4 text-white shadow-[0_42px_120px_rgba(0,0,0,.34)] sm:p-6 lg:p-8">
        <div className="grid min-h-[640px] gap-5 lg:grid-cols-[68px_minmax(0,.78fr)_minmax(0,1.22fr)]">
          <aside className="hidden flex-col items-center rounded-[20px] border border-white/10 bg-black/15 px-2 py-5 lg:flex" aria-label={copy.stageLabel}>
            <span className="grid size-10 place-items-center rounded-full bg-accent-lime font-display text-lg font-black text-background">R</span>
            <span className="my-4 h-px w-6 bg-white/10" aria-hidden="true" />
            <span className="grid size-10 place-items-center rounded-full border border-white bg-white font-display text-xs font-black text-background">01</span>
            <span className="mt-auto [writing-mode:vertical-rl] rotate-180 text-[8px] font-black uppercase tracking-[.17em] text-white/28">RRS / SERVICES</span>
          </aside>

          <div className="flex min-w-0 flex-col justify-between rounded-[22px] border border-white/10 bg-black/12 p-6 sm:p-8 lg:p-10">
            <div>
              <div className="flex items-center justify-between gap-4 lg:hidden">
                <span className="grid size-9 place-items-center rounded-full bg-accent-lime font-display font-black text-background">R</span>
                <span className="text-[9px] font-black uppercase tracking-[.16em] text-white/35">01 / Published</span>
              </div>
              <p className="mt-8 text-[9px] font-black uppercase tracking-[.18em] text-accent-lime lg:mt-0">RRS / {service.category}</p>
              <h2 id="primary-service-title" className="mt-5 break-words font-display text-[clamp(2.75rem,4.6vw,5.15rem)] font-black uppercase leading-[.86] tracking-[-.065em]">{service.title}</h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/58">{service.summary}</p>

              {technologies.length > 0 && (
                <div className="mt-7">
                  <p className="text-[8px] font-black uppercase tracking-[.15em] text-white/32">{copy.technologies}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/48">
                    {technologies.map((technology) => <span key={technology}>{technology}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 border-t border-white/12 pt-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.14em] text-white/35">{copy.estimate}</p>
                  <p className="mt-2 font-display text-3xl font-black text-accent-lime">{service.estimate}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.14em] text-white/35">{copy.delivery}</p>
                  <p className="mt-2 text-sm font-bold text-white/82">{service.deliveryEstimate ?? copy.deliveryFallback}</p>
                </div>
              </div>
              <p className="mt-5 max-w-lg text-[10px] leading-5 text-white/38">{copy.estimateNote}</p>
              <Button asChild size="lg" className="mt-6 rounded-full bg-accent-lime px-6 text-background hover:bg-[#d7f58f]">
                <Link href={`/services/${service.slug}`}>
                  {copy.action}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#202320] p-4 sm:p-6 lg:p-8" aria-label={`${copy.stageLabel}: ${service.title}`}>
            <div className="flex h-9 items-center gap-2 border-b border-white/10 pb-4">
              <span className="size-2 rounded-full bg-[#f37b65]" aria-hidden="true" />
              <span className="size-2 rounded-full bg-[#e7c35c]" aria-hidden="true" />
              <span className="size-2 rounded-full bg-[#69b77c]" aria-hidden="true" />
              <span className="ml-auto rounded-full border border-white/10 px-2.5 py-1 text-[7px] font-black uppercase tracking-[.12em] text-white/38">Published service</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[.82fr_1.18fr]">
              <div className="rounded-[18px] border border-white/10 bg-[#292c2a] p-5">
                <Layers3 className="size-5 text-accent-lime" aria-hidden="true" />
                <p className="mt-8 text-[8px] font-black uppercase tracking-[.15em] text-white/35">{copy.overview}</p>
                <p className="mt-3 font-display text-2xl font-black leading-[.95] tracking-[-.04em]">{service.category}</p>
                <div className="mt-8 border-t border-white/10 pt-4">
                  <Clock3 className="size-4 text-white/35" aria-hidden="true" />
                  <p className="mt-2 text-[10px] leading-5 text-white/45">{service.deliveryEstimate ?? copy.deliveryFallback}</p>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#5f805a] bg-[#30472f] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[8px] font-black uppercase tracking-[.15em] text-accent-lime">{copy.deliverables}</p>
                  <FileCheck2 className="size-5 shrink-0 text-accent-lime" aria-hidden="true" />
                </div>
                {deliverables.length > 0 ? (
                  <ul className="mt-7 space-y-4">
                    {deliverables.map((deliverable) => (
                      <li key={deliverable} className="grid grid-cols-[18px_1fr] gap-3 text-xs leading-5 text-white/72">
                        <span className="mt-0.5 grid size-4 place-items-center rounded-full bg-accent-lime text-background" aria-hidden="true">
                          <Check className="size-2.5" />
                        </span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-7 text-xs leading-6 text-white/58">{service.summary}</p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-white/10 bg-[#181a19] p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <span className="grid size-11 place-items-center rounded-full border border-accent-lime/30 bg-accent-lime/10 text-accent-lime">
                  <FileCheck2 className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[.15em] text-accent-lime">{copy.quotation}</p>
                  <p className="mt-2 text-xs leading-6 text-white/52">{copy.quotationDetail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
