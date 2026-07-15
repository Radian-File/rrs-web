import { beforeEach, describe, expect, it } from "vitest";
import {
  consumeRateLimit,
  RateLimitError,
  resetRateLimitsForTests,
} from "@/lib/security/rate-limit";

describe("rate limiter", () => {
  beforeEach(() => resetRateLimitsForTests());

  it("allows requests within the configured window", () => {
    expect(consumeRateLimit("key", 2, 1000, 0).remaining).toBe(1);
    expect(consumeRateLimit("key", 2, 1000, 1).remaining).toBe(0);
  });

  it("blocks requests above the limit and exposes retry timing", () => {
    consumeRateLimit("key", 1, 1000, 0);
    expect(() => consumeRateLimit("key", 1, 1000, 1)).toThrow(
      RateLimitError,
    );
  });

  it("resets after the window", () => {
    consumeRateLimit("key", 1, 1000, 0);
    expect(consumeRateLimit("key", 1, 1000, 1000).remaining).toBe(0);
  });
});
