import Link from "next/link";
import { Brand } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <Brand className="mb-8 justify-center" />
        <Card><CardContent className="p-7 md:p-9"><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Welcome back</p><h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em]">Sign in to your portal.</h1><p className="mt-3 text-sm leading-6 text-secondary">Review quotations, track projects, manage invoices, and approve deliveries.</p><div className="mt-8"><LoginForm redirectTo={callbackUrl} /></div><p className="mt-6 text-center text-sm text-secondary">New client? <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p></CardContent></Card>
      </div>
    </main>
  );
}
