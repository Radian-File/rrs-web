import Link from "next/link";
import { ArrowRight, Code2, ExternalLink, Layers3, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { studioStackCategoryLabels, type StudioStackCategoryValue } from "@/features/studio-stack/schema";

export type AboutCompositionCopy = {
  badge: string;
  title: string;
  intro: string;
  identityTitle: string;
  identity: string;
  approachTitle: string;
  approach: string;
  capabilityTitle: string;
  capability: string;
  collaborationTitle: string;
  collaboration: string;
  portfolioCta: string;
  servicesCta: string;
};

export type AboutStackItem = {
  id: string;
  name: string;
  category: StudioStackCategoryValue;
};

export function AboutComposition({
  copy,
  isId,
  portfolioUrl,
  stackItems,
}: {
  copy: AboutCompositionCopy;
  isId: boolean;
  portfolioUrl: string;
  stackItems: AboutStackItem[];
}) {
  const ui = isId
    ? {
        studio: "Independent digital studio / Bandung & Bekasi",
        accountable: "Dipimpin langsung",
        role: "Full-Stack Developer",
        location: "Bandung & Bekasi, Indonesia",
        manifesto: "Clarity before complexity.",
        manifestoDescription:
          "RRS menggabungkan product thinking, interface design, dan implementation untuk membangun sistem yang dapat dipahami, dipelihara, dan dipertanggungjawabkan.",
        objects: "Studio capability objects",
        principles: "Prinsip kerja",
        positioning: "Bekerja sebagai studio kecil dengan ownership langsung—bukan agency façade.",
      }
    : {
        studio: "Independent digital studio / Bandung & Bekasi",
        accountable: "Directly accountable",
        role: "Full-Stack Developer",
        location: "Bandung & Bekasi, Indonesia",
        manifesto: "Clarity before complexity.",
        manifestoDescription:
          "RRS combines product thinking, interface design, and implementation to build systems that can be understood, maintained, and held accountable.",
        objects: "Studio capability objects",
        principles: "Working principles",
        positioning: "A small studio with direct ownership—not an agency façade.",
      };
  const objects = [
    { title: copy.identityTitle, description: copy.identity, icon: ShieldCheck },
    { title: copy.approachTitle, description: copy.approach, icon: Sparkles },
    { title: copy.capabilityTitle, description: copy.capability, icon: Layers3 },
    { title: copy.collaborationTitle, description: copy.collaboration, icon: ArrowRight },
  ];
  const stackGroups = Object.entries(
    stackItems.reduce<Partial<Record<StudioStackCategoryValue, AboutStackItem[]>>>((groups, item) => {
      (groups[item.category] ??= []).push(item);
      return groups;
    }, {}),
  ) as [StudioStackCategoryValue, AboutStackItem[]][];

  return (
    <main>
      <section className="rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_80%_24%,rgba(200,237,115,.12),transparent_28%),linear-gradient(180deg,#101211,#181a18)] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
          <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
          <div className="absolute -right-20 top-20 size-[31rem] rounded-full border border-white/[.045]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-16 md:px-8 lg:px-12 lg:py-24 xl:px-16">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.badge}</p>
          <div className="mt-7 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[380px_minmax(0,1fr)]">
            <aside className="min-w-0 rounded-[24px] border border-white/10 bg-white/[.045] p-6 lg:p-7" aria-label="Radhiansyah Putra profile">
              <p className="text-[9px] font-black uppercase tracking-[.16em] text-accent-lime">{ui.studio}</p>
              <div className="mt-8 border-b border-white/10 pb-7">
                <p className="font-display text-3xl font-black tracking-[-.045em]">Radhiansyah Putra</p>
                <p className="mt-3 text-sm font-semibold text-white/65">{ui.role}</p>
                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-white/45"><MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{ui.location}</p>
              </div>

              {stackGroups.length > 0 && (
                <div className="mt-7">
                  <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-white/42"><Code2 className="size-4 text-accent-lime" aria-hidden="true" />Studio stack</p>
                  <div className="mt-5 space-y-5">
                    {stackGroups.map(([category, items]) => (
                      <div key={category}>
                        <p className="text-[8px] font-black uppercase tracking-[.15em] text-accent-lime">{studioStackCategoryLabels[category]}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {items.map((item) => <span key={item.id} className="rounded-full border border-white/10 bg-white/[.045] px-3 py-1.5 text-[9px] font-semibold text-white/68">{item.name}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            <div className="min-w-0 rounded-[24px] border border-white/[.07] bg-black/10 p-6 sm:p-8 lg:p-10 xl:p-12">
              <h1 className="max-w-5xl break-words font-display text-[clamp(2.7rem,4.7vw,5.4rem)] font-black uppercase leading-[.9] tracking-[-.065em] text-[#f5f2ea]">{copy.title}</h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/62 md:text-lg">{copy.intro}</p>
              <div className="mt-10 grid gap-6 border-t border-white/10 pt-7 md:grid-cols-[.35fr_.65fr]">
                <p className="text-[9px] font-black uppercase tracking-[.16em] text-accent-lime">{ui.manifesto}</p>
                <p className="text-sm leading-7 text-white/55">{ui.manifestoDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border" aria-labelledby="studio-manifesto-title">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-28 xl:px-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">RRS / {ui.accountable}</p>
            <h2 id="studio-manifesto-title" className="mt-4 font-display text-4xl font-extrabold tracking-[-.05em] md:text-5xl">{ui.manifesto}</h2>
          </div>
          <div className="lg:pt-8">
            <p className="max-w-3xl text-lg leading-9 text-secondary">{ui.manifestoDescription}</p>
            <a href={portfolioUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              {copy.portfolioCta}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[.06] bg-[#1a1c1b] text-white" aria-labelledby="studio-objects-title">
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-accent-lime">{ui.objects}</p>
          <h2 id="studio-objects-title" className="sr-only">{ui.objects}</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {objects.map((object, index) => {
              const Icon = object.icon;
              return (
                <article key={object.title} className={`min-w-0 rounded-[22px] border border-white/10 p-6 sm:p-8 ${index === 0 ? "bg-[#30472f] md:row-span-2" : "bg-[#242724]"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[.05] text-accent-lime"><Icon className="size-4" aria-hidden="true" /></span>
                    <span className="font-mono text-[10px] text-white/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-black uppercase tracking-[-.035em]">{object.title}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">{object.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-20 md:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-24 xl:px-16" aria-labelledby="studio-positioning-title">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{ui.principles}</p>
          <h2 id="studio-positioning-title" className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-[-.05em] md:text-5xl">{ui.positioning}</h2>
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/services">
            {copy.servicesCta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
