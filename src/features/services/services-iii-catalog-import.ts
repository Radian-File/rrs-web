import type { Prisma } from "@/generated/prisma/client";
import { servicesThreeCatalog } from "@/features/services/services-iii-catalog";

type CatalogClient = Pick<Prisma.TransactionClient, "service" | "serviceType" | "serviceComplexityLevel">;
type ServiceAction = "CREATE_DRAFT" | "UPDATE_DRAFT" | "SKIP_PROTECTED" | "SKIP_MISSING_TYPE";

export type ServicesThreeImportPreviewItem = {
  sourceCategory: string;
  service: string;
  action: ServiceAction;
  matchedSlug?: string;
  levelsToCreate: number;
  levelsToUpdate: number;
  publishedLevelsProtected: number;
};

export type ServicesThreeImportPreview = {
  createdServices: number;
  updatedDraftServices: number;
  skippedProtectedServices: number;
  skippedMissingTypes: number;
  createdLevels: number;
  updatedDraftLevels: number;
  skippedPublishedLevels: number;
  items: ServicesThreeImportPreviewItem[];
};

export type ServicesThreeImportResult = Omit<ServicesThreeImportPreview, "skippedMissingTypes" | "items">;

const selection = {
  id: true,
  slug: true,
  isPublished: true,
  _count: { select: { inquiries: true, quotations: true, reviews: true } },
} as const;

async function resolveExistingService(db: CatalogClient, slug: string, matchSlugs: string[]) {
  return db.service.findUnique({ where: { slug }, select: selection })
    ?? (matchSlugs.length > 0 ? db.service.findFirst({ where: { slug: { in: matchSlugs } }, select: selection }) : null);
}

function isProtectedService(service: Awaited<ReturnType<typeof resolveExistingService>>) {
  return Boolean(service && (service.isPublished || service._count.inquiries > 0 || service._count.quotations > 0 || service._count.reviews > 0));
}

export async function previewServicesThreeCatalog(db: CatalogClient): Promise<ServicesThreeImportPreview> {
  const preview: ServicesThreeImportPreview = {
    createdServices: 0,
    updatedDraftServices: 0,
    skippedProtectedServices: 0,
    skippedMissingTypes: 0,
    createdLevels: 0,
    updatedDraftLevels: 0,
    skippedPublishedLevels: 0,
    items: [],
  };

  for (const preset of servicesThreeCatalog) {
    const type = await db.serviceType.findUnique({ where: { slug: preset.typeSlug }, select: { id: true } });
    const existing = await resolveExistingService(db, preset.slug, preset.matchSlugs);
    const item: ServicesThreeImportPreviewItem = {
      sourceCategory: preset.sourceCategory,
      service: preset.title,
      action: "CREATE_DRAFT",
      matchedSlug: existing?.slug,
      levelsToCreate: 0,
      levelsToUpdate: 0,
      publishedLevelsProtected: 0,
    };

    if (!type) {
      item.action = "SKIP_MISSING_TYPE";
      preview.skippedMissingTypes += 1;
      preview.items.push(item);
      continue;
    }
    if (isProtectedService(existing)) {
      item.action = "SKIP_PROTECTED";
      preview.skippedProtectedServices += 1;
      preview.items.push(item);
      continue;
    }
    if (existing) {
      item.action = "UPDATE_DRAFT";
      preview.updatedDraftServices += 1;
      const levels = await db.serviceComplexityLevel.findMany({ where: { serviceId: existing.id }, select: { code: true, isPublished: true } });
      for (const level of preset.levels) {
        const current = levels.find((candidate) => candidate.code === level.code);
        if (!current) item.levelsToCreate += 1;
        else if (current.isPublished) item.publishedLevelsProtected += 1;
        else item.levelsToUpdate += 1;
      }
    } else {
      preview.createdServices += 1;
      item.levelsToCreate = preset.levels.length;
    }
    preview.createdLevels += item.levelsToCreate;
    preview.updatedDraftLevels += item.levelsToUpdate;
    preview.skippedPublishedLevels += item.publishedLevelsProtected;
    preview.items.push(item);
  }

  return preview;
}

export async function importServicesThreeCatalog(tx: Prisma.TransactionClient): Promise<ServicesThreeImportResult> {
  const preview = await previewServicesThreeCatalog(tx);

  for (const preset of servicesThreeCatalog) {
    const type = await tx.serviceType.findUnique({ where: { slug: preset.typeSlug }, select: { id: true } });
    if (!type) continue;
    const existing = await resolveExistingService(tx, preset.slug, preset.matchSlugs);
    if (isProtectedService(existing)) continue;

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

    for (const level of preset.levels) {
      const currentLevel = await tx.serviceComplexityLevel.findUnique({
        where: { serviceId_code: { serviceId: service.id, code: level.code } },
        select: { id: true, isPublished: true },
      });
      if (currentLevel?.isPublished) continue;
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
      if (currentLevel) await tx.serviceComplexityLevel.update({ where: { id: currentLevel.id }, data: levelData });
      else await tx.serviceComplexityLevel.create({ data: { serviceId: service.id, code: level.code, ...levelData } });
    }
  }

  return {
    createdServices: preview.createdServices,
    updatedDraftServices: preview.updatedDraftServices,
    skippedProtectedServices: preview.skippedProtectedServices,
    createdLevels: preview.createdLevels,
    updatedDraftLevels: preview.updatedDraftLevels,
    skippedPublishedLevels: preview.skippedPublishedLevels,
  };
}
