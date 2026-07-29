"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CircleHelp, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ServiceDetailLevel = {
  code: "ESSENTIAL" | "ADVANCED" | "PREMIUM";
  title: string;
  summary: string;
  indicators: string[];
  escalationSignals: string[];
  estimate: string | null;
};

type DetailLevelContextValue = {
  levels: ServiceDetailLevel[];
  activeLevel: ServiceDetailLevel;
  selectLevel: (code: ServiceDetailLevel["code"]) => void;
  serviceSlug: string;
  role?: "OWNER" | "CLIENT";
  isId: boolean;
  fallbackEstimate: string;
};

const DetailLevelContext = createContext<DetailLevelContextValue | null>(null);

export function ServiceDetailLevelProvider({
  levels,
  initialCode,
  serviceSlug,
  role,
  isId,
  fallbackEstimate,
  children,
}: {
  levels: ServiceDetailLevel[];
  initialCode?: ServiceDetailLevel["code"];
  serviceSlug: string;
  role?: "OWNER" | "CLIENT";
  isId: boolean;
  fallbackEstimate: string;
  children: React.ReactNode;
}) {
  const [activeCode, setActiveCode] = useState<ServiceDetailLevel["code"]>(
    levels.find((level) => level.code === initialCode)?.code ?? levels[0].code,
  );
  const activeLevel = levels.find((level) => level.code === activeCode) ?? levels[0];

  const selectLevel = useCallback((code: ServiceDetailLevel["code"]) => {
    if (!levels.some((level) => level.code === code)) return;
    setActiveCode(code);
  }, [levels]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("level", activeLevel.code);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [activeLevel.code]);

  const value = useMemo(
    () => ({ levels, activeLevel, selectLevel, serviceSlug, role, isId, fallbackEstimate }),
    [activeLevel, fallbackEstimate, isId, levels, role, selectLevel, serviceSlug],
  );

  return <DetailLevelContext.Provider value={value}>{children}</DetailLevelContext.Provider>;
}

function useDetailLevel() {
  const context = useContext(DetailLevelContext);
  if (!context) throw new Error("Service detail level controls require ServiceDetailLevelProvider.");
  return context;
}

export function ServiceDetailLevelPrice({ surface }: { surface: "hero" | "rail" }) {
  const { activeLevel, serviceSlug, role, isId, fallbackEstimate } = useDetailLevel();
  const estimate = activeLevel.estimate ?? fallbackEstimate;
  const briefHref = `/start-project?service=${encodeURIComponent(serviceSlug)}&level=${encodeURIComponent(activeLevel.code)}`;
  const actionHref = role === "CLIENT" ? briefHref : role === "OWNER" ? "/owner" : `/login?callbackUrl=${encodeURIComponent(briefHref)}`;
  const copy = isId
    ? {
        label: "Starting estimate",
        note: "Estimate mengikuti level yang dipilih. Scope, revision, timeline, dan harga final dikonfirmasi melalui quotation.",
        clientAction: "Lanjutkan dengan level ini",
        guestAction: "Login untuk kirim brief",
        ownerAction: "Buka Owner Workspace",
        discussion: "Diskusi terlebih dahulu",
      }
    : {
        label: "Starting estimate",
        note: "The estimate follows the selected level. Scope, revisions, timeline, and final price are confirmed through a quotation.",
        clientAction: "Continue with this level",
        guestAction: "Sign in to send a brief",
        ownerAction: "Open Owner Workspace",
        discussion: "Discuss first",
      };
  const actionLabel = role === "CLIENT" ? copy.clientAction : role === "OWNER" ? copy.ownerAction : copy.guestAction;

  if (surface === "hero") {
    return <aside className="border-l-2 border-accent-lime bg-white/[.035] p-6 lg:p-7" aria-label={copy.label} aria-live="polite"><p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.17em] text-accent-lime"><ShieldCheck className="size-4" aria-hidden="true" />{activeLevel.title} / {copy.label}</p><p className="mt-8 text-[10px] font-bold uppercase tracking-[.14em] text-white/38">{copy.label}</p><p className="mt-2 break-words font-display text-4xl font-black tracking-[-.05em] text-accent-lime">{estimate}</p><p className="mt-4 text-xs leading-6 text-white/48">{copy.note}</p></aside>;
  }

  return <div className="xl:sticky xl:top-24 overflow-hidden border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,.2)]" aria-live="polite"><div className="border-b border-border bg-accent-soft/60 p-6"><p className="break-words text-[10px] font-bold uppercase tracking-[.16em] text-primary">{activeLevel.title} / {copy.label}</p><p className="mt-3 break-words font-display text-3xl font-extrabold tracking-[-.045em] text-foreground">{estimate}</p><p className="mt-3 text-sm leading-6 text-secondary">{copy.note}</p></div><div className="p-6"><Button asChild size="lg" className="w-full"><Link href={actionHref}>{actionLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline" className="mt-3 w-full"><Link href="/contact"><MessageCircle className="size-4" aria-hidden="true" />{copy.discussion}</Link></Button></div></div>;
}

