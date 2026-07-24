"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Clock3, FileCheck2 } from "lucide-react";
import { PublicProductStage } from "@/components/public/product-stage";
import { Button } from "@/components/ui/button";
import type { ServiceDiscoveryGroup } from "@/features/services/public/types";
import { cn } from "@/lib/utils";

export function ServiceNavigator({
  groups,
  initialType,
  isId,
}: {
  groups: ServiceDiscoveryGroup[];
  initialType?: string;
  isId: boolean;
}) {
  const initialGroup = groups.find((group) => group.slug === initialType) ?? groups[0];
  const [activeType, setActiveType] = useState(initialGroup?.slug ?? "");
  const [activeService, setActiveService] = useState(initialGroup?.services[0]?.slug ?? "");
  const activeGroup = groups.find((group) => group.slug === activeType) ?? groups[0];
  const service = useMemo(
    () => activeGroup?.services.find((item) => item.slug === activeService) ?? activeGroup?.services[0],
    [activeGroup, activeService],
  );

  if (!activeGroup || !service) return null;

  const copy = isId
    ? {
        eyebrow: "Service navigator / pilih titik awal",
        typeLabel: "Service type",
        serviceLabel: "Pilihan service",
        detailLabel: "Service yang aktif",
        deliverables: "Yang bisa masuk ke scope",
        estimate: "Starting estimate",
        timeline: "Delivery estimate",
        timelineFallback: "Timeline mengikuti scope",
        action: "Cek service",
        quotation: "Final scope, timeline, dan price tetap dikunci melalui quotation.",
      }
    : {
        eyebrow: "Service navigator / choose a starting point",
        typeLabel: "Service type",
        serviceLabel: "Service options",
        detailLabel: "Active service",
        deliverables: "What can enter the scope",
        estimate: "Starting estimate",
        timeline: "Delivery estimate",
        timelineFallback: "Timeline follows the scope",
        action: "Explore service",
        quotation: "The final scope, timeline, and price are confirmed through a quotation.",
      };

  function selectType(slug: string) {
    const group = groups.find((item) => item.slug === slug);
    if (!group) return;
    setActiveType(group.slug);
    setActiveService(group.services[0]?.slug ?? "");
  }

  function handleTypeKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? groups.length - 1
        : event.key === "ArrowDown" || event.key === "ArrowRight"
          ? (index + 1) % groups.length
          : (index - 1 + groups.length) % groups.length;
    selectType(groups[nextIndex].slug);
    document.getElementById(`service-type-${groups[nextIndex].slug}`)?.focus();
  }

  return (
    <PublicProductStage
      titleId="service-navigator-title"
      eyebrow={copy.eyebrow}
      index={String(groups.findIndex((group) => group.slug === activeGroup.slug) + 1).padStart(2, "0")}
      meta={activeGroup.name}
      frameClassName="bg-[radial-gradient(circle_at_82%_16%,rgba(200,237,115,.1),transparent_30%),linear-gradient(145deg,#302d1d,#1d201d_62%)]"
    >
      <div className="grid gap-4 lg:grid-cols-[104px_minmax(260px,.72fr)_minmax(0,1.28fr)]">
        <div
          className="flex snap-x gap-2 overflow-x-auto rounded-[20px] border border-white/10 bg-black/15 p-3 focus-within:border-accent-lime/35 lg:flex-col lg:overflow-visible"
          role="tablist"
          aria-label={copy.typeLabel}
          aria-orientation="vertical"
        >
          {groups.map((group, index) => {
            const active = group.slug === activeGroup.slug;
            return (
              <button
                key={group.slug}
                id={`service-type-${group.slug}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="service-options-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => selectType(group.slug)}
                onKeyDown={(event) => handleTypeKeyDown(event, index)}
                className={cn(
                  "group min-w-[76px] snap-start rounded-[14px] border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:min-w-0",
                  active
                    ? "border-accent-lime/45 bg-accent-lime text-background"
                    : "border-white/10 bg-white/[.035] text-white hover:border-white/25 hover:bg-white/[.07]",
                )}
              >
                <span className={cn("font-display text-2xl font-black tracking-[-.06em]", active ? "text-background" : "text-white/35")}>{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-2 block text-[8px] font-black uppercase leading-4 tracking-[.12em]">{group.name}</span>
              </button>
            );
          })}
        </div>

        <section id="service-options-panel" role="tabpanel" aria-labelledby={`service-type-${activeGroup.slug}`} className="min-w-0 rounded-[20px] border border-white/10 bg-black/12 p-4 sm:p-5">
          <p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{copy.serviceLabel}</p>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
            {activeGroup.services.map((item, index) => {
              const active = item.slug === service.slug;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveService(item.slug)}
                  className={cn(
                    "min-w-[78%] snap-start rounded-[16px] border p-4 text-left transition-[border-color,background-color,transform] duration-200 motion-reduce:transition-none sm:min-w-[56%] lg:min-w-0 lg:w-full",
                    active
                      ? "border-accent-lime/45 bg-[#30472f] lg:translate-x-1 motion-reduce:translate-x-0"
                      : "border-white/10 bg-[#242724] hover:border-white/25 hover:bg-[#292c2a]",
                  )}
                >
                  <span className="text-[8px] font-black uppercase tracking-[.14em] text-white/38">{String(index + 1).padStart(2, "0")} / {item.category}</span>
                  <span className="mt-3 block font-display text-xl font-black leading-tight tracking-[-.035em] text-white">{item.title}</span>
                  <span className="mt-3 line-clamp-2 block text-xs leading-5 text-white/50">{item.summary}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-live="polite" aria-labelledby="service-navigator-title" className="min-w-0 rounded-[22px] border border-white/10 bg-[#242724] p-5 sm:p-7 lg:p-8">
          <p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{copy.detailLabel} / {activeGroup.name}</p>
          <h2 id="service-navigator-title" className="mt-5 max-w-3xl break-words font-display text-[clamp(2.5rem,4vw,4.6rem)] font-black uppercase leading-[.9] tracking-[-.06em]">{service.title}</h2>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-white/62">{service.description || service.summary}</p>

          {service.deliverables.length > 0 && (
            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[.15em] text-white/38"><FileCheck2 className="size-4 text-accent-lime" aria-hidden="true" />{copy.deliverables}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.deliverables.slice(0, 4).map((deliverable) => (
                  <li key={deliverable} className="grid grid-cols-[18px_1fr] gap-2 text-xs leading-5 text-white/68"><Check className="mt-0.5 size-3.5 text-accent-lime" aria-hidden="true" /><span>{deliverable}</span></li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-7 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[.15em] text-white/35">{copy.estimate}</p>
              <p className="mt-2 font-display text-2xl font-black text-accent-lime">{service.estimate}</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[.15em] text-white/35"><Clock3 className="size-3.5 text-accent-lime" aria-hidden="true" />{copy.timeline}</p>
              <p className="mt-2 text-sm font-semibold text-white/72">{service.deliveryEstimate ?? copy.timelineFallback}</p>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-[10px] leading-5 text-white/40">{copy.quotation}</p>
          <Button asChild size="lg" className="mt-6 rounded-full bg-accent-lime px-6 text-background hover:bg-[#d7f58f]">
            <Link href={`/services/${service.slug}`}>{copy.action}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
          </Button>
        </section>
      </div>
    </PublicProductStage>
  );
}
