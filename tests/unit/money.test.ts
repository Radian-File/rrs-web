import { describe, expect, it } from "vitest";
import { calculateQuotationTotals, toMidtransAmount } from "@/lib/money";

describe("calculateQuotationTotals", () => {
  it("calculates item totals with decimal precision", () => {
    const totals = calculateQuotationTotals(
      [
        { quantity: 1, unitPrice: 1_500_000 },
        { quantity: 2, unitPrice: 1_250_000 },
      ],
      500_000,
      0,
    );

    expect(totals.subtotal.toFixed(2)).toBe("4000000.00");
    expect(totals.total.toFixed(2)).toBe("3500000.00");
  });

  it("rejects discount greater than subtotal", () => {
    expect(() => calculateQuotationTotals([{ quantity: 1, unitPrice: 100 }], 101)).toThrow(
      "Discount cannot exceed subtotal.",
    );
  });

  it("rejects negative financial values", () => {
    expect(() => calculateQuotationTotals([{ quantity: 1, unitPrice: -1 }])).toThrow(
      "Financial values cannot be negative.",
    );
  });
});

describe("toMidtransAmount", () => {
  it("returns integer IDR amounts", () => {
    expect(toMidtransAmount("2400000")).toBe(2_400_000);
  });

  it("rejects fractional amounts", () => {
    expect(() => toMidtransAmount("1000.50")).toThrow();
  });
});
