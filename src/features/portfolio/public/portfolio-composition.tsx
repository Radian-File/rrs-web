import Link from "next/link";
import { ArrowRight, ExternalLink, FolderKanban, Star } from "lucide-react";
import { PublicEmptyState } from "@/components/public/empty-state";
import { PublishedMediaFrame } from "@/components/public/published-media";
import { PublicProofScene } from "@/components/public/proof-scene";
import { Button } from "@/components/ui/button";
import { PaginationControls, pageSize } from "@/components/ui/pagination-controls";

export type PublishedPortfolioProject = {
  id: string;
  title: string;
  summary: string;
  category: string;
  technologies: string[];
  liveUrl: string | null;
};

export type VerifiedPortfolioReview = {
  id: string;
  comment: string;
  clientName: string;
  projectTitle: string;
};

export function PortfolioComposition({
  projects,
  reviews,
  page,
  hasNext,
  externalPortfolio,
  isId,
}: {
  projects: PublishedPortfolioProject[];
  reviews: VerifiedPortfolioReview[];
  page: number;
  hasNext: boolean;
  externalPortfolio: string;
  isId: boolean;
}) {
  const copy = isId
    ? {
        eyebrow: "Karya pilihan / record published",
        title: "Project nyata, tanpa proof yang direkayasa.",
        description:
          "Halaman ini hanya menampilkan record yang dipublikasikan Owner. Media project tidak ditampilkan sebelum provenance dan hosting-nya dikonfirmasi.",
        external: "Buka portofolio",
        emptyTitle: page > 1 ? "Tidak ada project pada halaman ini." : "Belum ada project published.",
        emptyDescription: page > 1
          ? "Kembali ke halaman pertama untuk melihat record published yang tersedia."
          : "Project akan tampil setelah record dikonfirmasi dan dipublikasikan Owner.",
        back: "Kembali ke awal",
        published: "Published project record",
        record: "Record project",
        technology: "Technology entries",
        action: "Lihat project",
        reviewsEyebrow: "Ulasan terverifikasi",
        reviewsTitle: "Feedback yang terhubung ke project selesai.",
        reviewsDescription: "Hanya review published dari Client dan project yang berstatus selesai.",
        allReviews: "Lihat semua ulasan",
        verified: "Project terverifikasi",
      }
    : {
        eyebrow: "Selected work / published records",
        title: "Real projects, without manufactured proof.",
        description:
          "This page only shows records published by the Owner. Project media remains hidden until its provenance and hosting are confirmed.",
        external: "Open portfolio",
        emptyTitle: page > 1 ? "No projects on this page." : "No published projects yet.",
        emptyDescription: page > 1
          ? "Return to the first page to view the available published records."
          : "Projects appear after the Owner confirms and publishes their records.",
        back: "Return to the beginning",
        published: "Published project record",
        record: "Project record",
        technology: "Technology entries",
        action: "View project",
        reviewsEyebrow: "Verified reviews",
        reviewsTitle: "Feedback connected to completed work.",
        reviewsDescription: "Only published Client reviews from completed projects are shown.",
        allReviews: "View all reviews",
        verified: "Verified project",
      };

  return (
    <main>
      <section className="rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_82%_26%,rgba(200,237,115,.12),transparent_28%),linear-gradient(180deg,#111311,#191b19)] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
          <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
          <div className="absolute -right-20 top-20 size-[32rem] rounded-full border border-white/[.045]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.eyebrow}</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,.55fr)] lg:items-end lg:gap-16">
            <div>
              <h1 className="max-w-5xl font-display text-[clamp(3.5rem,7vw,7.6rem)] font-black uppercase leading-[.82] tracking-[-.075em] text-[#f5f2ea]">
                {copy.title}
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/58 md:text-lg">{copy.description}</p>
            </div>
            <a
              href={externalPortfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-5 text-sm font-bold text-white transition-colors hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copy.external}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {projects.length === 0 ? (
        <PublicEmptyState
          titleId="portfolio-empty-title"
          icon={FolderKanban}
          eyebrow={copy.published}
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          action={page > 1 ? <Button asChild variant="outline"><Link href="/portfolio">{copy.back}</Link></Button> : undefined}
        />
      ) : (
        <section className="border-b border-white/[.06] bg-[#1a1c1b] text-white" aria-label={copy.published}>
          <div data-reveal-group className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12 xl:px-16">
            {projects.map((project, index) => (
              <PublicProofScene
                key={project.id}
                index={String((page - 1) * pageSize + index + 1).padStart(2, "0")}
                eyebrow={project.category}
                title={project.title}
                summary={project.summary}
                reverse={index % 2 === 1}
                visual={<ProjectRecordVisual project={project} copy={copy} />}
                meta={
                  project.technologies.length > 0 ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-bold uppercase tracking-[.1em] text-white/35">
                      {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                    </div>
                  ) : undefined
                }
                action={
                  project.liveUrl ? (
                    <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/[.04] text-white hover:bg-white/[.08]">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        {copy.action}
                        <ExternalLink className="size-4" aria-hidden="true" />
                      </a>
                    </Button>
                  ) : undefined
                }
              />
            ))}
            <PaginationControls pathname="/portfolio" page={page} hasNext={hasNext} />
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="border-b border-border bg-surface" aria-labelledby="portfolio-reviews-title">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16">
            <div className="grid gap-6 border-b border-border pb-9 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{copy.reviewsEyebrow}</p>
                <h2 id="portfolio-reviews-title" className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-[-.05em] md:text-5xl">{copy.reviewsTitle}</h2>
              </div>
              <div className="lg:justify-self-end">
                <p className="max-w-xl text-sm leading-7 text-secondary">{copy.reviewsDescription}</p>
                <Link href="/reviews" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  {copy.allReviews}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border">
              {reviews.map((review) => (
                <article key={review.id} className="grid gap-5 py-7 md:grid-cols-[260px_1fr]">
                  <div>
                    <p className="font-display text-lg font-extrabold">{review.clientName}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Star className="size-3 fill-primary" aria-hidden="true" />
                      {copy.verified} · {review.projectTitle}
                    </p>
                  </div>
                  <blockquote className="text-lg leading-8 text-secondary">“{review.comment}”</blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function ProjectRecordVisual({
  project,
  copy,
}: {
  project: PublishedPortfolioProject;
  copy: {
    published: string;
    record: string;
    technology: string;
  };
}) {
  return (
    <PublishedMediaFrame
      chromeLabel={copy.published}
      ariaLabel={`${copy.record}: ${project.title}`}
      className="rounded-[24px] p-4 sm:p-6"
      chromeLabelClassName="rounded-full border border-white/10 px-2.5 py-1 text-[7px]"
    >
      <div className="rounded-[18px] border border-white/10 bg-[#292c2a] p-5 sm:p-7">
        <p className="text-[8px] font-black uppercase tracking-[.15em] text-accent-lime">RRS / {project.category}</p>
        <p className="mt-12 max-w-xl font-display text-3xl font-black uppercase leading-[.92] tracking-[-.05em] sm:text-4xl">{project.title}</p>
        <div className="mt-10 grid grid-cols-[.7fr_1.3fr] gap-3" aria-hidden="true">
          <div className="min-h-24 rounded-[14px] border border-white/10 bg-[#1b1e1c]" />
          <div className="rounded-[14px] border border-[#5f805a] bg-[#30472f] p-4">
            <div className="h-1.5 w-16 bg-accent-lime" />
            <div className="mt-3 h-1.5 w-3/4 bg-white/15" />
            <div className="mt-2 h-1.5 w-1/2 bg-white/10" />
          </div>
        </div>
        <p className="mt-5 text-[8px] font-black uppercase tracking-[.15em] text-white/30">{project.technologies.length} {copy.technology}</p>
      </div>
    </PublishedMediaFrame>
  );
}
