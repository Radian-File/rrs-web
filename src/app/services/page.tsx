import type { Metadata } from "next";
import { PageEntrance } from "@/components/page-entrance";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ServicesCapabilityHero } from "@/features/services/public/capability-hero";
import { ServicesDiscoveryCommand } from "@/features/services/public/discovery-command";
import { ServiceEditorialIndex } from "@/features/services/public/service-editorial-index";
import { ServiceProductStage } from "@/features/services/public/service-product-stage";
import { ServicesEmptyState } from "@/features/services/public/services-empty-state";
import type { ServiceDiscoveryItem } from "@/features/services/public/types";
import { scoreServiceSearch } from "@/features/services/search";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Layanan Digital" : "Digital Services",
    description: isId
      ? "Jelajahi layanan website, aplikasi, dashboard, internal system, API, dan workflow automation dengan scope serta quotation yang jelas."
      : "Explore website, application, dashboard, internal-system, API, and workflow-automation services with clear scope and quotations.",
  };
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const [{ q: rawQuery, type: rawType }, locale, types] = await Promise.all([
    searchParams,
    getLocale(),
    prisma.serviceType.findMany({
      where: { isActive: true },
      include: { _count: { select: { services: { where: { isPublished: true } } } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const q = rawQuery?.trim() ?? "";
  const type = rawType && types.some((item) => item.slug === rawType) ? rawType : undefined;
  const candidates = await prisma.service.findMany({
    where: {
      isPublished: true,
      ...(type ? { serviceType: { slug: type, isActive: true } } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
  });

  const services = q
    ? candidates
        .map((service) => ({
          service,
          score: scoreServiceSearch(
            {
              ...service,
              searchAliases: (service as { searchAliases?: string[] }).searchAliases ?? [],
            },
            q,
          ),
        }))
        .filter((item) => item.score > 0)
        .sort(
          (a, b) =>
            b.score - a.score ||
            Number(b.service.isFeatured) - Number(a.service.isFeatured) ||
            a.service.title.localeCompare(b.service.title),
        )
        .map((item) => item.service)
    : candidates;

  const typeOptions = types.map((item) => ({
    slug: item.slug,
    name: item.name,
    count: item._count.services,
  }));
  const activeTypeName = type ? types.find((item) => item.slug === type)?.name : undefined;
  const activeLabel = type
    ? `${activeTypeName}${q ? ` · “${q}”` : ""}`
    : q
      ? `“${q}”`
      : null;
  const discoveryServices: ServiceDiscoveryItem[] = services.map((service) => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    category: service.category,
    deliveryEstimate: service.deliveryEstimate,
    deliverables: service.deliverables,
    technologies: service.technologies,
    estimate: service.startingPrice
      ? `${formatIdr(service.startingPrice.toString())}+`
      : (isId ? "Sesuai scope" : "Custom scope"),
  }));
  const primaryService = discoveryServices[0];
  const remainingServices = discoveryServices.slice(1);

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <main>
          <ServicesCapabilityHero isId={isId} types={typeOptions} />
          <ServicesDiscoveryCommand
            isId={isId}
            types={typeOptions}
            type={type}
            query={q}
            resultCount={discoveryServices.length}
            resultsLabel={dictionary.common.results}
            activeLabel={activeLabel}
            clearLabel={dictionary.common.clearFilters}
          />

          {primaryService ? (
            <>
              <ServiceProductStage service={primaryService} isId={isId} />
              {remainingServices.length > 0 && <ServiceEditorialIndex services={remainingServices} isId={isId} />}
            </>
          ) : (
            <ServicesEmptyState
              isId={isId}
              hasFilters={Boolean(q || type)}
              activeLabel={activeLabel}
              clearLabel={dictionary.common.clearFilters}
            />
          )}

        </main>
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
