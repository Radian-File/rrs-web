import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  FileCheck2,
  Layers3,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PublishedMediaFrame } from "@/components/public/published-media";
import { PublicProductStage } from "@/components/public/product-stage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PublishedServiceDetail = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  deliverables: string[];
  technologies: string[];
  deliveryEstimate: string | null;
  revisionGuidance: string | null;
};

export function ServiceDetailComposition({
  service,
  estimate,
  quotationHref,
  quotationLabel,
  isId,
}: {
  service: PublishedServiceDetail;
  estimate: string;
  quotationHref: string;
  quotationLabel: string;
  isId: boolean;
}) {
  const copy = isId
    ? {
        allServices: "Semua layanan",
        eyebrow: "Profil layanan published",
        heroNote: "Titik awal untuk menyusun scope—bukan paket checkout.",
        estimate: "Estimasi awal",
        estimateNote: "Harga final hanya ditetapkan melalui quotation setelah scope ditinjau.",
        stageEyebrow: "Service product stage / scope awal",
        stageLabel: "Peta scope layanan",
        context: "Konteks layanan",
        deliverables: "Deliverables yang dapat dibahas",
        deliverableFallback: "Deliverables final akan dirinci setelah kebutuhan ditinjau.",
        technology: "Teknologi & keahlian",
        technologyFallback: "Technology stack mengikuti kebutuhan dan scope yang disetujui.",
        delivery: "Estimasi pengerjaan",
        deliveryFallback: "Timeline ditentukan setelah scope ditinjau",
        revisions: "Panduan revisi",
        revisionFallback: "Ketentuan revisi didokumentasikan dalam quotation",
        boundary: "Batas scope",
        boundaryDescription:
          "Item di luar deliverables, perubahan kebutuhan, timeline, dependency, dan exclusion dikonfirmasi tertulis di quotation sebelum commitment.",
        quotation: "Quotation-first",
        quotationDescription:
          "Technical brief membuat inquiry untuk ditinjau. Owner kemudian menyusun scope, harga, timeline, dan terms yang formal.",
        discussion: "Diskusi terlebih dahulu",
        published: "Published service",
        scopeMap: "Scope map",
        items: "deliverables tercatat",
        skills: "technology entries",
      }
    : {
        allServices: "All services",
        eyebrow: "Published service profile",
        heroNote: "A starting point for scope definition—not a checkout package.",
        estimate: "Starting estimate",
        estimateNote: "Final pricing is defined only through a quotation after scope review.",
        stageEyebrow: "Service product stage / starting scope",
        stageLabel: "Service scope map",
        context: "Service context",
        deliverables: "Deliverables available for discussion",
        deliverableFallback: "Final deliverables are documented after the requirements review.",
        technology: "Technology & expertise",
        technologyFallback: "The technology stack follows the approved requirements and scope.",
        delivery: "Estimated delivery",
        deliveryFallback: "Timeline is defined after scope review",
        revisions: "Revision guidance",
        revisionFallback: "Revision terms are documented in the quotation",
        boundary: "Scope boundary",
        boundaryDescription:
          "Items outside the deliverables, requirement changes, timeline, dependencies, and exclusions are confirmed in the quotation before commitment.",
        quotation: "Quotation-first",
        quotationDescription:
          "The technical brief creates an inquiry for review. The Owner then prepares the formal scope, price, timeline, and terms.",
        discussion: "Discuss first",
        published: "Published service",
        scopeMap: "Scope map",
        items: "recorded deliverables",
        skills: "technology entries",
      };

  return (
    <main>
      <section className="rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_82%_28%,rgba(82,164,119,.19),transparent_28%),linear-gradient(180deg,#101211,#171a18)] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
          <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
          <div className="absolute -right-20 top-20 size-[30rem] rounded-full border border-white/[.045]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-10 md:px-8 lg:px-12 lg:pb-28 lg:pt-14 xl:px-16">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-accent-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {copy.allServices}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,.55fr)] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">
                {copy.eyebrow} / {service.category}
              </p>
              <h1 className="mt-6 max-w-5xl break-words font-display text-[clamp(3.4rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.075em] text-[#f5f2ea]">
                {service.title}
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/62 md:text-lg">
                {service.summary}
              </p>
            </div>

            <aside className="border-l-2 border-accent-lime bg-white/[.035] p-6 lg:p-7" aria-label={copy.estimate}>
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.17em] text-accent-lime">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {copy.heroNote}
              </p>
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[.14em] text-white/38">{copy.estimate}</p>
              <p className="mt-2 break-words font-display text-4xl font-black tracking-[-.05em] text-accent-lime">{estimate}</p>
              <p className="mt-4 text-xs leading-6 text-white/48">{copy.estimateNote}</p>
            </aside>
          </div>
        </div>
      </section>

      <PublicProductStage
        titleId="service-scope-title"
        eyebrow={copy.stageEyebrow}
        index="01"
        meta={service.category}
      >
        <div className="grid min-h-[620px] gap-5 lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)]">
          <div className="flex min-w-0 flex-col justify-between rounded-[22px] border border-white/10 bg-black/15 p-6 sm:p-8 lg:p-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.18em] text-accent-lime">RRS / {copy.context}</p>
              <h2 id="service-scope-title" className="mt-5 max-w-xl font-display text-[clamp(2.5rem,4.5vw,4.8rem)] font-black uppercase leading-[.88] tracking-[-.06em]">
                {service.title}
              </h2>
              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-white/60">{service.description}</p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-[8px] font-black uppercase tracking-[.16em] text-white/35">{copy.technology}</p>
              {service.technologies.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.technologies.map((technology) => (
                    <span key={technology} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.1em] text-white/55">
                      {technology}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs leading-6 text-white/48">{copy.technologyFallback}</p>
              )}
            </div>
          </div>

          <PublishedMediaFrame
            chromeLabel={copy.published}
            ariaLabel={`${copy.stageLabel}: ${service.title}`}
            className="min-w-0 rounded-[22px] p-4 sm:p-6 lg:p-8"
            bodyClassName="mt-6"
            chromeLabelClassName="rounded-full border border-white/10 px-2.5 py-1 text-[7px]"
          >
            <div className="grid gap-4 sm:grid-cols-[.7fr_1.3fr]">
              <div className="rounded-[18px] border border-white/10 bg-[#292c2a] p-5">
                <Layers3 className="size-5 text-accent-lime" aria-hidden="true" />
                <p className="mt-8 text-[8px] font-black uppercase tracking-[.15em] text-white/35">{copy.scopeMap}</p>
                <p className="mt-3 font-display text-4xl font-black tracking-[-.05em]">{service.deliverables.length}</p>
                <p className="mt-2 text-[10px] leading-5 text-white/45">{copy.items}</p>
                <div className="mt-8 border-t border-white/10 pt-4">
                  <p className="font-display text-2xl font-black tracking-[-.04em]">{service.technologies.length}</p>
                  <p className="mt-2 text-[10px] leading-5 text-white/45">{copy.skills}</p>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#5f805a] bg-[#30472f] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[8px] font-black uppercase tracking-[.15em] text-accent-lime">{copy.deliverables}</p>
                  <FileCheck2 className="size-5 shrink-0 text-accent-lime" aria-hidden="true" />
                </div>
                {service.deliverables.length > 0 ? (
                  <ul className="mt-7 space-y-4">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable} className="grid grid-cols-[18px_1fr] gap-3 text-xs leading-5 text-white/72">
                        <span className="mt-0.5 grid size-4 place-items-center rounded-full bg-accent-lime text-background" aria-hidden="true">
                          <Check className="size-2.5" />
                        </span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-7 text-xs leading-6 text-white/58">{copy.deliverableFallback}</p>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailCard icon={Clock3} label={copy.delivery} value={service.deliveryEstimate ?? copy.deliveryFallback} />
              <DetailCard icon={RefreshCw} label={copy.revisions} value={service.revisionGuidance ?? copy.revisionFallback} />
            </div>
          </PublishedMediaFrame>
        </div>
      </PublicProductStage>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-24 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12 lg:pb-32 xl:px-16">
        <div className="min-w-0">
          <section className="grid gap-6 border-t border-border py-10 md:grid-cols-[.34fr_.66fr] md:py-14" aria-labelledby="service-boundary-title">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.18em] text-primary">RRS / 02</p>
              <h2 id="service-boundary-title" className="mt-3 font-display text-2xl font-extrabold tracking-[-.035em]">{copy.boundary}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-secondary md:text-base md:leading-8">{copy.boundaryDescription}</p>
          </section>

          <section className="grid gap-6 border-y border-border py-10 md:grid-cols-[.34fr_.66fr] md:py-14" aria-labelledby="service-technology-title">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.18em] text-primary">RRS / 03</p>
              <h2 id="service-technology-title" className="mt-3 font-display text-2xl font-extrabold tracking-[-.035em]">{copy.technology}</h2>
            </div>
            {service.technologies.length > 0 ? (
              <div className="flex flex-wrap content-start gap-2">
                {service.technologies.map((technology) => <Badge key={technology} variant="neutral">{technology}</Badge>)}
              </div>
            ) : (
              <p className="text-sm leading-7 text-secondary">{copy.technologyFallback}</p>
            )}
          </section>
        </div>

        <aside>
          <div className="sticky top-24 overflow-hidden border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,.2)]">
            <div className="border-b border-border bg-accent-soft/60 p-6">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">{copy.quotation}</p>
              <p className="mt-3 font-display text-3xl font-extrabold tracking-[-.045em] text-foreground">{estimate}</p>
              <p className="mt-3 text-sm leading-6 text-secondary">{copy.quotationDescription}</p>
            </div>
            <div className="p-6">
              <Button asChild size="lg" className="w-full">
                <Link href={quotationHref}>
                  {quotationLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="mt-3 w-full">
                <Link href="/contact">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {copy.discussion}
                </Link>
              </Button>
              <p className="mt-4 text-xs leading-5 text-secondary">{copy.estimateNote}</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-[#181a19] p-5">
      <Icon className="size-4 text-accent-lime" aria-hidden="true" />
      <p className="mt-5 text-[8px] font-black uppercase tracking-[.15em] text-white/35">{label}</p>
      <p className="mt-2 text-xs font-semibold leading-6 text-white/68">{value}</p>
    </div>
  );
}
