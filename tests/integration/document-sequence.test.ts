import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { allocateDocumentNumber } from "@/features/documents/sequence";

describe("document sequence", () => {
  it("allocates unique numbers across concurrent transactions", async () => {
    const date = new Date("2099-07-15T00:00:00+07:00");
    const numbers = await Promise.all(
      Array.from({ length: 8 }, () =>
        prisma.$transaction((tx) => allocateDocumentNumber(tx, "INQUIRY", date)),
      ),
    );

    expect(new Set(numbers).size).toBe(numbers.length);
    expect(numbers.every((number) => number.startsWith("INQ-2099-"))).toBe(true);
  });
});
