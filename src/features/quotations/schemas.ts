import { z } from "zod";

export const quotationItemSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).optional(),
  quantity: z.coerce.number().positive().max(10000),
  unitPrice: z.coerce.number().nonnegative().max(1_000_000_000_000),
});

export const quotationFormSchema = z.object({
  quotationId: z.string().optional(),
  inquiryId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().trim().min(2).max(100),
  companyName: z.string().trim().max(120).optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientPhone: z.string().trim().max(20).optional(),
  clientAddress: z.string().trim().max(500).optional(),
  projectTitle: z.string().trim().min(3).max(160),
  projectSummary: z.string().trim().min(10).max(5000),
  projectType: z.string().trim().max(100).optional(),
  validUntil: z.string().date(),
  estimatedStartDate: z.string().optional(),
  estimatedCompletionAt: z.string().optional(),
  discount: z.coerce.number().nonnegative().default(0),
  tax: z.coerce.number().nonnegative().default(0),
  paymentPlanType: z.enum(["FULL_PAYMENT", "DOWN_PAYMENT_AND_FINAL", "MILESTONE_BASED", "CUSTOM"]),
  customFirstPayment: z.coerce.number().min(1).max(99).default(50),
  scopeIncluded: z.string().trim().min(10).max(10000),
  scopeExcluded: z.string().trim().max(10000).optional(),
  revisionLimit: z.coerce.number().int().min(0).max(100).optional(),
  maintenanceDays: z.coerce.number().int().min(0).max(3650).optional(),
  terms: z.string().trim().min(10).max(15000),
  notes: z.string().trim().max(5000).optional(),
  itemsJson: z.string().transform((value, context) => {
    try { return JSON.parse(value); } catch { context.addIssue({ code: "custom", message: "Quotation items are invalid." }); return z.NEVER; }
  }).pipe(z.array(quotationItemSchema).min(1).max(50)),
  intent: z.enum(["DRAFT", "SENT"]),
}).superRefine((data, context) => {
  if (data.intent === "SENT" && !data.clientEmail) {
    context.addIssue({
      code: "custom",
      path: ["clientEmail"],
      message: "Recipient email is required before sending a quotation.",
    });
  }
});
