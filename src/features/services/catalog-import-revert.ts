import type { Prisma } from "@/generated/prisma/client";

const serviceSnapshotSelect = {
  title: true,
  slug: true,
  summary: true,
  description: true,
  category: true,
  serviceTypeId: true,
  catalogKind: true,
  showInPricingGuide: true,
  startingPrice: true,
  currency: true,
  deliveryEstimate: true,
  revisionGuidance: true,
  deliverables: true,
  technologies: true,
  searchAliases: true,
  coverImageUrl: true,
  isFeatured: true,
  isPublished: true,
  archivedAt: true,
  complexityLevels: {
    select: {
      code: true,
      title: true,
      summary: true,
      indicators: true,
      escalationSignals: true,
      startingPrice: true,
      currency: true,
      sortOrder: true,
      isPublished: true,
    },
  },
} as const;

type ServiceSnapshot = Prisma.ServiceGetPayload<{ select: typeof serviceSnapshotSelect }>;

export function snapshotForImport(service: ServiceSnapshot) {
  return JSON.parse(JSON.stringify(service)) as Prisma.InputJsonValue;
}

export function parseImportSnapshot(snapshot: Prisma.JsonValue | null): ServiceSnapshot | null {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return null;
  return snapshot as unknown as ServiceSnapshot;
}

export async function isProtectedForCatalogRevert(tx: Prisma.TransactionClient, serviceId: string) {
  const service = await tx.service.findUnique({
    where: { id: serviceId },
    select: { isPublished: true, _count: { select: { inquiries: true, quotations: true, reviews: true } } },
  });
  return !service || service.isPublished || service._count.inquiries > 0 || service._count.quotations > 0 || service._count.reviews > 0;
}

export async function restoreImportSnapshot(tx: Prisma.TransactionClient, serviceId: string, snapshot: ServiceSnapshot) {
  await tx.service.update({
    where: { id: serviceId },
    data: {
      title: snapshot.title,
      slug: snapshot.slug,
      summary: snapshot.summary,
      description: snapshot.description,
      category: snapshot.category,
      serviceTypeId: snapshot.serviceTypeId,
      catalogKind: snapshot.catalogKind,
      showInPricingGuide: snapshot.showInPricingGuide,
      startingPrice: snapshot.startingPrice,
      currency: snapshot.currency,
      deliveryEstimate: snapshot.deliveryEstimate,
      revisionGuidance: snapshot.revisionGuidance,
      deliverables: snapshot.deliverables,
      technologies: snapshot.technologies,
      searchAliases: snapshot.searchAliases,
      coverImageUrl: snapshot.coverImageUrl,
      isFeatured: snapshot.isFeatured,
      isPublished: snapshot.isPublished,
      archivedAt: snapshot.archivedAt,
    },
  });
  for (const level of snapshot.complexityLevels) {
    await tx.serviceComplexityLevel.upsert({
      where: { serviceId_code: { serviceId, code: level.code } },
      create: { serviceId, ...level },
      update: level,
    });
  }
}

export { serviceSnapshotSelect };
