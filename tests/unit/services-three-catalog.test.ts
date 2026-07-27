import { describe, expect, it } from "vitest";
import { servicesThreeCatalog } from "@/features/services/services-iii-catalog";

describe("Services III catalog preset", () => {
  it("contains the approved 36 draft service definitions across 12 source families", () => {
    expect(servicesThreeCatalog).toHaveLength(36);
    expect(new Set(servicesThreeCatalog.map((service) => service.sourceCategory)).size).toBe(12);
    expect(new Set(servicesThreeCatalog.map((service) => service.slug)).size).toBe(36);
  });

  it("uses service-specific Level language instead of one generic endpoint/module template", () => {
    const companyProfile = servicesThreeCatalog.find((service) => service.title === "Company Profile Website");
    const restApi = servicesThreeCatalog.find((service) => service.title === "REST API Development");
    const booking = servicesThreeCatalog.find((service) => service.title === "Booking & Reservation Website");
    expect(companyProfile?.levels[0].summary).toMatch(/profil bisnis, layanan, dan jalur kontak/i);
    expect(companyProfile?.levels.flatMap((level) => level.indicators).join(" ")).not.toMatch(/endpoint|hardware/i);
    expect(restApi?.levels[1].summary).toMatch(/resource, autentikasi, dan integrasi API/i);
    expect(booking?.levels[1].summary).toMatch(/availability dinamis, notifikasi, dan dashboard booking/i);
  });

  it("provides complete draft-only Essential, Advanced, and Premium content for every service", () => {    for (const service of servicesThreeCatalog) {
      expect(service.levels.map((level) => level.code)).toEqual(["ESSENTIAL", "ADVANCED", "PREMIUM"]);
      expect(service.levels.every((level) => level.summary.length >= 20 && level.indicators.length > 0 && level.escalationSignals.length > 0)).toBe(true);
      expect(service.startingPrice).toBe(service.levels[0].startingPrice);
    }
  });
});
