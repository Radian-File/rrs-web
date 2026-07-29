"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CircleHelp, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicProductStage } from "@/components/public/product-stage";
import { cn } from "@/lib/utils";

type GuideLevel = {
  id: string;
  code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
  title: string;
  summary: string;
  indicators: string[];
  escalationSignals: string[];
  estimate: string | null;
};

type GuideService = {
  id: string;
  slug: string;
  title: string;
  levels: GuideLevel[];
};

type MicroTask = { slug: string; title: string; summary: string; estimate: string | null } | null;

export function ProjectFitGuide({
  services,
  microTask,
  role,
  isId,
}: {
  services: GuideService[];
  microTask: MicroTask;
  role?: "OWNER" | "CLIENT";
  isId: boolean;
}) {
  const [activeServiceSlug, setActiveServiceSlug] = useState(services[0]?.slug ?? "");
  const activeService = services.find((service) => service.slug === activeServiceSlug) ?? services[0];
  const [activeLevelId, setActiveLevelId] = useState(activeService?.levels[0]?.id ?? "");
  const level = useMemo(
    () => activeService?.levels.find((item) => item.id === activeLevelId) ?? activeService?.levels[0],
    [activeLevelId, activeService],
  );

  if (!activeService || !level) return null;

  const copy = isId
    ? {
        eyebrow: "Project fit guide / titik mulai",
        serviceLabel: "Jenis project",
        levelLabel: "Tingkat kompleksitas",
        indicators: "Kenapa level ini mungkin cocok",
        escalation: "Biasanya naik level bila",
        estimate: "Starting estimate",
        estimateFallback: "Estimate menyusul setelah discovery",
        disclaimer: "Ini hanya titik mulai dari Client. Final scope, revision, timeline, dan harga selalu ditetapkan melalui quotation Owner.",
        clientAction: "Lanjutkan dengan gambaran ini",
        guestAction: "Login untuk kirim brief",
        ownerAction: "Buka Owner Workspace",
        discussion: "Diskusikan kebutuhanmu",
        microEyebrow: "Pekerjaan kecil / terpisah dari level",
        microTitle: "Butuh Quick Fix?",
        microRule: "Micro Task untuk perubahan kecil setelah quick assessment—bukan pembuatan website atau aplikasi lengkap.",
      }
    : {
        eyebrow: "Project fit guide / choose a starting point",
        serviceLabel: "Project type",
        levelLabel: "Complexity level",
        indicators: "Why this level may fit",
        escalation: "A higher level is often needed when",
        estimate: "Starting estimate",
        estimateFallback: "Estimate follows discovery",
        disclaimer: "This is Client-provided starting context only. The Owner quotation always defines the final scope, revisions, timeline, and price.",
        clientAction: "Continue with this starting point",
        guestAction: "Sign in to send a brief",
        ownerAction: "Open Owner Workspace",
        discussion: "Discuss your needs",
        microEyebrow: "Small work / separate from levels",
        microTitle: "Need a Quick Fix?",
        microRule: "Micro Tasks are small scoped changes after a quick assessment—not a full website or application build.",
      };

  const briefHref = `/start-project?service=${encodeURIComponent(activeService.slug)}&level=${encodeURIComponent(level.code)}`;
  const actionHref = role === "CLIENT" ? briefHref : role === "OWNER" ? "/owner" : `/login?callbackUrl=${encodeURIComponent(briefHref)}`;
  const actionLabel = role === "CLIENT" ? copy.clientAction : role === "OWNER" ? copy.ownerAction : copy.guestAction;

  function selectService(slug: string) {
    const next = services.find((service) => service.slug === slug);
    if (!next) return;
    setActiveServiceSlug(next.slug);
    setActiveLevelId(next.levels[0]?.id ?? "");
  }

  function handleServiceKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 : event.key === "ArrowRight" ? (index + 1) % services.length : (index - 1 + services.length) % services.length;
    const next = services[nextIndex];
    selectService(next.slug);
    document.getElementById(`project-fit-service-${next.slug}`)?.focus();
  }

  return (
    <PublicProductStage
      titleId="project-fit-guide-title"
      eyebrow={copy.eyebrow}
      index="02"
      meta={activeService.title}
      frameClassName="bg-[radial-gradient(circle_at_80%_14%,rgba(200,237,115,.12),transparent_28%),linear-gradient(135deg,#1a211b,#21291f_54%,#302d1d)]"
    >
      <div className="grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
        <div className="rounded-[22px] border border-white/10 bg-black/15 p-4 sm:p-5">
          <p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{copy.serviceLabel}</p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible" role="tablist" aria-label={copy.serviceLabel}>
            {services.map((service, index) => {
              const selected = service.slug === activeService.slug;
              return (
                <button
                  key={service.id}
                  id={`project-fit-service-${service.slug}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="project-fit-detail"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectService(service.slug)}
                  onKeyDown={(event) => handleServiceKeyDown(event, index)}
                  className={cn(
                    "min-h-11 shrink-0 break-words rounded-[14px] border px-4 py-3 text-left text-sm font-bold transition-[background-color,border-color,transform] duration-200 motion-reduce:transition-none xl:w-full",
                    selected ? "border-accent-lime/45 bg-accent-lime text-background" : "border-white/10 bg-white/[.035] text-white hover:border-white/25 hover:bg-white/[.07]",
                  )}
                >
                  {service.title}
                </button>
              );
            })}
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[9px] font-black uppercase tracking-[.18em] text-white/45">{copy.levelLabel}</p>
            <div className="mt-3 grid gap-2">
              {activeService.levels.map((item) => {
                const selected = item.id === level.id;
                return <button key={item.id} type="button" aria-pressed={selected} onClick={() => setActiveLevelId(item.id)} className={cn("flex min-h-11 items-center justify-between rounded-[14px] border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-200 motion-reduce:transition-none", selected ? "border-accent-lime/45 bg-white/[.12] text-white" : "border-white/10 bg-black/10 text-white/58 hover:border-white/25 hover:text-white")}><span className="font-semibold">{item.title}</span><span className={cn("text-[9px] font-black uppercase tracking-[.16em]", selected ? "text-accent-lime" : "text-white/35")}>{item.code}</span></button>;
              })}
            </div>
          </div>
        </div>

        <section id="project-fit-detail" role="tabpanel" aria-live="polite" aria-labelledby={`project-fit-service-${activeService.slug}`} className="rounded-[22px] border border-white/10 bg-[#202620] p-5 sm:p-7 lg:p-8">
          <p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{activeService.title} / {level.code}</p>
          <h2 id="project-fit-guide-title" className="mt-5 max-w-3xl break-words font-display text-[clamp(2.9rem,5vw,5.6rem)] font-black uppercase leading-[.86] tracking-[-.07em] text-white">{level.title}</h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">{level.summary}</p>
          <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 lg:grid-cols-2">
            <GuideList icon={Check} title={copy.indicators} items={level.indicators} />
            <GuideList icon={CircleHelp} title={copy.escalation} items={level.escalationSignals} />
          </div>
          <div className="mt-7 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.16em] text-white/40">{copy.estimate}</p>
              <p className="mt-2 break-words font-display text-3xl font-black text-accent-lime">{level.estimate ?? copy.estimateFallback}</p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-accent-lime px-6 text-background hover:bg-[#d7f58f]"><Link href={actionHref}>{actionLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-6 text-white/46">{copy.disclaimer}</p>
        </section>
      </div>
      {microTask ? <div className="mt-5 grid gap-4 rounded-[20px] border border-accent-lime/20 bg-accent-lime/[.06] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6"><span className="grid size-11 place-items-center rounded-full bg-accent-lime text-background"><Sparkles className="size-5" aria-hidden="true" /></span><div><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{copy.microEyebrow}</p><h3 className="mt-2 font-display text-2xl font-black tracking-[-.04em] text-white">{copy.microTitle}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">{microTask.summary} {copy.microRule}</p></div><div className="flex flex-col gap-3 sm:items-end"><p className="font-display text-2xl font-black text-accent-lime">{microTask.estimate ?? copy.estimateFallback}</p><Button asChild variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"><Link href="/contact"><MessageCircle className="size-4" aria-hidden="true" />{copy.discussion}</Link></Button></div></div> : null}
    </PublicProductStage>
  );
}

function GuideList({ icon: Icon, title, items }: { icon: typeof Check; title: string; items: string[] }) {
  return <div><p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-white/44"><Icon className="size-4 text-accent-lime" aria-hidden="true" />{title}</p><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="grid grid-cols-[16px_1fr] gap-2 text-sm leading-6 text-white/66"><span className="mt-2 size-1.5 rounded-full bg-accent-lime" aria-hidden="true" /><span>{item}</span></li>)}</ul></div>;
}
