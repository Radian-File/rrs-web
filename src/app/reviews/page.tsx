import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { pageSize, parsePage } from "@/components/ui/pagination-controls";
import { ReviewsComposition } from "@/features/reviews/public/reviews-composition";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Ulasan Terverifikasi" : "Verified Reviews",
    description: isId
      ? "Feedback published dari Client setelah project selesai dan melalui moderasi."
      : "Published Client feedback from completed projects after moderation.",
  };
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ page: rawPage }, locale] = await Promise.all([searchParams, getLocale()]);
  const page = parsePage(rawPage);
  const isId = locale === "id";
  const rows = await prisma.review.findMany({
    where: {
      status: "PUBLISHED",
      isPublished: true,
      project: { status: "COMPLETED" },
    },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: {
      id: true,
      comment: true,
      overallRating: true,
      client: { select: { name: true } },
      project: { select: { title: true } },
    },
  });
  const hasNext = rows.length > pageSize;
  const reviews = rows.slice(0, pageSize).map((review) => ({
    id: review.id,
    comment: review.comment,
    overallRating: review.overallRating,
    clientName: review.client.name,
    projectTitle: review.project.title,
  }));

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <ReviewsComposition reviews={reviews} page={page} hasNext={hasNext} isId={isId} />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
