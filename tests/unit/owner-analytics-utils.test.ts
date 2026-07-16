import { describe, expect, it } from "vitest";
import { getAnalyticsDateRange, parseAnalyticsPeriod, percentageOf, remainingInvoiceAmount, sumMoney } from "@/features/analytics/owner-analytics-utils";

describe("owner analytics utilities", () => {
  const now = new Date("2026-07-16T20:20:00.000Z"); // 17 Jul 2026, 03:20 WIB

  it("uses inclusive Asia/Jakarta calendar days for rolling ranges", () => {
    const range = getAnalyticsDateRange("7d", now);

    expect(range.start.toISOString()).toBe("2026-07-10T17:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-07-17T17:00:00.000Z");
    expect(range.comparisonStart?.toISOString()).toBe("2026-07-03T17:00:00.000Z");
    expect(range.comparisonEnd?.toISOString()).toBe("2026-07-10T17:00:00.000Z");
  });

  it("compares year-to-date against the equivalent elapsed prior-year period", () => {
    const range = getAnalyticsDateRange("ytd", now);

    expect(range.start.toISOString()).toBe("2025-12-31T17:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-07-17T17:00:00.000Z");
    expect(range.comparisonStart?.toISOString()).toBe("2024-12-31T17:00:00.000Z");
    expect(range.comparisonEnd?.toISOString()).toBe("2025-07-17T17:00:00.000Z");
  });

  it("falls back safely to the 30-day range for unknown period values", () => {
    expect(parseAnalyticsPeriod("month")).toBe("30d");
    expect(parseAnalyticsPeriod()).toBe("30d");
  });

  it("keeps financial aggregation decimal-safe and never returns negative receivables", () => {
    expect(sumMoney(["1000000.25", "250000.25", null]).toString()).toBe("1250000.5");
    expect(remainingInvoiceAmount("1000000", "400000").toString()).toBe("600000");
    expect(remainingInvoiceAmount("1000000", "1200000").toString()).toBe("0");
  });

  it("does not divide empty funnel stages", () => {
    expect(percentageOf(3, 10)).toBe(30);
    expect(percentageOf(0, 0)).toBeNull();
  });
});
