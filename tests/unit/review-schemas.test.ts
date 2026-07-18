import { describe, expect, it } from "vitest";
import { reviewSubmissionSchema } from "@/features/reviews/schemas";

const validSubmission = {
  token: "a".repeat(32),
  overallRating: "5",
  communicationRating: "5",
  qualityRating: "5",
  deliveryRating: "5",
  valueRating: "5",
  comment: "The project was delivered clearly and professionally.",
};

describe("review submission schema", () => {
  it("rejects a short review comment with a field-level message", () => {
    const result = reviewSubmissionSchema.safeParse({ ...validSubmission, comment: "Nice" });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors.comment).toContain("Write at least 20 characters.");
  });

  it("accepts a complete review submission", () => {
    expect(reviewSubmissionSchema.safeParse(validSubmission).success).toBe(true);
  });
});
