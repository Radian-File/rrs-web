import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  AUTH_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32),
  OWNER_EMAIL: z.string().email(),
  OWNER_PASSWORD: z.string().min(12),
  OWNER_WHATSAPP_NUMBER: z.string().min(8),
  STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
  LOCAL_UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().max(50).default(10),
  MIDTRANS_SERVER_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  MIDTRANS_CLIENT_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  MIDTRANS_IS_PRODUCTION: z.stringbool().default(false),
  EMAIL_DRIVER: z.enum(["console", "ses"]).default("console"),
  EMAIL_FROM: z.string().min(3),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  return serverEnvSchema.parse(source);
}

export function getServerAppUrl() {
  const env = getServerEnv();
  return env.AUTH_URL ?? env.NEXT_PUBLIC_APP_URL;
}

export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
