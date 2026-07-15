"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { localeCookieName } from "@/i18n/server";

export async function setLocaleAction(formData: FormData) {
  const locale = formData.get("locale");
  const requestedPath = String(formData.get("returnTo") ?? "/");
  if (!isLocale(locale)) throw new Error("Unsupported locale.");

  (await cookies()).set(localeCookieName, locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });

  const returnTo = requestedPath.startsWith("/") && !requestedPath.startsWith("//")
    ? requestedPath
    : "/";
  redirect(returnTo);
}
