import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { pageSize, parsePage } from "@/components/ui/pagination-controls";
import { PortfolioComposition } from "@/features/portfolio/public/portfolio-composition";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";
import { safePublishedExternalUrl } from "@/lib/external-url";

export const dynamic = "force-dynamic";
const externalPortfolio = "https://rrs-porto.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Karya Pilihan" : "Selected Work",
    description: isId
      ? "Project published, teknologi, dan ulasan terverifikasi dari workflow RRS Studio."
      : "Published projects, technology, and verified reviews from the RRS Studio workflow.",
  };
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ page: rawPage }, locale] = await Promise.all([searchParams, getLocale()]);
  const page = parsePage(rawPage);
  const isId = locale === "id";

  const [projectRows, reviewRows] = await Promise.all([
    prisma.portfolioProject.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize + 1,
      select: {
        id: true,
        title: true,
        summary: true,
        category: true,
        technologies: true,
        liveUrl: true,
      },
    }),
    prisma.review.findMany({
      where: {
        status: "PUBLISHED",
        isPublished: true,
        project: { status: "COMPLETED" },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        comment: true,
        client: { select: { name: true } },
        project: { select: { title: true } },
      },
    }),
  ]);

  const hasNext = projectRows.length > pageSize;
  const projects = projectRows.slice(0, pageSize).map((project) => ({
    ...project,
    liveUrl: safePublishedExternalUrl(project.liveUrl),
  }));
  const reviews = reviewRows.map((review) => ({
    id: review.id,
    comment: review.comment,
    clientName: review.client.name,
    projectTitle: review.project.title,
  }));

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <PortfolioComposition
          projects={projects}
          reviews={reviews}
          page={page}
          hasNext={hasNext}
          externalPortfolio={externalPortfolio}
          isId={isId}
        />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
