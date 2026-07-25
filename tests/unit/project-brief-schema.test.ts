import { describe, expect, it } from "vitest";
import { projectBriefSchema } from "@/features/inquiries/schemas";

const validBrief = {
  clientName: "Radian Putra",
  clientPhone: "628123456789",
  clientEmail: "radian@example.com",
  companyName: "",
  serviceSlug: "",
  projectTitle: "Login system",
  projectType: "Website",
  projectDescription: "Login system",
  projectGoals: "Secure client access",
  targetUsers: "",
  requiredFeatures: "Email login",
  referenceLinks: "",
  budgetRange: "",
  expectedDeadline: "",
};

describe("project brief schema", () => {
  it("accepts a 15-character project description", () => {
    expect(projectBriefSchema.safeParse({ ...validBrief, projectDescription: "Secure login app" }).success).toBe(true);
  });

  it("explains when the project description is too short", () => {
    const result = projectBriefSchema.safeParse(validBrief);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.projectDescription).toEqual([
        "Deskripsi project minimal 15 karakter. Ceritakan singkat apa yang ingin kamu buat.",
      ]);
    }
  });
});
