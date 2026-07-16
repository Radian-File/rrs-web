"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { serviceSchema } from "@/features/services/schemas";

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
