import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";

export type DocumentType = "INQUIRY" | "QUOTATION" | "PROJECT" | "AGREEMENT" | "INVOICE";

const prefixes: Record<DocumentType, string> = {
  INQUIRY: "INQ",
  QUOTATION: "QT",
  PROJECT: "PRJ",
  AGREEMENT: "AGR",
  INVOICE: "INV",
};

export function jakartaYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Jakarta" }).format(date));
}

export async function allocateDocumentNumber(
  tx: Prisma.TransactionClient,
  type: DocumentType,
  date = new Date(),
) {
  const year = jakartaYear(date);
  const [sequence] = await tx.$queryRaw<Array<{ lastValue: number }>>`
    INSERT INTO "DocumentSequence" (
      "id", "type", "year", "lastValue", "createdAt", "updatedAt"
    )
    VALUES (${randomUUID()}, ${type}, ${year}, 1, NOW(), NOW())
    ON CONFLICT ("type", "year")
    DO UPDATE SET
      "lastValue" = "DocumentSequence"."lastValue" + 1,
      "updatedAt" = NOW()
    RETURNING "lastValue"
  `;

  return `${prefixes[type]}-${year}-${String(sequence.lastValue).padStart(4, "0")}`;
}
