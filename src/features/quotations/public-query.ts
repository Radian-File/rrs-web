import { prisma } from "@/lib/db/prisma";
import { hashPublicToken } from "@/lib/security/tokens";

const actionableStatuses = ["SENT", "VIEWED"] as const;

export type QuotationAuthContext = {
  token: string;
  clientEmail: string;
};

export function getQuotationTokenFromCallbackUrl(value?: string) {
  if (!value?.startsWith("/quotation/")) return null;

  const url = new URL(value, "http://rrs.local");
  const match = /^\/quotation\/([^/]+)$/.exec(url.pathname);
  return match?.[1] ?? null;
}

export async function getQuotationAuthContextFromCallbackUrl(value?: string): Promise<QuotationAuthContext | null> {
  const token = getQuotationTokenFromCallbackUrl(value);
  if (!token) return null;

  const quote = await prisma.quotation.findUnique({
    where: { publicTokenHash: hashPublicToken(token) },
    select: {
      clientEmail: true,
      isCurrent: true,
      status: true,
      validUntil: true,
      publicTokenRevokedAt: true,
    },
  });

  if (
    !quote?.clientEmail ||
    !quote.isCurrent ||
    quote.publicTokenRevokedAt ||
    quote.validUntil < new Date() ||
    !actionableStatuses.includes(quote.status as (typeof actionableStatuses)[number])
  ) {
    return null;
  }

  return { token, clientEmail: quote.clientEmail.toLowerCase() };
}

export async function getPublicQuotation(token: string) {
  const hash = hashPublicToken(token);
  const quote = await prisma.quotation.findUnique({
    where: { publicTokenHash: hash },
    include: {
      items: { orderBy: { sequence: "asc" } },
      paymentTerms: { orderBy: { sequence: "asc" } },
      revisionRequests: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!quote || quote.publicTokenRevokedAt || !quote.isCurrent) return null;
  if (quote.validUntil < new Date() && actionableStatuses.includes(quote.status as (typeof actionableStatuses)[number])) {
    return prisma.quotation.update({
      where: { id: quote.id },
      data: {
        status: "EXPIRED",
        activities: { create: { type: "EXPIRED", description: "Quotation validity period ended." } },
      },
      include: {
        items: { orderBy: { sequence: "asc" } },
        paymentTerms: { orderBy: { sequence: "asc" } },
        revisionRequests: { orderBy: { createdAt: "desc" } },
      },
    });
  }
  if (actionableStatuses.includes(quote.status as (typeof actionableStatuses)[number])) {
    return prisma.quotation.update({
      where: { id: quote.id },
      data: {
        status: "VIEWED",
        viewCount: { increment: 1 },
        viewedAt: quote.viewedAt ?? new Date(),
        lastViewedAt: new Date(),
        activities: quote.status === "SENT" ? { create: { type: "VIEWED", description: "Client opened the secure quotation link." } } : undefined,
      },
      include: {
        items: { orderBy: { sequence: "asc" } },
        paymentTerms: { orderBy: { sequence: "asc" } },
        revisionRequests: { orderBy: { createdAt: "desc" } },
      },
    });
  }
  return quote;
}
