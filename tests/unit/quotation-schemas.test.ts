import { describe, expect, it } from "vitest";
import { quotationFormSchema } from "@/features/quotations/schemas";

const quotationInput = {
  clientName: "Quotation Client",
  companyName: "",
  clientEmail: "",
  clientPhone: "628123456789",
  clientAddress: "",
  projectTitle: "Quotation identity workflow",
  projectSummary: "A complete project summary used to validate quotation identity requirements.",
  projectType: "Web application",
  validUntil: "2026-12-31",
  estimatedStartDate: "",
  estimatedCompletionAt: "",
  discount: "0",
  tax: "0",
  paymentPlanType: "DOWN_PAYMENT_AND_FINAL",
  customFirstPayment: "50",
  scopeIncluded: "Discovery, design, implementation, and documented handover.",
  scopeExcluded: "",
  revisionLimit: "2",
  maintenanceDays: "30",
  terms: "Work begins after the agreement and first payment are complete.",
  notes: "",
  itemsJson: JSON.stringify([{ title: "Implementation", description: "Full project delivery", quantity: 1, unitPrice: 8000000 }]),
};

describe("quotationFormSchema", () => {
  it("allows a draft quotation without a recipient email", () => {
    expect(quotationFormSchema.safeParse({ ...quotationInput, intent: "DRAFT" }).success).toBe(true);
  });

  it("requires a recipient email before a quotation can be sent", () => {
    const result = quotationFormSchema.safeParse({ ...quotationInput, intent: "SENT" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.clientEmail).toContain("Recipient email is required before sending a quotation.");
  });

  it("accepts a sent quotation with a valid recipient email", () => {
    expect(quotationFormSchema.safeParse({ ...quotationInput, clientEmail: "client@example.com", intent: "SENT" }).success).toBe(true);
  });
});
