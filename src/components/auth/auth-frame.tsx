import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/config";

export function AuthFrame({ locale, eyebrow, title, description, children }: { locale: Locale; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  const isId = locale === "id";
  const steps = isId ? ["Technical brief terhubung ke akun", "Quotation dan agreement privat", "Project, invoice, file, dan approval dalam satu portal"] : ["Technical brief connected to your account", "Private quotations and agreements", "Projects, invoices, files, and approvals in one portal"];
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[.88fr_1.12fr]">
      <section className="relative hidden overflow-hidden border-r border-border bg-[#08251e] p-10 text-white lg:flex lg:min-h-screen lg:flex-col xl:p-14">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"><div className="absolute inset-y-0 left-1/3 w-px bg-white/[.06]" /><div className="absolute inset-x-0 top-1/3 h-px bg-white/[.06]" /><div className="absolute -bottom-24 -right-20 size-[28rem] rounded-full bg-[#bde77e]/10 blur-[100px]" /></div>
        <div className="relative"><Brand /></div>
        <div className="relative my-auto max-w-xl py-16"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#bde77e]">RRS / Client workflow</p><h2 className="mt-6 font-display text-[clamp(3rem,5vw,5.7rem)] font-extrabold leading-[.92] tracking-[-.065em]">{isId ? "Satu akun untuk setiap keputusan project." : "One account for every project decision."}</h2><ol className="mt-10 border-t border-white/15">{steps.map((step, index) => <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/15 py-4 text-sm text-white/70"><span className="font-mono text-[9px] text-[#bde77e]">0{index + 1}</span><span className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#bde77e]" aria-hidden="true" />{step}</span></li>)}</ol></div>
        <p className="relative text-xs text-white/45">{isId ? "Formal workflow memerlukan Client login. Diskusi awal tetap dapat dilakukan tanpa akun." : "The formal workflow requires Client sign-in. Initial discussion remains available without an account."}</p>
      </section>

      <section className="flex min-h-screen items-center px-5 py-10 md:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-between lg:justify-end"><div className="lg:hidden"><Brand /></div><Suspense><LanguageSwitcher locale={locale} /></Suspense></div>
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />{isId ? "Kembali ke website" : "Return to website"}</Link>
          <div className="border border-border bg-surface p-6 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-[-.04em] md:text-4xl">{title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-secondary">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
