import { describe, expect, it } from "vitest";
import { generatePublicToken, hashPublicToken, tokenMatches } from "@/lib/security/tokens";

describe("public capability tokens", () => {
  it("generates unpredictable URL-safe values and stores only their hash", () => {
    const first = generatePublicToken();
    const second = generatePublicToken();
    expect(first).not.toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(hashPublicToken(first)).toHaveLength(64);
    expect(hashPublicToken(first)).not.toContain(first);
  });

  it("uses a constant-time comparison helper", () => {
    const token = generatePublicToken();
    const hash = hashPublicToken(token);
    expect(tokenMatches(token, hash)).toBe(true);
    expect(tokenMatches(`${token}x`, hash)).toBe(false);
  });
});
