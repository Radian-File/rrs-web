"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ redirectTo, labels }: { redirectTo?: string; labels: { email: string; password: string; signIn: string; signingIn: string } }) {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
      <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">{labels.email}</label><Input id="email" name="email" type="email" autoComplete="email" required />{state.errors?.email?.[0] && <p className="mt-2 text-xs text-error">{state.errors.email[0]}</p>}</div>
      <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">{labels.password}</label><Input id="password" name="password" type="password" autoComplete="current-password" required />{state.errors?.password?.[0] && <p className="mt-2 text-xs text-error">{state.errors.password[0]}</p>}</div>
      {state.message && <p role="alert" className="rounded-[10px] bg-[#fbe8e8] px-4 py-3 text-sm text-error">{state.message}</p>}
      <Button className="w-full" size="lg" disabled={pending}>{pending ? labels.signingIn : labels.signIn}</Button>
    </form>
  );
}
