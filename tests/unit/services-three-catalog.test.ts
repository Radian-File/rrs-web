import { describe, expect, it } from "vitest";
import { servicesThreeCatalog } from "@/features/services/services-iii-catalog";

describe("Services III catalog preset", () => {
  it("contains the approved 36 draft service definitions across 12 source families", () => {
    expect(servicesThreeCatalog).toHaveLength(36);
    expect(new Set(servicesThreeCatalog.map((service) => service.sourceCategory)).size).toBe(12);
    expect(new Set(servicesThreeCatalog.map((service) => service.slug)).size).toBe(36);
  });

  it("provides complete draft-only Essential, Advanced, and Premium content for every service", () => {
    for (const service of servicesThreeCatalog) {
      expect(service.levels.map((level) => level.code)).toEqual(["ESSENTIAL", "ADVANCED", "PREMIUM"]);
      expect(service.levels.every((level) => level.summary.length >= 20 && level.indicators.length > 0 && level.escalationSignals.length > 0)).toBe(true);
      expect(service.startingPrice).toBe(service.levels[0].startingPrice);
    }
  });
});