export function ServiceDetailLevelGuide() {
  const { levels, activeLevel, selectLevel, isId } = useDetailLevel();
  const copy = isId
    ? {
        eyebrow: "Project fit / pilih titik mulai",
        title: "Pilih level untuk proyekmu.",
        description: "Level menjelaskan kompleksitas awal, bukan paket fixed. Owner akan meninjau kebutuhanmu sebelum quotation dibuat.",
        levels: "Choose your level",
        indicators: "Kenapa level ini mungkin cocok",
        escalation: "Biasanya perlu naik level bila",
        estimate: "Starting estimate",
      }
    : {
        eyebrow: "Project fit / choose a starting point",
        title: "Choose the level for your project.",
        description: "A level explains starting complexity, not a fixed package. The Owner reviews your needs before creating a quotation.",
        levels: "Choose your level",
        indicators: "Why this level may fit",
        escalation: "A higher level is often needed when",
        estimate: "Starting estimate",
      };

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? levels.length - 1 : event.key === "ArrowRight" ? (index + 1) % levels.length : (index - 1 + levels.length) % levels.length;
    const next = levels[nextIndex];
    selectLevel(next.code);
    document.getElementById(`service-level-${next.code}`)?.focus();
  }

  return <section className="border-t border-border py-10 md:py-14" aria-labelledby="service-level-title"><div className="grid gap-7 2xl:grid-cols-[minmax(16rem,.62fr)_minmax(0,1.38fr)]"><div className="min-w-0 2xl:sticky 2xl:top-28 2xl:self-start"><p className="text-[9px] font-black uppercase tracking-[.18em] text-primary">{copy.eyebrow}</p><h2 id="service-level-title" className="mt-4 max-w-[20rem] break-words font-display text-[clamp(2.6rem,2.75vw,3.75rem)] font-black uppercase leading-[.86] tracking-[-.065em]">{copy.title}</h2><p className="mt-5 max-w-md text-sm leading-7 text-secondary">{copy.description}</p></div><div className="min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_78%_16%,rgba(200,237,115,.1),transparent_30%),linear-gradient(145deg,#242724,#171918)] p-4 text-white sm:p-6 lg:p-7"><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{copy.levels}</p><div role="tablist" aria-label={copy.levels} className="mt-4 flex snap-x gap-2 overflow-x-auto pb-2 lg:overflow-visible">{levels.map((level, index) => { const selected = level.code === activeLevel.code; return <button key={level.code} id={`service-level-${level.code}`} type="button" role="tab" aria-selected={selected} aria-controls="service-level-detail" tabIndex={selected ? 0 : -1} onClick={() => selectLevel(level.code)} onKeyDown={(event) => handleKeyDown(event, index)} className={cn("min-h-11 min-w-[8.5rem] snap-start rounded-[14px] border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-200 motion-reduce:transition-none lg:flex-1", selected ? "border-accent-lime/45 bg-accent-lime text-background" : "border-white/10 bg-white/[.035] text-white hover:border-white/25 hover:bg-white/[.08]")}><span className="block text-[8px] font-black uppercase tracking-[.16em] opacity-65">Level {index + 1}</span><span className="mt-1 block break-words font-display text-xl font-black">{level.title}</span></button>; })}</div><div id="service-level-detail" role="tabpanel" aria-live="polite" className="mt-5 rounded-[18px] border border-white/10 bg-black/15 p-5 sm:p-6"><div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-end"><div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">{activeLevel.code}</p><h3 className="mt-3 break-words font-display text-4xl font-black tracking-[-.055em]">{activeLevel.title}</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">{activeLevel.summary}</p></div><div className="min-w-0 shrink-0"><p className="text-[8px] font-black uppercase tracking-[.15em] text-white/38">{copy.estimate}</p><p className="mt-2 break-words font-display text-2xl font-black text-accent-lime">{activeLevel.estimate ?? "Custom scope"}</p></div></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><DetailList icon={Check} title={copy.indicators} items={activeLevel.indicators} /><DetailList icon={CircleHelp} title={copy.escalation} items={activeLevel.escalationSignals} /></div></div></div></div></section>;
}

function DetailList({ icon: Icon, title, items }: { icon: typeof Check; title: string; items: string[] }) {
  return <div><p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-white/44"><Icon className="size-4 text-accent-lime" aria-hidden="true" />{title}</p><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="grid grid-cols-[16px_1fr] gap-2 text-sm leading-6 text-white/66"><span className="mt-2 size-1.5 rounded-full bg-accent-lime" aria-hidden="true" /><span>{item}</span></li>)}</ul></div>;
}
