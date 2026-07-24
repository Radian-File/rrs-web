import { safeInternalRedirect } from "@/lib/auth-redirect";

export type AuthContinuationKind =
  | "technical-brief"
  | "quotation"
  | "client-workspace"
  | "protected-workspace";

export function getAuthContinuationKind(value: string | undefined): AuthContinuationKind | null {
  if (!value) return null;
  const safe = safeInternalRedirect(value, "");
  if (!safe) return null;
  if (safe === "/start-project" || safe.startsWith("/start-project?")) return "technical-brief";
  if (safe.startsWith("/quotation/")) return "quotation";
  if (safe === "/client" || safe.startsWith("/client/")) return "client-workspace";
  return "protected-workspace";
}
