"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireOwner } from "@/lib/authz";
import { normalizeStudioStackSlug, studioStackSchema } from "@/features/studio-stack/schema";

export type StudioStackActionState = {
  message?: string;
  errors?: Record<string, string[]>;
};

function revalidateStackPaths() {
  revalidatePath("/about");
  revalidatePath("/owner/settings");
}

async function slugIsAvailable(slug: string, currentId?: string) {
  const existing = await prisma.studioStackItem.findUnique({ where: { slug }, select: { id: true } });
  return !existing || existing.id === currentId;
}

export async function createStudioStackAction(
  _state: StudioStackActionState,
  formData: FormData,
): Promise<StudioStackActionState> {
  await requireOwner();
  const parsed = studioStackSchema.omit({ id: true }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const slug = normalizeStudioStackSlug(parsed.data.name);
  if (!slug) return { errors: { name: ["Gunakan nama technology yang valid."] } };
  if (!await slugIsAvailable(slug)) return { errors: { name: ["Technology ini sudah ada di public stack."] } };

  await prisma.studioStackItem.create({
    data: {
      name: parsed.data.name,
      slug,
      category: parsed.data.category,
      sortOrder: parsed.data.sortOrder,
      isPublished: false,
    },
  });
  revalidateStackPaths();
  return { message: "Technology ditambahkan sebagai draft." };
}

export async function updateStudioStackAction(
  _state: StudioStackActionState,
  formData: FormData,
): Promise<StudioStackActionState> {
  await requireOwner();
  const parsed = studioStackSchema.required({ id: true }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const current = await prisma.studioStackItem.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
  if (!current) return { message: "Technology tidak ditemukan." };
  const slug = normalizeStudioStackSlug(parsed.data.name);
  if (!slug) return { errors: { name: ["Gunakan nama technology yang valid."] } };
  if (!await slugIsAvailable(slug, current.id)) return { errors: { name: ["Technology ini sudah ada di public stack."] } };

  await prisma.studioStackItem.update({
    where: { id: current.id },
    data: {
      name: parsed.data.name,
      slug,
      category: parsed.data.category,
      sortOrder: parsed.data.sortOrder,
    },
  });
  revalidateStackPaths();
  return { message: "Technology berhasil diperbarui." };
}

export async function setStudioStackPublicationAction(formData: FormData) {
  await requireOwner();
  const parsed = z.object({
    id: z.string().cuid(),
    isPublished: z.enum(["true", "false"]).transform((value) => value === "true"),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const item = await prisma.studioStackItem.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
  if (!item) return;
  await prisma.studioStackItem.update({ where: { id: item.id }, data: { isPublished: parsed.data.isPublished } });
  revalidateStackPaths();
}
