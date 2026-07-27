import type { Prisma } from "@/generated/prisma/client";
import { servicesThreeCatalog } from "@/features/services/services-iii-catalog";

export type ServicesThreeImportResult = {
  createdServices: number;
  updatedDraftServices: number;
  skippedProtectedServices: number;
  createdLevels: number;
  updatedDraftLevels: number;
  skippedPublishedLevels: number;
};

export async function importServicesThreeCatalog(tx: Prisma.TransactionClient): Promise<ServicesThreeImportResult> {
  const result: ServicesThreeImportResult = {
    createdServices: 0,
    updatedDraftServices: 0,
    skippedProtectedServices: 0,
    createdLevels: 0,
    updatedDraftLevels: 0,
    skippedPublishedLevels: 0,
  };

  for (const preset of servicesThreeCatalog) {
    const type = await tx.serviceType.findUnique({ where: { slug: preset.typeSlug }, select: { id: true } });
    if (!type) throw new Error(`Jenis layanan preset tidak ditemukan: ${preset.typeSlug}`);

    const selection = {
      id: true,
      isPublished: true,
      _count: { select: { inquiries: true, quotations: true, reviews: true } },
    } as const;
    const existing = await tx.service.findUnique({ where: { slug: preset.slug }, select: selection })
      ?? (preset.matchSlugs.length > 0 ? await tx.service.findFirst({ where: { slug: { in: preset.matchSlugs } }, select: selection }) : null);
    const protectedRecord = existing && (existing.isPublished || existing._count.inquiries > 0 || existing._count.quotations > 0 || existing._count.reviews > 0);
    if (protectedRecord) {
      result.skippedProtectedServices += 1;
      continue;
    }

    const data = {
      title: preset.title,
      slug: preset.slug,
      summary: preset.summary,
      description: preset.description,
      category: preset.category,
      serviceTypeId: type.id,
      catalogKind: "PROJECT" as const,
      showInPricingGuide: false,
      startingPrice: preset.startingPrice,
      currency: "IDR",
      deliveryEstimate: preset.deliveryEstimate,
      revisionGuidance: preset.revisionGuidance,
      deliverables: preset.deliverables,
      technologies: preset.technologies,
      searchAliases: preset.searchAliases,
      isFeatured: false,
      isPublished: false,
    };
    const service = existing
      ? await tx.service.update({ where: { id: existing.id }, data, select: { id: true } })
      : await tx.service.create({ data, select: { id: true } });
    if (existing) result.updatedDraftServices += 1;
    else result.createdServices += 1;

    for (const level of preset.levels) {
      const currentLevel = await tx.serviceComplexityLevel.findUnique({
        where: { serviceId_code: { serviceId: service.id, code: level.code } },
        select: { id: true, isPublished: true },
      });
      if (currentLevel?.isPublished) {
        result.skippedPublishedLevels += 1;
        continue;
      }
      const levelData = {
        title: level.title,
        summary: level.summary,
        indicators: level.indicators,
        escalationSignals: level.escalationSignals,
        startingPrice: level.startingPrice,
        currency: "IDR",
        sortOrder: level.sortOrder,
        isPublished: false,
      };
      if (currentLevel) {
        await tx.serviceComplexityLevel.update({ where: { id: currentLevel.id }, data: levelData });
        result.updatedDraftLevels += 1;
      } else {
        await tx.serviceComplexityLevel.create({ data: { serviceId: service.id, code: level.code, ...levelData } });
        result.createdLevels += 1;
      }
    }
  }

  return result;
}
