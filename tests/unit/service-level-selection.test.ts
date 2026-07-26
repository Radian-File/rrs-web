import { describe, expect, it } from "vitest";
import { selectPublishedServiceLevel } from "@/features/services/public/service-level-selection";

const levels = [
  { code: "ESSENTIAL", title: "Essential" },
  { code: "ADVANCED", title: "Advanced" },
  { code: "PREMIUM", title: "Premium" },
];

describe("selectPublishedServiceLevel", () => {
  it("returns the requested published level when the code is valid", () => {
    expect(selectPublishedServiceLevel(levels, "PREMIUM")).toEqual(levels[2]);
  });

  it("falls back to the first published level for an absent or invalid query", () => {
    expect(selectPublishedServiceLevel(levels)).toEqual(levels[0]);
    expect(selectPublishedServiceLevel(levels, "UNTRUSTED")).toEqual(levels[0]);
    expect(selectPublishedServiceLevel([], "PREMIUM")).toBeUndefined();
  });
});
