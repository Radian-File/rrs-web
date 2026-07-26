import { describe, expect, it } from "vitest";
import { defaultCatalogServiceSlugs } from "@/features/services/catalog-defaults";

describe("default Services II catalog", () => {
  it("contains the complete draft service inventory without duplicate slugs", () => {
    expect(defaultCatalogServiceSlugs).toHaveLength(64);
    expect(new Set(defaultCatalogServiceSlugs).size).toBe(defaultCatalogServiceSlugs.length);
  });

  it("covers every major Services II family and the separate Micro Task category", () => {
    expect(defaultCatalogServiceSlugs).toEqual(expect.arrayContaining([
      "website-development",
      "learning-management-system",
      "android-development",
      "android-marketplace-application",
      "desktop-application",
      "clinic-management-application",
      "ui-design",
      "backend-development",
      "technical-documentation",
      "micro-task-quick-fix",
    ]));
  });
});
