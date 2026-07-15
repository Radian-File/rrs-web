import { describe, expect, it } from "vitest";
import { registerSchema } from "@/features/auth/schemas";

const registration = (password: string) => ({
  name: "Password Policy Client",
  email: "password-policy@example.com",
  whatsappNumber: "628111555777",
  password,
  confirmPassword: password,
});

describe("registerSchema", () => {
  it("accepts a simple matching eight-character password without composition rules", () => {
    expect(registerSchema.safeParse(registration("password")).success).toBe(true);
    expect(registerSchema.safeParse(registration("!!!!!!!!")).success).toBe(true);
  });

  it("rejects passwords shorter than eight characters", () => {
    const result = registerSchema.safeParse(registration("secret1"));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain("Use at least 8 characters.");
    }
  });
});
