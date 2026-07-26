import { describe, expect, it } from "vitest";
import { serviceComplexityLevelSchema, serviceSchema } from "@/features/services/schemas";

const input = { title: "Website Bisnis", slug: "website-bisnis", summary: "Website bisnis yang jelas dan profesional.", description: "Layanan untuk membangun website bisnis dengan struktur konten, performa, dan pengalaman pengguna yang terarah.", serviceTypeId: "cmrmjxffa002yucfp5k27kf5d", startingPrice: "5000000", deliveryEstimate: "14–30 hari", revisionGuidance: "Sesuai quotation", deliverables: "Responsive website\nSEO foundation", technologies: "Next.js\nTypeScript", searchAliases: "company profile\nwebsite perusahaan", coverImageUrl: "", isFeatured: "on", isPublished: "on" };

describe("serviceSchema", () => {
  it("transforms editor text and visibility controls into service data", () => {
    const result = serviceSchema.parse(input);
    expect(result.deliverables).toEqual(["Responsive website", "SEO foundation"]);
    expect(result.technologies).toEqual(["Next.js", "TypeScript"]);
    expect(result.startingPrice).toBe(5000000);
    expect(result.catalogKind).toBe("PROJECT");
    expect(result.showInPricingGuide).toBe(false);
    expect(result.isFeatured).toBe(true);
    expect(result.isPublished).toBe(true);
  });

  it("rejects unsafe slugs and negative starting prices", () => {
    expect(serviceSchema.safeParse({ ...input, slug: "Website Bisnis" }).success).toBe(false);
    expect(serviceSchema.safeParse({ ...input, startingPrice: "-1" }).success).toBe(false);
  });

  it("validates a published complexity level without treating it as quotation scope", () => {
    const result = serviceComplexityLevelSchema.parse({
      id: "cmrmjxffa002yucfp5k27kf5d",
      serviceId: "cmrmjxffa002yucfp5k27kf5e",
      code: "ADVANCED",
      title: "Advanced",
      summary: "Untuk kebutuhan bisnis dengan data, workflow, dan integrasi yang berkembang.",
      indicators: "Login dan dashboard\nIntegrasi terarah",
      escalationSignals: "Perlu role lebih kompleks\nPerlu real-time",
      startingPrice: "4000000",
      isPublished: "on",
    });
    expect(result.code).toBe("ADVANCED");
    expect(result.indicators).toEqual(["Login dan dashboard", "Integrasi terarah"]);
    expect(result.startingPrice).toBe(4000000);
    expect(result.isPublished).toBe(true);
  });
});
