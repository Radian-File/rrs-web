import { describe, expect, it } from "vitest";
import { getServerEnv } from "@/lib/env";

const validEnv = {
  DATABASE_URL: "postgresql://rrs:rrs@127.0.0.1:5434/rrs",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  AUTH_SECRET: "a-secure-test-secret-that-is-long-enough",
  OWNER_EMAIL: "owner@example.com",
  OWNER_PASSWORD: "ChangeMe123!",
  OWNER_WHATSAPP_NUMBER: "6280000000000",
  STORAGE_DRIVER: "local",
  LOCAL_UPLOAD_DIR: "./uploads",
  MAX_UPLOAD_SIZE_MB: "10",
  MIDTRANS_SERVER_KEY: "",
  MIDTRANS_CLIENT_KEY: "",
  MIDTRANS_IS_PRODUCTION: "false",
  EMAIL_DRIVER: "console",
  EMAIL_FROM: "RRS <noreply@example.com>",
};

describe("server environment", () => {
  it("parses local development configuration", () => {
    const env = getServerEnv(validEnv);
    expect(env.MIDTRANS_SERVER_KEY).toBeUndefined();
    expect(env.MIDTRANS_IS_PRODUCTION).toBe(false);
    expect(env.MAX_UPLOAD_SIZE_MB).toBe(10);
  });

  it("rejects short auth secrets", () => {
    expect(() => getServerEnv({ ...validEnv, AUTH_SECRET: "short" })).toThrow();
  });
});
