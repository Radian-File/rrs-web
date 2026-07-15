"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { assertRequestRateLimit } from "@/lib/security/rate-limit";

export type AuthActionState = {
  message?: string;
  errors?: Record<string, string[]>;
};

function safeRedirect(value: string | undefined, fallback: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  await assertRequestRateLimit("login", 8, 15 * 60 * 1000, String(formData.get("email") ?? "anonymous"));
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeRedirect(parsed.data.redirectTo, "/client"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Email or password is incorrect." };
    }
    throw error;
  }

  return {};
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  await assertRequestRateLimit("register", 4, 60 * 60 * 1000, String(formData.get("email") ?? "anonymous"));
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, role: true, passwordHash: true },
  });
  if (existing?.passwordHash || existing?.role === "OWNER") {
    return { message: "An account with this email already exists." };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: parsed.data.name,
        whatsappNumber: parsed.data.whatsappNumber,
        companyName: parsed.data.companyName || null,
        passwordHash,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        whatsappNumber: parsed.data.whatsappNumber,
        companyName: parsed.data.companyName || null,
        passwordHash,
        role: "CLIENT",
      },
    });
  }

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/client",
  });

  redirect("/client");
}
