import { Suspense } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/register-form";
import { getQuotationAuthContextFromCallbackUrl } from "@/features/quotations/public-query";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const [{ callbackUrl }, locale] = await Promise.all([searchParams, getLocale()]);
  const [dictionary, quotationContext] = await Promise.all([
    Promise.resolve(getDictionary(locale)),
    getQuotationAuthContextFromCallbackUrl(callbackUrl),
  ]);
  const loginHref = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
  const isId = locale === "id";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between"><Brand /><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
        <Card><CardContent className="p-7 md:p-9">
          {quotationContext && <p role="status" className="mb-5 rounded-[10px] bg-accent-soft px-4 py-3 text-sm text-primary">{isId ? "Buat akun dengan email penerima quotation untuk melanjutkan penerimaan quotation." : "Create an account with the quotation recipient email to continue acceptance."}</p>}
          <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.auth.registerEyebrow}</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em]">{dictionary.auth.registerTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-secondary">{dictionary.auth.registerDescription}</p>
          <div className="mt-8"><RegisterForm redirectTo={callbackUrl} recipientEmail={quotationContext?.clientEmail} labels={{ fullName: dictionary.auth.fullName, whatsapp: dictionary.auth.whatsapp, email: dictionary.auth.email, company: dictionary.auth.company, password: dictionary.auth.password, confirmPassword: dictionary.auth.confirmPassword, create: dictionary.auth.createAccount, creating: dictionary.auth.creating }} /></div>
          <p className="mt-6 text-center text-sm text-secondary">{dictionary.auth.existing} <Link href={loginHref} className="font-semibold text-primary hover:underline">{dictionary.auth.signIn}</Link></p>
        </CardContent></Card>
      </div>
    </main>
  );
}
