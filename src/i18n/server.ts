import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const localeCookieName = "rrs-locale";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeCookieName)?.value;
  return isLocale(value) ? value : defaultLocale;
}
