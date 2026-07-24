import { describe, expect, it } from "vitest";
import { safePublishedExternalUrl } from "@/lib/external-url";

describe("safePublishedExternalUrl", () => {
  it("keeps valid HTTPS destinations", () => {
    expect(safePublishedExternalUrl("https://example.com/project?a=1")).toBe(
      "https://example.com/project?a=1",
    );
  });

  it.each([
    "http://example.com/project",
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "/relative-path",
    "not a url",
  ])("rejects a non-publishable destination: %s", (value) => {
    expect(safePublishedExternalUrl(value)).toBeNull();
  });

  it("rejects missing values", () => {
    expect(safePublishedExternalUrl(null)).toBeNull();
    expect(safePublishedExternalUrl(undefined)).toBeNull();
  });
});
