import Link from "next/link";
import { AuthContinuation } from "@/components/auth/auth-continuation";
import { AuthFrame } from "@/components/auth/auth-frame";
import { getAuthContinuationCopy } from "@/features/auth/continuation-copy";
import { RegisterForm } from "@/features/auth/register-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { getAuthContinuationKind } from "@/lib/auth-continuation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const [locale, { callbackUrl }] = await Promise.all([getLocale(), searchParams]);
  const dictionary = getDictionary(locale);
  const continuationKind = getAuthContinuationKind(callbackUrl);
  const continuation = continuationKind
    ? getAuthContinuationCopy(continuationKind, locale, "register")
    : null;

  return (
    <AuthFrame
      locale={locale}
      eyebrow={dictionary.auth.registerEyebrow}
      title={dictionary.auth.registerTitle}
      description={dictionary.auth.registerDescription}
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
      <RegisterForm
        redirectTo={callbackUrl}
        labels={{
          fullName: dictionary.auth.fullName,
          whatsapp: dictionary.auth.whatsapp,
          whatsappHelp: dictionary.auth.whatsappHelp,
          whatsappHelpLabel: dictionary.auth.whatsappHelpLabel,
          email: dictionary.auth.email,
          emailHelp: dictionary.auth.emailHelp,
          emailHelpLabel: dictionary.auth.emailHelpLabel,
          company: dictionary.auth.company,
          password: dictionary.auth.password,
          confirmPassword: dictionary.auth.confirmPassword,
          privacyNote: dictionary.auth.privacyNote,
          create: dictionary.auth.createAccount,
          creating: dictionary.auth.creating,
        }}
      />
      <p className="mt-6 text-sm text-secondary">
        {dictionary.auth.existing}{" "}
        <Link
          href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
          className="font-semibold text-primary hover:text-accent-lime"
        >
          {dictionary.auth.signIn}
        </Link>
      </p>
    </AuthFrame>
  );
}
