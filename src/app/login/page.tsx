import Link from "next/link";
import { AuthContinuation } from "@/components/auth/auth-continuation";
import { AuthFrame } from "@/components/auth/auth-frame";
import { getAuthContinuationCopy } from "@/features/auth/continuation-copy";
import { LoginForm } from "@/features/auth/login-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { getAuthContinuationKind } from "@/lib/auth-continuation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; reason?: string }>;
}) {
  const [{ callbackUrl, reason }, locale] = await Promise.all([searchParams, getLocale()]);
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const continuationKind = getAuthContinuationKind(callbackUrl);
  const continuation = continuationKind
    ? getAuthContinuationCopy(continuationKind, locale, "login")
    : null;

  return (
    <AuthFrame
      locale={locale}
      eyebrow={dictionary.auth.welcome}
      title={dictionary.auth.loginTitle}
      description={dictionary.auth.loginDescription}
      context={
        continuation ? (
          <AuthContinuation
            eyebrow={continuation.eyebrow}
            title={continuation.title}
            description={continuation.description}
          />
        ) : undefined
      }
    >
      {reason === "session-expired" && (
        <p role="status" className="mb-5 border border-primary/20 bg-accent-soft px-4 py-3 text-sm text-foreground">
          {isId
            ? "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan dengan aman."
            : "Your session has ended. Please sign in again to continue safely."}
        </p>
      )}
      <LoginForm
        redirectTo={callbackUrl}
        labels={{
          email: dictionary.auth.email,
          password: dictionary.auth.password,
          signIn: dictionary.auth.signIn,
          signingIn: dictionary.auth.signingIn,
        }}
      />
      <p className="mt-6 text-sm text-secondary">
        {dictionary.auth.newClient}{" "}
        <Link
          href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"}
          className="font-semibold text-primary hover:text-accent-lime"
        >
          {dictionary.auth.createAccount}
        </Link>
      </p>
    </AuthFrame>
  );
}
