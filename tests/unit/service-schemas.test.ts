import { describe, expect, it } from "vitest";
import { serviceSchema } from "@/features/services/schemas";

const input = { title: "Website Bisnis", slug: "website-bisnis", summary: "Website bisnis yang jelas dan profesional.", description: "Layanan untuk membangun website bisnis dengan struktur konten, performa, dan pengalaman pengguna yang terarah.", serviceTypeId: "cmrmjxffa002yucfp5k27kf5d", startingPrice: "5000000", deliveryEstimate: "14–30 hari", revisionGuidance: "Sesuai quotation", deliverables: "Responsive website\nSEO foundation", technologies: "Next.js\nTypeScript", coverImageUrl: "", isFeatured: "on", isPublished: "on" };

describe("serviceSchema", () => {
  it("transforms editor text and visibility controls into service data", () => {
    const result = serviceSchema.parse(input);
    expect(result.deliverables).toEqual(["Responsive website", "SEO foundation"]);
    expect(result.technologies).toEqual(["Next.js", "TypeScript"]);
    expect(result.startingPrice).toBe(5000000);
    expect(result.isFeatured).toBe(true);
    expect(result.isPublished).toBe(true);
  });

  it("rejects unsafe slugs and negative starting prices", () => {
    expect(serviceSchema.safeParse({ ...input, slug: "Website Bisnis" }).success).toBe(false);
    expect(serviceSchema.safeParse({ ...input, startingPrice: "-1" }).success).toBe(false);
  });
});
