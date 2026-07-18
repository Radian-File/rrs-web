import { z } from "zod";

export type RecoverableActionState = {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export function zodActionError(error: z.ZodError): RecoverableActionState {
  return { status: "error", errors: error.flatten().fieldErrors };
}

export function genericActionError(message: string): RecoverableActionState {
  return { status: "error", message };
}

export function isRedirectError(error: unknown) {
  return typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT");
}
