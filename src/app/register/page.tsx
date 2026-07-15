import Link from "next/link";
import { Brand } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-2xl"><Brand className="mb-8 justify-center" /><Card><CardContent className="p-7 md:p-9"><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Client account</p><h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em]">Manage every project in one place.</h1><p className="mt-3 text-sm leading-6 text-secondary">Your account is used for accepted quotations, agreements, project access, invoices, files, and reviews.</p><div className="mt-8"><RegisterForm /></div><p className="mt-6 text-center text-sm text-secondary">Already registered? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p></CardContent></Card></div>
    </main>
  );
}
