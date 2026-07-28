import type { Metadata } from "next";
import { auth } from "@/auth";
import { StudioHero } from "@/components/home/studio-hero";
import { type HomeReview, type HomeService } from "@/components/home/home-sections";
import { ReferenceClosingStage, ReferenceFaq, ReferenceReviewFan } from "@/components/home/reference-closing-sections";
import { ReferenceFeatureObjects, ReferenceServices } from "@/components/home/reference-sections";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeMotionController } from "@/components/motion/home-motion-controller";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";
export async function generateMetadata():Promise<Metadata>{const isId=(await getLocale())==="id";return{title:{absolute:isId?"RRS Studio — Project Digital dengan Scope yang Jelas":"RRS Studio — Digital Projects with Clear Scope"},description:isId?"Independent digital studio untuk website, aplikasi, dashboard, internal system, API, dan workflow dengan quotation serta delivery yang transparan.":"An independent digital studio for websites, applications, dashboards, internal systems, APIs, and workflows with transparent quotations and delivery."};}

export default async function Home() {
  const [locale, session, serviceRows, reviewRows] = await Promise.all([
    getLocale(),
    auth(),
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        category: true,
        startingPrice: true,
        showInPricingGuide: true,
        deliveryEstimate: true,
        technologies: true,
        complexityLevels: { where: { isPublished: true }, orderBy: { sortOrder: "asc" }, take: 1, select: { startingPrice: true } },
      },
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
    : (isId ? "Mulai brief proyek" : "Start a project brief");
  const primaryDetail = role ? null : (isId
    ? "Buat akun untuk menyimpan brief, menerima quotation, dan mengikuti progres proyek."
    : "Create an account to save your brief, receive a quotation, and follow project progress.");

  const services: HomeService[] = serviceRows.map((service) => {
    const startingEstimate = (service.showInPricingGuide ? service.complexityLevels[0]?.startingPrice : null) ?? service.startingPrice;
    return {
      ...service,
      estimate: startingEstimate ? `${formatIdr(startingEstimate.toString())}+` : (isId ? "Sesuai scope" : "Custom scope"),
    };
  });
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
        <StudioHero isId={isId} primaryHref={primaryHref} primaryLabel={primaryLabel} primaryDetail={primaryDetail} />
        <ReferenceServices isId={isId} services={services} />
        <ReferenceFeatureObjects isId={isId} />
        <ReferenceReviewFan isId={isId} reviews={reviews} />
        <ReferenceFaq isId={isId} />
        <ReferenceClosingStage isId={isId} primaryHref={primaryHref} primaryLabel={primaryLabel} />
      </main>
      <SiteFooter />
    </>
  );
}
