import { describe, expect, it } from "vitest";
import {
  normalizeStudioStackSlug,
  studioStackCategories,
  studioStackSchema,
} from "@/features/studio-stack/schema";

describe("studio stack schema", () => {
  it("accepts a freeform technology in each fixed category", () => {
    for (const category of studioStackCategories) {
      expect(studioStackSchema.safeParse({ name: "Next.js", category, sortOrder: "10" }).success).toBe(true);
    }
  });

  it("normalizes a stable duplicate-detection slug", () => {
    expect(normalizeStudioStackSlug("  Node.js / TypeScript  ")).toBe("node-js-typescript");
    expect(normalizeStudioStackSlug("Café Stack")).toBe("cafe-stack");
  });

  it("rejects unknown categories and invalid ordering", () => {
    expect(studioStackSchema.safeParse({ name: "Next.js", category: "DESIGN", sortOrder: 0 }).success).toBe(false);
    expect(studioStackSchema.safeParse({ name: "Next.js", category: "FRONTEND", sortOrder: -1 }).success).toBe(false);
  });
});
