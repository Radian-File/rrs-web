import { describe, expect, it } from "vitest";
import Decimal from "decimal.js";
import { buildPaymentTerms } from "@/features/quotations/payment-terms";

describe("buildPaymentTerms", () => {
  it.each(["FULL_PAYMENT", "DOWN_PAYMENT_AND_FINAL", "MILESTONE_BASED", "CUSTOM"] as const)("allocates the complete total for %s", (plan) => {
    const terms = buildPaymentTerms(plan, "10000001", 45);
    const allocated = terms.reduce((sum, term) => sum.plus(term.amount), new Decimal(0));
    expect(allocated.toFixed(2)).toBe("10000001.00");
    expect(terms.map((term) => term.sequence)).toEqual(terms.map((_, index) => index + 1));
  });

  it("uses the custom first payment percentage", () => {
    const terms = buildPaymentTerms("CUSTOM", 1_000_000, 40);
    expect(terms[0].amount).toBe("400000.00");
    expect(terms[1].amount).toBe("600000.00");
  });
});
