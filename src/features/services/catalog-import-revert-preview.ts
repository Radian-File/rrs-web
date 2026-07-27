import type { CatalogImportSource, Prisma } from "@/generated/prisma/client";
import { defaultCatalogServiceSlugs } from "@/features/services/catalog-defaults";
import { parseImportSnapshot, restoreImportSnapshot, isProtectedForCatalogRevert } from "@/features/services/catalog-import-revert";
import { servicesThreeCatalog } from "@/features/services/services-iii-catalog";

type CatalogClient = Pick<Prisma.TransactionClient, "catalogImportRun" | "catalogImportEntry" | "service" | "serviceComplexityLevel">;
export type RevertAction = "ARCHIVE_CREATED" | "RESTORE_UPDATED" | "SKIP_PROTECTED" | "SKIP_CHANGED" | "SKIP_NO_SNAPSHOT";

export type CatalogRevertPreviewItem = {
  entryId?: string;
  serviceId: string;
  service: string;
  action: RevertAction;
  reason?: string;
};

export type CatalogRevertPreview = {
  source: CatalogImportSource;
  runId?: string;
  legacy: boolean;
  items: CatalogRevertPreviewItem[];
};

const serviceSelect = {
  id: true,
  title: true,
  slug: true,
  isPublished: true,
  archivedAt: true,
  updatedAt: true,
  complexityLevels: { select: { isPublished: true } },
  _count: { select: { inquiries: true, quotations: true, reviews: true } },
} as const;

function protectedOrArchived(service: Prisma.ServiceGetPayload<{ select: typeof serviceSelect }>) {
  return service.archivedAt || service.isPublished || service._count.inquiries > 0 || service._count.quotations > 0 || service._count.reviews > 0;
}

export async function previewCatalogImportRevert(db: CatalogClient, runId: string): Promise<CatalogRevertPreview | null> {
  const run = await db.catalogImportRun.findUnique({
    where: { id: runId },
    include: { entries: { where: { revertedAt: null }, include: { service: { select: serviceSelect } } } },
  });
  if (!run) return null;
  const items: CatalogRevertPreviewItem[] = run.entries.map((entry) => {
    const service = entry.service;
    if (protectedOrArchived(service)) return { entryId: entry.id, serviceId: service.id, service: service.title, action: "SKIP_PROTECTED", reason: "Published, archived, atau memiliki relasi historis." };
    if (entry.operation === "CREATED") return { entryId: entry.id, serviceId: service.id, service: service.title, action: "ARCHIVE_CREATED" };
    const snapshot = parseImportSnapshot(entry.snapshot);
    if (!snapshot) return { entryId: entry.id, serviceId: service.id, service: service.title, action: "SKIP_NO_SNAPSHOT", reason: "Import lama tidak memiliki snapshot sebelum update." };
    if (service.updatedAt > entry.appliedAt || service.complexityLevels.some((level) => level.isPublished)) return { entryId: entry.id, serviceId: service.id, service: service.title, action: "SKIP_CHANGED", reason: "Service berubah setelah import atau memiliki level published." };
    return { entryId: entry.id, serviceId: service.id, service: service.title, action: "RESTORE_UPDATED" };
  });
  return { source: run.source, runId: run.id, legacy: false, items };
}

function legacySlugs(source: CatalogImportSource) {
  return source === "DEFAULT_CATALOG"
    ? defaultCatalogServiceSlugs
    : [...new Set(servicesThreeCatalog.flatMap((service) => [service.slug, ...service.matchSlugs]))];
}

export async function previewLegacyCatalogRevert(db: CatalogClient, source: CatalogImportSource): Promise<CatalogRevertPreview> {
  const slugs = legacySlugs(source);
  const services = await db.service.findMany({ where: { slug: { in: slugs }, archivedAt: null }, select: serviceSelect });
  const tracked = await db.catalogImportEntry.findMany({ where: { serviceId: { in: services.map((service) => service.id) } }, select: { serviceId: true } });
  const trackedIds = new Set(tracked.map((entry) => entry.serviceId));
  const items = services.map((service) => {
    if (trackedIds.has(service.id)) return { serviceId: service.id, service: service.title, action: "SKIP_CHANGED" as const, reason: "Memiliki provenance import baru; gunakan revert run tercatat." };
    if (protectedOrArchived(service)) return { serviceId: service.id, service: service.title, action: "SKIP_PROTECTED" as const, reason: "Published atau memiliki relasi historis." };
    return { serviceId: service.id, service: service.title, action: "ARCHIVE_CREATED" as const };
  });
  return { source, legacy: true, items };
}

export async function applyCatalogImportRevert(tx: Prisma.TransactionClient, preview: CatalogRevertPreview) {
  const result = { archived: 0, restored: 0 };
  const now = new Date();
  for (const item of preview.items) {
    if (item.action === "ARCHIVE_CREATED") {
      if (await isProtectedForCatalogRevert(tx, item.serviceId)) continue;
      await tx.service.update({ where: { id: item.serviceId }, data: { archivedAt: now } });
      result.archived += 1;
    }
    if (item.action === "RESTORE_UPDATED" && item.entryId) {
      if (await isProtectedForCatalogRevert(tx, item.serviceId)) continue;
      const entry = await tx.catalogImportEntry.findUnique({ where: { id: item.entryId }, select: { snapshot: true } });
      const snapshot = parseImportSnapshot(entry?.snapshot ?? null);
      if (!snapshot) continue;
      await restoreImportSnapshot(tx, item.serviceId, snapshot);
      await tx.catalogImportEntry.update({ where: { id: item.entryId }, data: { revertedAt: now } });
      result.restored += 1;
    }
  }
  if (preview.runId) await tx.catalogImportRun.update({ where: { id: preview.runId }, data: { revertedAt: now } });
  return result;
}
