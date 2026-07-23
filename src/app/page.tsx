import { auth } from "@/auth";
import { StudioHero } from "@/components/home/studio-hero";
import {
  CapabilityMarquee,
  CuratedServices,
  FinalCta,
  HomeFaq,
  OwnerTeaser,
  ProblemsSolved,
  ProcessScene,
  ReviewProof,
  SelectedWork,
  StudioStatement,
  WorkflowProof,
  type HomeProject,
  type HomeReview,
  type HomeService,
} from "@/components/home/home-sections";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeMotionController } from "@/components/motion/home-motion-controller";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [locale, session, serviceRows, projectRows, reviewRows] = await Promise.all([
    getLocale(),
    auth(),
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      take: 4,
      select: { id: true, title: true, slug: true, summary: true, category: true, startingPrice: true, deliveryEstimate: true, technologies: true },
    }),
    prisma.portfolioProject.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
      take: 3,
      select: { id: true, title: true, summary: true, category: true, technologies: true, coverImageUrl: true, liveUrl: true, repositoryUrl: true },
    }),
    prisma.review.findMany({
      where: { status: "PUBLISHED", isPublished: true, project: { status: "COMPLETED" } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, comment: true, overallRating: true, client: { select: { name: true } }, project: { select: { title: true } } },
    }),
  ]);

  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const role = session?.user?.role;
  const primaryHref = role === "OWNER" ? "/owner" : role === "CLIENT" ? "/start-project" : loginUrl("/start-project");
  const primaryLabel = role === "OWNER"
    ? dictionary.portal.ownerWorkspace
    : role === "CLIENT"
      ? (isId ? "Ajukan quotation" : "Request a quotation")
      : (isId ? "Login untuk mengajukan quotation" : "Sign in to request a quotation");

  const services: HomeService[] = serviceRows.map((service) => ({
    ...service,
    estimate: service.startingPrice ? `${formatIdr(service.startingPrice.toString())}+` : (isId ? "Sesuai scope" : "Custom scope"),
  }));
  const projects: HomeProject[] = projectRows;
  const reviews: HomeReview[] = reviewRows.map((review) => ({
    id: review.id,
    comment: review.comment,
    overallRating: review.overallRating,
    clientName: review.client.name,
    projectTitle: review.project.title,
  }));

  return (
    <>
      <SiteHeader />
      <main>
        <HomeMotionController />
        <StudioHero isId={isId} primaryHref={primaryHref} primaryLabel={primaryLabel} />
        <StudioStatement isId={isId} />
        <SelectedWork isId={isId} projects={projects} />
        <ProblemsSolved isId={isId} />
        <CapabilityMarquee isId={isId} />
        <CuratedServices isId={isId} services={services} />
        <ProcessScene isId={isId} />
        <WorkflowProof isId={isId} />
        <ReviewProof isId={isId} reviews={reviews} />
        <OwnerTeaser isId={isId} />
        <HomeFaq isId={isId} />
        <FinalCta isId={isId} primaryHref={primaryHref} primaryLabel={primaryLabel} />
      </main>
      <SiteFooter />
    </>
  );
}
