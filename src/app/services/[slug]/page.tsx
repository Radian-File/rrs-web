import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { ServiceDetailComposition } from "@/features/services/public/service-detail-composition";
import { selectPublishedServiceLevel } from "@/features/services/public/service-level-selection";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findFirst({ where: { slug, isPublished: true }, select: { title: true, summary: true } });
  return service ? { title: service.title, description: service.summary } : { title: "Service not found", robots: { index: false, follow: false } };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const [{ slug }, { level: requestedLevel }, locale, session] = await Promise.all([params, searchParams, getLocale(), auth()]);
  const service = await prisma.service.findFirst({
    where: { slug, isPublished: true },
    include: {
      complexityLevels: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: { code: true, title: true, summary: true, indicators: true, escalationSignals: true, startingPrice: true },
      },
    },
  });
  if (!service) notFound();

  const isId = locale === "id";
  const role = session?.user?.role;
  const quotationHref = role === "CLIENT" ? `/start-project?service=${service.slug}` : role === "OWNER" ? "/owner" : loginUrl(`/start-project?service=${service.slug}`);
  const quotationLabel = role === "CLIENT" ? (isId ? "Mulai mengajukan quotation" : "Start a quotation request") : role === "OWNER" ? (isId ? "Buka Owner Workspace" : "Open Owner Workspace") : (isId ? "Login untuk mengajukan quotation" : "Sign in to request a quotation");
  const publishedGuideLevels = service.showInPricingGuide ? service.complexityLevels : [];
  const initialLevel = selectPublishedServiceLevel(publishedGuideLevels, requestedLevel);
  const startingEstimate = initialLevel?.startingPrice ?? ((service.showInPricingGuide ? publishedGuideLevels[0]?.startingPrice : null) ?? service.startingPrice);
  const estimate = startingEstimate ? `${formatIdr(startingEstimate.toString())}+` : (isId ? "Sesuai scope" : "Custom scope");
  const levels = publishedGuideLevels.map((item) => ({
    code: item.code,
    title: item.title,
    summary: item.summary,
    indicators: item.indicators,
    escalationSignals: item.escalationSignals,
    estimate: item.startingPrice ? `${formatIdr(item.startingPrice.toString())}+` : null,
  }));

  return <><SiteHeader /><PageEntrance><ServiceDetailComposition service={service} estimate={estimate} quotationHref={quotationHref} quotationLabel={quotationLabel} role={role === "OWNER" || role === "CLIENT" ? role : undefined} levels={levels} initialLevelCode={initialLevel?.code} isId={isId} /></PageEntrance><SiteFooter /></>;
}
