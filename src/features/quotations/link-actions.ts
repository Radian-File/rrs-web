"use server";

import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { generatePublicToken, hashPublicToken } from "@/lib/security/tokens";

export async function regenerateQuotationLinkAction(formData: FormData) {
  await requireOwner();
  const quotationId = String(formData.get("quotationId") ?? "");
  const token = generatePublicToken();
  const quote = await prisma.quotation.findUniqueOrThrow({ where: { id: quotationId } });
  if (!quote.isCurrent || quote.status === "DRAFT" || ["ACCEPTED", "CANCELLED"].includes(quote.status)) throw new Error("This quotation cannot receive a new public link.");
  await prisma.quotation.update({ where: { id: quote.id }, data: { publicTokenHash: hashPublicToken(token), publicTokenRevokedAt: null, activities: { create: { type: "LINK_REGENERATED", description: "Secure public link regenerated; the previous link is no longer valid." } } } });
  redirect(`/owner/quotations/${quote.id}?token=${token}`);
}
