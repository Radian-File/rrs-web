"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { defaultComplexityLevels, importDefaultServiceCatalog } from "@/features/services/catalog-defaults";
import { importServicesThreeCatalog } from "@/features/services/services-iii-catalog-import";
import { applyCatalogImportRevert, previewCatalogImportRevert, previewLegacyCatalogRevert } from "@/features/services/catalog-import-revert-preview";
import { serviceComplexityLevelSchema, serviceSchema } from "@/features/services/schemas";

export type ServiceActionState = { message?: string; errors?: Record<string, string[]> };

function revalidateServicePaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/start-project");
  revalidatePath("/owner");
  revalidatePath("/owner/services");
  revalidatePath(`/services/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/services/${previousSlug}`);
}

async function validateUniqueSlug(slug: string, serviceId?: string) {
  const existing = await prisma.service.findUnique({ where: { slug }, select: { id: true } });
  return !existing || existing.id === serviceId;
}

export async function createServiceTypeAction(formData: FormData) { await requireOwner(); const name=String(formData.get("name")??"").trim(); const slug=String(formData.get("slug")??"").trim().toLowerCase(); if(!name||!slug) throw new Error("Name and slug are required."); await prisma.serviceType.create({data:{name,slug,icon:String(formData.get("icon")??"globe"),sortOrder:Number(formData.get("sortOrder")??0)}}); revalidatePath("/owner/services/types"); revalidatePath("/owner/services/create"); }

export async function createServiceAction(_state: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireOwner();
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  if (!await validateUniqueSlug(parsed.data.slug)) return { errors: { slug: ["Slug sudah digunakan oleh layanan lain."] } };
  const type = await prisma.serviceType.findFirst({ where: { id: parsed.data.serviceTypeId, isActive: true } });
  if (!type) return { errors: { serviceTypeId: ["Pilih jenis layanan aktif."] } };
  const service = await prisma.service.create({ data: { ...parsed.data, category: type.name, startingPrice: parsed.data.startingPrice ?? null, coverImageUrl: parsed.data.coverImageUrl ?? null, deliveryEstimate: parsed.data.deliveryEstimate ?? null, revisionGuidance: parsed.data.revisionGuidance ?? null, currency: "IDR" } });
  revalidateServicePaths(service.slug);
  redirect(`/owner/services/${service.id}/edit?created=1`);
}

export async function updateServiceAction(_state: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireOwner();
  const id = z.string().cuid().safeParse(formData.get("id"));
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return { message: "Layanan tidak valid." };
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const current = await prisma.service.findUnique({ where: { id: id.data }, select: { id: true, slug: true } });
  if (!current) return { message: "Layanan tidak ditemukan." };
  if (!await validateUniqueSlug(parsed.data.slug, current.id)) return { errors: { slug: ["Slug sudah digunakan oleh layanan lain."] } };
  const type = await prisma.serviceType.findFirst({ where: { id: parsed.data.serviceTypeId, isActive: true } });
  if (!type) return { errors: { serviceTypeId: ["Pilih jenis layanan aktif."] } };
  await prisma.service.update({ where: { id: current.id }, data: { ...parsed.data, category: type.name, startingPrice: parsed.data.startingPrice ?? null, coverImageUrl: parsed.data.coverImageUrl ?? null, deliveryEstimate: parsed.data.deliveryEstimate ?? null, revisionGuidance: parsed.data.revisionGuidance ?? null, currency: "IDR" } });
  revalidateServicePaths(parsed.data.slug, current.slug);
  return { message: parsed.data.isPublished ? "Layanan berhasil diperbarui dan dipublikasikan." : "Draf layanan berhasil disimpan." };
}

export async function importDefaultServiceCatalogAction() {
  await requireOwner();
  const result = await prisma.$transaction((tx) => importDefaultServiceCatalog(tx));
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/start-project");
  revalidatePath("/owner/services");
  redirect(`/owner/services?catalog=imported&run=${result.runId}&types=${result.createdTypes}&services=${result.createdServices}&levels=${result.createdLevels}&skipped=${result.skippedServices}`);
}

