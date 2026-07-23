import Link from "next/link";
import { AuthFrame } from "@/components/auth/auth-frame";
import { RegisterForm } from "@/features/auth/register-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const [locale, { callbackUrl }] = await Promise.all([getLocale(), searchParams]);
  const dictionary = getDictionary(locale);
  return (
    <AuthFrame locale={locale} eyebrow={dictionary.auth.registerEyebrow} title={dictionary.auth.registerTitle} description={dictionary.auth.registerDescription}>
      <RegisterForm redirectTo={callbackUrl} labels={{ fullName: dictionary.auth.fullName, whatsapp: dictionary.auth.whatsapp, email: dictionary.auth.email, company: dictionary.auth.company, password: dictionary.auth.password, confirmPassword: dictionary.auth.confirmPassword, create: dictionary.auth.createAccount, creating: dictionary.auth.creating }} />
      <p className="mt-6 text-sm text-secondary">{dictionary.auth.existing} <Link href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"} className="font-semibold text-primary hover:text-accent-lime">{dictionary.auth.signIn}</Link></p>
    </AuthFrame>
  );
}
