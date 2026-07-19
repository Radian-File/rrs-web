import { describe, expect, it } from "vitest";
import { safeInternalRedirect } from "@/lib/auth-redirect";

describe("safeInternalRedirect", () => {
  it("keeps safe internal paths", () => {
    expect(safeInternalRedirect("/start-project?service=website-development", "/client")).toBe("/start-project?service=website-development");
  });

  it("rejects external and protocol-relative redirects", () => {
    expect(safeInternalRedirect("https://attacker.example", "/client")).toBe("/client");
    expect(safeInternalRedirect("//attacker.example", "/client")).toBe("/client");
    expect(safeInternalRedirect("/\\attacker.example", "/client")).toBe("/client");
  });
});
