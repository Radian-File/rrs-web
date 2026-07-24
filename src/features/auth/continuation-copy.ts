import type { AuthContinuationKind } from "@/lib/auth-continuation";

export function getAuthContinuationCopy(
  kind: AuthContinuationKind,
  locale: "id" | "en",
  mode: "login" | "register",
) {
  const after = locale === "id"
    ? (mode === "login" ? "Setelah masuk" : "Setelah akun dibuat")
    : (mode === "login" ? "After sign-in" : "After account creation");
  const descriptions = locale === "id"
    ? {
        "technical-brief": `${after}, Anda akan kembali ke technical brief untuk membuat inquiry formal.`,
        quotation: `${after}, Anda akan kembali ke quotation yang aman untuk melanjutkan keputusan.`,
        "client-workspace": `${after}, Anda akan kembali ke Client Portal yang terlindungi.`,
        "protected-workspace": `${after}, Anda akan diarahkan ke workspace terlindungi yang diminta.`,
      }
    : {
        "technical-brief": `${after}, you will return to the technical brief to create a formal inquiry.`,
        quotation: `${after}, you will return to the secure quotation to continue the decision.`,
        "client-workspace": `${after}, you will return to the protected Client Portal.`,
        "protected-workspace": `${after}, you will continue to the requested protected workspace.`,
      };
  const titles = locale === "id"
    ? {
        "technical-brief": "Lanjutkan ke technical brief",
        quotation: "Lanjutkan meninjau quotation",
        "client-workspace": "Kembali ke Client Portal",
        "protected-workspace": "Lanjutkan ke workspace terlindungi",
      }
    : {
        "technical-brief": "Continue to the technical brief",
        quotation: "Continue reviewing the quotation",
        "client-workspace": "Return to the Client Portal",
        "protected-workspace": "Continue to the protected workspace",
      };

  return {
    eyebrow: locale === "id" ? "Tujuan setelah autentikasi" : "After authentication",
    title: titles[kind],
    description: descriptions[kind],
  };
}
