"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { setLocaleAction } from "@/i18n/actions";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnTo = query ? `${pathname}?${query}` : pathname;

  return (
    <form action={setLocaleAction} className="inline-flex items-center rounded-[10px] border border-border bg-surface p-1" aria-label="Language">
      <input type="hidden" name="returnTo" value={returnTo} />
      {(["id", "en"] as const).map((value) => (
        <button
          key={value}
          type="submit"
          name="locale"
          value={value}
          aria-pressed={locale === value}
          className={cn(
            "min-h-8 rounded-[7px] px-2.5 text-[11px] font-bold uppercase transition-colors",
            locale === value ? "bg-primary text-white" : "text-secondary hover:text-primary",
          )}
        >
          {value}
        </button>
      ))}
    </form>
  );
}
