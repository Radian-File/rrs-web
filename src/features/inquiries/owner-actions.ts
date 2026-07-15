"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { InquiryStatus } from "@/generated/prisma/enums";
import { inquiryWorkflow } from "@/features/workflow/transitions";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

const updateSchema = z.object({
  inquiryId: z.string().min(1),
  status: z.enum(InquiryStatus),
  notes: z.string().max(5000).optional(),
});
const archiveSchema = z.object({ inquiryId: z.string().min(1) });

export async function updateInquiryAction(formData: FormData) {
  await requireOwner();
  const parsed = updateSchema.parse(Object.fromEntries(formData));
  if (parsed.status === "ARCHIVED") throw new Error("Use the archive control to hide an inquiry from the active list.");
  const current = await prisma.inquiry.findUniqueOrThrow({ where: { id: parsed.inquiryId }, select: { status: true } });
  if (parsed.status !== current.status && !inquiryWorkflow.canTransition(current.status, parsed.status)) {
    throw new Error(`Invalid inquiry transition: ${current.status} → ${parsed.status}`);
  }
  await prisma.inquiry.update({
    where: { id: parsed.inquiryId },
    data: {
      status: parsed.status,
      internalNotes: parsed.notes || null,
      activities: { create: { type: "STATUS_UPDATED", description: `Inquiry status changed from ${current.status} to ${parsed.status}.` } },
    },
  });
  revalidatePath(`/owner/inquiries/${parsed.inquiryId}`);
  revalidatePath("/owner/inquiries");
}

export async function bulkArchiveInquiriesAction(formData: FormData) {
  await requireOwner();
  const mode = String(formData.get("mode") ?? "selected");
  const ids = [...new Set(formData.getAll("recordId").map(String).filter(Boolean))];
  const where = mode === "all" ? { archivedAt: null } : { id: { in: ids }, archivedAt: null };
  const records = await prisma.inquiry.findMany({ where, select: { id: true } });
  const now = new Date();
  await prisma.$transaction([prisma.inquiry.updateMany({ where: { id: { in: records.map((record) => record.id) } }, data: { archivedAt: now } }), prisma.inquiryActivity.createMany({ data: records.map((record) => ({ inquiryId: record.id, type: "ARCHIVED", description: "Inquiry bulk-archived from the active list." })) })]);
  revalidatePath("/owner/inquiries"); revalidatePath("/owner/inquiries/archive");
}

export async function archiveInquiryAction(formData: FormData) {
  await setInquiryArchiveState(formData, true);
}

export async function restoreInquiryAction(formData: FormData) {
  await setInquiryArchiveState(formData, false);
}

async function setInquiryArchiveState(formData: FormData, archive: boolean) {
  await requireOwner();
  const { inquiryId } = archiveSchema.parse(Object.fromEntries(formData));
  await prisma.inquiry.findUniqueOrThrow({ where: { id: inquiryId }, select: { id: true } });
  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      archivedAt: archive ? new Date() : null,
      activities: { create: { type: archive ? "ARCHIVED" : "RESTORED", description: archive ? "Inquiry archived from the active list." : "Inquiry restored to the active list." } },
    },
  });
  revalidatePath("/owner/inquiries");
  revalidatePath("/owner/inquiries/archive");
  revalidatePath(`/owner/inquiries/${inquiryId}`);
}
