import { describe, expect, it } from "vitest";
import { createWhatsAppUrl, formatWhatsAppNumber, normalizeWhatsAppNumber } from "@/lib/whatsapp";

describe("WhatsApp utilities", () => {
  it("normalizes Indonesian local numbers and constructs an encoded direct-chat URL", () => {
    expect(normalizeWhatsAppNumber("0812-9524-8513")).toBe("6281295248513");
    expect(formatWhatsAppNumber("6281295248513")).toBe("+62 812 9524 8513");
    expect(createWhatsAppUrl("0812-9524-8513", "Halo RRS")).toBe("https://wa.me/6281295248513?text=Halo+RRS");
  });
});
