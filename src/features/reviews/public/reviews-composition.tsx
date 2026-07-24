import Link from "next/link";
import { BadgeCheck, FileCheck2, Quote, ShieldCheck, Star } from "lucide-react";
import { PublicEmptyState } from "@/components/public/empty-state";
import { Button } from "@/components/ui/button";
import { PaginationControls, pageSize } from "@/components/ui/pagination-controls";

export type PublishedVerifiedReview = {
  id: string;
  comment: string;
  overallRating: number;
  clientName: string;
  projectTitle: string;
};

export function ReviewsComposition({
  reviews,
  page,
  hasNext,
  isId,
}: {
  reviews: PublishedVerifiedReview[];
  page: number;
  hasNext: boolean;
  isId: boolean;
}) {
  const copy = isId
    ? {
        eyebrow: "Ulasan terverifikasi / record published",
        title: "Feedback setelah pekerjaan benar-benar selesai.",
        description:
          "Setiap review terhubung ke Client dan project berstatus selesai, lalu dimoderasi sebelum dipublikasikan.",
        trust: "Trust, bukan testimonial generik.",
        trustDetail: "Project selesai · Client terhubung · Submission dimoderasi",
        fan: "Selected verified voices",
        index: "Indeks ulasan published",
        verified: "Project terverifikasi",
        emptyTitle: page > 1 ? "Tidak ada ulasan pada halaman ini." : "Belum ada ulasan terverifikasi published.",
        emptyDescription: page > 1
          ? "Kembali ke halaman pertama untuk melihat ulasan yang tersedia."
          : "Sambil menunggu proof terverifikasi, standar delivery RRS ditampilkan secara jelas—bukan sebagai testimonial.",
        back: "Kembali ke awal",
        standards: "Standar delivery / bukan testimonial",
        standardsTitle: "Proof muncul setelah workflow selesai.",
        standardsItems: [
          "Scope dan harga didokumentasikan melalui quotation.",
          "Agreement, invoice, pembayaran, dan progress dicatat dalam portal.",
          "Review hanya dapat dikirim setelah delivery disetujui dan project selesai.",
        ],
      }
    : {
        eyebrow: "Verified reviews / published records",
        title: "Feedback after the work was actually completed.",
        description:
          "Every review is linked to a Client and a completed project, then moderated before publication.",
        trust: "Trust, not generic testimonials.",
        trustDetail: "Completed project · Linked Client · Moderated submission",
        fan: "Selected verified voices",
        index: "Published review index",
        verified: "Verified project",
        emptyTitle: page > 1 ? "No reviews on this page." : "No verified reviews are published yet.",
        emptyDescription: page > 1
          ? "Return to the first page to view the available reviews."
          : "Until verified proof exists, RRS delivery standards are shown explicitly—not as testimonials.",
        back: "Return to the beginning",
        standards: "Delivery standards / not testimonials",
        standardsTitle: "Proof appears after the workflow is complete.",
        standardsItems: [
          "Scope and price are documented through a quotation.",
          "Agreement, invoice, payment, and progress are recorded in the portal.",
          "A review can only be submitted after delivery approval and project completion.",
        ],
      };

  const previewReviews = reviews.slice(0, 3);

  return (
    <main>
      <section className="rrs-grain relative isolate overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_82%_24%,rgba(82,164,119,.18),transparent_28%),linear-gradient(180deg,#101211,#181b19)] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-y-0 left-[7%] w-px bg-white/[.045]" />
          <div className="absolute inset-y-0 right-[7%] w-px bg-white/[.045]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.eyebrow}</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,.5fr)] lg:items-end lg:gap-16">
            <div>
              <h1 className="max-w-5xl font-display text-[clamp(3.4rem,6.8vw,7.2rem)] font-black uppercase leading-[.83] tracking-[-.075em] text-[#f5f2ea]">{copy.title}</h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/58 md:text-lg">{copy.description}</p>
            </div>
            <aside className="border-l-2 border-accent-lime bg-white/[.035] p-6">
              <div className="flex items-center gap-2 font-semibold text-accent-lime">
                <BadgeCheck className="size-5" aria-hidden="true" />
                {copy.trust}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/52">{copy.trustDetail}</p>
            </aside>
          </div>
        </div>
      </section>

      {reviews.length === 0 ? (
        <>
          <PublicEmptyState
            titleId="reviews-empty-title"
            icon={Star}
            eyebrow={copy.eyebrow}
            title={copy.emptyTitle}
            description={copy.emptyDescription}
            action={page > 1 ? <Button asChild variant="outline"><Link href="/reviews">{copy.back}</Link></Button> : undefined}
          />
          {page === 1 && <ReviewStandards copy={copy} />}
        </>
      ) : (
        <>
          <section className="border-b border-white/[.06] bg-[#1a1c1b] text-white" aria-labelledby="review-fan-title">
            <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16">
              <p className="text-[9px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.fan}</p>
              <h2 id="review-fan-title" className="sr-only">{copy.fan}</h2>
              <div className="mt-9 grid gap-4 lg:min-h-[390px] lg:place-items-center lg:gap-0" aria-label={copy.fan}>
                {previewReviews.map((review, index) => {
                  const position = previewReviews.length === 1
                    ? "lg:z-20"
                    : previewReviews.length === 2
                      ? index === 0
                        ? "lg:z-10 lg:-translate-x-[22%] lg:translate-y-6 lg:-rotate-[5deg]"
                        : "lg:z-20 lg:translate-x-[22%] lg:-translate-y-2 lg:rotate-[5deg]"
                      : index === 0
                        ? "lg:z-10 lg:-translate-x-[38%] lg:translate-y-12 lg:-rotate-[7deg]"
                        : index === 1
                          ? "lg:z-30 lg:-translate-y-5"
                          : "lg:z-20 lg:translate-x-[38%] lg:translate-y-14 lg:rotate-[7deg]";
                  return (
                    <article
                      key={review.id}
                      className={`group relative min-w-0 rounded-[22px] border border-white/10 bg-[#242724] shadow-[0_24px_70px_rgba(0,0,0,.28)] transition-[transform,border-color] duration-200 hover:border-accent-lime/35 focus-within:z-40 focus-within:border-accent-lime/45 lg:hover:z-40 lg:hover:-translate-y-4 lg:hover:rotate-0 motion-reduce:transition-none motion-reduce:lg:translate-x-0 motion-reduce:lg:translate-y-0 motion-reduce:lg:rotate-0 lg:col-start-1 lg:row-start-1 lg:w-[min(430px,48vw)] ${position}`}
                    >
                      <Link href={`#review-${review.id}`} className="block rounded-[22px] p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus lg:p-7">
                        <Quote className="size-8 text-accent-lime/25" aria-hidden="true" />
                        <blockquote className="mt-6 font-display text-xl font-semibold leading-8 tracking-[-.02em] text-white/82">“{review.comment}”</blockquote>
                        <div className="mt-8 border-t border-white/10 pt-5">
                          <p className="font-display text-lg font-black">{review.clientName}</p>
                          <p className="mt-2 text-xs leading-5 text-white/45">{copy.verified} · {review.projectTitle}</p>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16" aria-labelledby="review-index-title">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{copy.index}</p>
            <h2 id="review-index-title" className="sr-only">{copy.index}</h2>
            <div className="mt-6 border-t border-border">
              {reviews.map((review, index) => (
                <article id={`review-${review.id}`} key={review.id} className="grid scroll-mt-28 gap-6 border-b border-border py-10 lg:grid-cols-[72px_260px_1fr] lg:gap-10">
                  <span className="pt-1 text-xs font-bold text-primary">{String((page - 1) * pageSize + index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold">{review.clientName}</h3>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <BadgeCheck className="size-4" aria-hidden="true" />
                      {copy.verified}
                    </p>
                    <p className="mt-1 text-sm text-secondary">{review.projectTitle}</p>
                    <div className="mt-5 flex items-center gap-1" aria-label={`${review.overallRating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, star) => (
                        <Star key={star} className={`size-4 ${star < review.overallRating ? "fill-primary text-primary" : "text-border"}`} aria-hidden="true" />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-primary">{review.overallRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="relative max-w-3xl">
                    <Quote className="absolute -left-1 -top-2 size-9 text-primary/15" aria-hidden="true" />
                    <blockquote className="pl-8 font-display text-2xl font-semibold leading-9 tracking-[-.02em] text-foreground md:text-3xl md:leading-[1.3]">“{review.comment}”</blockquote>
                  </div>
                </article>
              ))}
            </div>
            <PaginationControls pathname="/reviews" page={page} hasNext={hasNext} />
          </section>
        </>
      )}
    </main>
  );
}

function ReviewStandards({ copy }: { copy: {
  standards: string;
  standardsTitle: string;
  standardsItems: string[];
} }) {
  return (
    <section className="border-y border-border bg-surface" aria-labelledby="review-standards-title">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-[.7fr_1.3fr] lg:px-12 lg:py-28 xl:px-16">
        <div>
          <ShieldCheck className="size-7 text-primary" aria-hidden="true" />
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{copy.standards}</p>
          <h2 id="review-standards-title" className="mt-4 font-display text-4xl font-extrabold tracking-[-.05em]">{copy.standardsTitle}</h2>
        </div>
        <ol className="border-t border-border">
          {copy.standardsItems.map((item, index) => (
            <li key={item} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6">
              <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
              <span className="flex items-start gap-3 text-sm font-semibold leading-7 text-foreground">
                <FileCheck2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
