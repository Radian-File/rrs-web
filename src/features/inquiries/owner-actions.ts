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

export async function updateInquiryAction(formData: FormData) {
  await requireOwner();
  const parsed = updateSchema.parse(Object.fromEntries(formData));
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
