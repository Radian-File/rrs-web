import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
  redirectTo: z.string().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters.").max(100),
    email: z.string().email("Enter a valid email.").transform((value) => value.toLowerCase()),
    whatsappNumber: z.string().trim().min(8, "Enter a valid WhatsApp number.").max(20),
    companyName: z.string().trim().max(120).optional(),
    password: z
      .string()
      .min(12, "Use at least 12 characters.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/[0-9]/, "Include a number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