export async function importServicesThreeCatalogAction() {
  await requireOwner();
  const result = await prisma.$transaction((tx) => importServicesThreeCatalog(tx));
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/start-project");
  revalidatePath("/owner");
  revalidatePath("/owner/services");
  redirect(`/owner/services?preset=services-three&run=${result.runId}&created=${result.createdServices}&updated=${result.updatedDraftServices}&skipped=${result.skippedProtectedServices}&levelsCreated=${result.createdLevels}&levelsUpdated=${result.updatedDraftLevels}&levelsSkipped=${result.skippedPublishedLevels}`);
}

export async function revertCatalogImportAction(formData: FormData) {
  await requireOwner();
  const source = z.enum(["DEFAULT_CATALOG", "SERVICES_III"]).safeParse(formData.get("source"));
  const runId = z.string().cuid().optional().safeParse(formData.get("runId") || undefined);
  const legacy = formData.get("legacy") === "true";
  if (!source.success || !runId.success) throw new Error("Preview revert tidak valid.");
  if (legacy && formData.get("confirmed") !== "on") throw new Error("Konfirmasi legacy revert diperlukan.");
  await prisma.$transaction(async (tx) => {
    const preview = legacy
      ? await previewLegacyCatalogRevert(tx, source.data)
      : runId.data ? await previewCatalogImportRevert(tx, runId.data) : null;
    if (!preview || preview.source !== source.data) throw new Error("Preview revert tidak ditemukan.");
    await applyCatalogImportRevert(tx, preview);
  });
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/start-project");
  revalidatePath("/owner/services");
  redirect(`/owner/services?reverted=${source.data.toLowerCase()}`);
}

export async function restoreArchivedServiceAction(formData: FormData) {
  await requireOwner();
  const serviceId = z.string().cuid().safeParse(formData.get("serviceId"));
  if (!serviceId.success) throw new Error("Layanan tidak valid.");
  const service = await prisma.service.findUnique({ where: { id: serviceId.data }, select: { id: true, slug: true, archivedAt: true } });
  if (!service?.archivedAt) throw new Error("Layanan tidak berada di arsip.");
  await prisma.service.update({ where: { id: service.id }, data: { archivedAt: null } });
  revalidateServicePaths(service.slug);
  revalidatePath("/owner/services");
}

export async function initializeServiceComplexityLevelsAction(formData: FormData) {
  await requireOwner();
  const serviceId = z.string().cuid().safeParse(formData.get("serviceId"));
  if (!serviceId.success) throw new Error("Layanan tidak valid.");
  const service = await prisma.service.findUnique({ where: { id: serviceId.data }, select: { id: true, slug: true, catalogKind: true } });
  if (!service || service.catalogKind !== "PROJECT") throw new Error("Level hanya tersedia untuk layanan project.");

  await prisma.$transaction(async (tx) => {
    for (const level of defaultComplexityLevels()) {
      await tx.serviceComplexityLevel.upsert({
        where: { serviceId_code: { serviceId: service.id, code: level.code } },
        create: { serviceId: service.id, ...level, currency: "IDR", isPublished: false },
        update: {},
      });
    }
  });
  revalidateServicePaths(service.slug);
  redirect(`/owner/services/${service.id}/edit?levels=initialized`);
}

export async function updateServiceComplexityLevelAction(
  _state: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requireOwner();
  const parsed = serviceComplexityLevelSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const current = await prisma.serviceComplexityLevel.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, serviceId: true, service: { select: { slug: true } } },
  });
  if (!current || current.serviceId !== parsed.data.serviceId) return { message: "Level layanan tidak ditemukan." };
  await prisma.serviceComplexityLevel.update({
    where: { id: current.id },
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary,
      indicators: parsed.data.indicators,
      escalationSignals: parsed.data.escalationSignals,
      startingPrice: parsed.data.startingPrice ?? null,
      isPublished: parsed.data.isPublished,
    },
  });
  revalidateServicePaths(current.service.slug);
  return { message: "Panduan level berhasil diperbarui." };
}
