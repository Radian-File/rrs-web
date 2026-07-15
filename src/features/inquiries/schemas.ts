import { z } from "zod";

const optionalText = z.string().trim().transform((value) => value || undefined).optional();

export const projectBriefSchema = z.object({
  clientName: z.string().trim().min(2).max(100),
  clientPhone: z.string().trim().min(8).max(20),
  clientEmail: z.string().email().transform((value) => value.toLowerCase()),
  companyName: optionalText,
  serviceSlug: optionalText,
  projectTitle: z.string().trim().min(3).max(160),
  projectType: z.string().trim().min(2).max(100),
  projectDescription: z.string().trim().min(30).max(5000),
  projectGoals: z.string().trim().min(10).max(3000),
  targetUsers: optionalText,
  requiredFeatures: z.string().trim().min(3).max(3000),
  referenceLinks: optionalText,
  budgetRange: optionalText,
  expectedDeadline: optionalText,
  hasDesign: z.enum(["yes", "no", "partial"]).optional(),
  hasDomain: z.enum(["yes", "no"]).optional(),
  hasHosting: z.enum(["yes", "no"]).optional(),
  needsMaintenance: z.enum(["yes", "no"]).optional(),
  projectMode: z.enum(["new", "redesign"]).optional(),
});

export type ProjectBriefInput = z.infer<typeof projectBriefSchema>;
