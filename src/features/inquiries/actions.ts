"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { allocateDocumentNumber } from "@/features/documents/sequence";
import { projectBriefSchema } from "@/features/inquiries/schemas";
import { removePrivateFile, storePrivateFile, type StoredFile } from "@/lib/storage/local";
import { assertRequestRateLimit } from "@/lib/security/rate-limit";

export type BriefActionState = { message?: string; errors?: Record<string, string[]> };

const lines = (value?: string) => value?.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean) ?? [];
const bool = (value?: string) => value === "yes" ? true : value === "no" ? false : null;

export async function submitProjectBrief(
  _state: BriefActionState,
  formData: FormData,
): Promise<BriefActionState> {
  await assertRequestRateLimit("project-brief", 5, 15 * 60 * 1000, String(formData.get("clientEmail") ?? "anonymous"));
  const parsed = projectBriefSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, message: "Please review the highlighted fields." };

  const attachment = formData.get("attachment");
  let stored: StoredFile | undefined;
  try {
    if (attachment instanceof File && attachment.size > 0) stored = await storePrivateFile(attachment, "inquiries");

    const inquiry = await prisma.$transaction(async (tx) => {
      const service = parsed.data.serviceSlug ? await tx.service.findUnique({ where: { slug: parsed.data.serviceSlug }, select: { id: true } }) : null;
      const inquiryNumber = await allocateDocumentNumber(tx, "INQUIRY");
      return tx.inquiry.create({
        data: {
          inquiryNumber,
          selectedServiceId: service?.id,
          clientName: parsed.data.clientName,
          clientPhone: parsed.data.clientPhone,
          clientEmail: parsed.data.clientEmail,
          companyName: parsed.data.companyName,
          projectTitle: parsed.data.projectTitle,
          projectType: parsed.data.projectType,
          projectDescription: parsed.data.projectDescription,
          projectGoals: parsed.data.projectGoals,
          targetUsers: parsed.data.targetUsers,
          requiredFeatures: lines(parsed.data.requiredFeatures),
          referenceLinks: lines(parsed.data.referenceLinks),
          budgetRange: parsed.data.budgetRange,
          expectedDeadline: parsed.data.expectedDeadline ? new Date(`${parsed.data.expectedDeadline}T12:00:00+07:00`) : null,
          hasDesign: parsed.data.hasDesign === "partial" ? null : bool(parsed.data.hasDesign),
          hasDomain: bool(parsed.data.hasDomain),
          hasHosting: bool(parsed.data.hasHosting),
          needsMaintenance: bool(parsed.data.needsMaintenance),
          isRedesign: parsed.data.projectMode === "redesign",
          status: "SUBMITTED",
          source: "WEBSITE_TO_WHATSAPP",
          activities: { create: { type: "SUBMITTED", description: "Project brief submitted through the public website." } },
          ...(stored ? { files: { create: { type: "BRIEF_ATTACHMENT", ...stored } } } : {}),
        },
      });
    });
    redirect(`/brief-submitted?id=${inquiry.id}`);
  } catch (error) {
    if (stored) await removePrivateFile(stored.storageKey);
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { message: error instanceof Error ? error.message : "Unable to submit the project brief." };
  }
}
