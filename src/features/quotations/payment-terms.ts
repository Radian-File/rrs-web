import Decimal from "decimal.js";
import type { PaymentPlanType } from "@/generated/prisma/enums";

export type BuiltPaymentTerm = { title: string; description: string; percentage: string; amount: string; dueTrigger: string; sequence: number };

export function buildPaymentTerms(plan: PaymentPlanType, totalValue: Decimal.Value, customFirst = 50): BuiltPaymentTerm[] {
  const total = new Decimal(totalValue);
  const definitions = plan === "FULL_PAYMENT"
    ? [["Full Payment", 100, "BEFORE_PROJECT_START"]]
    : plan === "DOWN_PAYMENT_AND_FINAL"
      ? [["Down Payment", 30, "BEFORE_PROJECT_START"], ["Final Payment", 70, "AFTER_FINAL_APPROVAL"]]
      : plan === "MILESTONE_BASED"
        ? [["Down Payment", 30, "BEFORE_PROJECT_START"], ["Design Approved", 30, "AFTER_DESIGN_APPROVAL"], ["Development Finished", 20, "AFTER_DEVELOPMENT"], ["Final Delivery", 20, "BEFORE_FINAL_DELIVERY"]]
        : [["First Payment", customFirst, "BEFORE_PROJECT_START"], ["Final Payment", 100 - customFirst, "AFTER_FINAL_APPROVAL"]];

  let allocated = new Decimal(0);
  return definitions.map(([title, percentage, dueTrigger], index) => {
    const amount = index === definitions.length - 1 ? total.minus(allocated) : total.times(Number(percentage)).dividedBy(100).toDecimalPlaces(2);
    allocated = allocated.plus(amount);
    return { title: String(title), description: `${percentage}% of project total`, percentage: String(percentage), amount: amount.toFixed(2), dueTrigger: String(dueTrigger), sequence: index + 1 };
  });
}
