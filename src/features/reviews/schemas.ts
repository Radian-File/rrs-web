import { z } from "zod";

export const reviewSubmissionSchema = z.object({
  token: z.string().min(20),
  overallRating: z.coerce.number().int().min(1).max(5),
  communicationRating: z.coerce.number().int().min(1).max(5),
  qualityRating: z.coerce.number().int().min(1).max(5),
  deliveryRating: z.coerce.number().int().min(1).max(5),
  valueRating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(20, "Write at least 20 characters.").max(5000, "Keep the review within 5,000 characters."),
});
