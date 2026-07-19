import { Suspense } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; reason?: string }> }) {
  const [{ callbackUrl, reason }, locale] = await Promise.all([searchParams, getLocale()]);
  const dictionary = getDictionary(locale);
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between"><Brand /><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
        <Card><CardContent className="p-7 md:p-9">{reason === "session-expired" && <p role="status" className="mb-5 rounded-[10px] bg-accent-soft px-4 py-3 text-sm text-primary">{locale === "id" ? "Sesi Anda telah diperbarui. Silakan masuk kembali untuk melanjutkan dengan aman." : "Your session was refreshed. Please sign in again to continue safely."}</p>}<p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.auth.welcome}</p><h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em]">{dictionary.auth.loginTitle}</h1><p className="mt-3 text-sm leading-6 text-secondary">{dictionary.auth.loginDescription}</p><div className="mt-8"><LoginForm redirectTo={callbackUrl} labels={{ email: dictionary.auth.email, password: dictionary.auth.password, signIn: dictionary.auth.signIn, signingIn: dictionary.auth.signingIn }} /></div><p className="mt-6 text-center text-sm text-secondary">{dictionary.auth.newClient} <Link href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"} className="font-semibold text-primary hover:underline">{dictionary.auth.createAccount}</Link></p></CardContent></Card>
      </div>
    </main>
  );
}
