import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesEmptyState({ isId, hasFilters, activeLabel, clearLabel }: { isId: boolean; hasFilters: boolean; activeLabel: string | null; clearLabel: string }) {
  const copy = hasFilters
    ? (isId
        ? {
            eyebrow: "Tidak ada kecocokan",
            title: "Layanan tidak ditemukan.",
            description: "Coba kata kunci yang lebih umum atau hapus filter untuk kembali ke seluruh katalog published.",
          }
        : {
            eyebrow: "No matching result",
            title: "No matching service.",
            description: "Try a broader keyword or clear the filters to return to the full published catalogue.",
          })
    : (isId
        ? {
            eyebrow: "Katalog published",
            title: "Layanan published sedang disiapkan.",
            description: "Halaman ini hanya menampilkan layanan yang sudah dikonfirmasi dan dipublikasikan oleh Owner.",
          }
        : {
            eyebrow: "Published catalogue",
            title: "Published services are being prepared.",
            description: "This page only displays services that the Owner has confirmed and published.",
          });

  return (
    <section data-reveal className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 lg:px-12 lg:py-28 xl:px-16" aria-labelledby="services-empty-title">
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_78%_25%,rgba(200,237,115,.1),transparent_30%),linear-gradient(145deg,#252821,#1b1e1b)] px-6 py-16 text-center text-white shadow-[0_34px_100px_rgba(0,0,0,.28)] sm:px-10 lg:py-24">
        <span className="pointer-events-none absolute -right-4 -top-16 font-display text-[15rem] font-black leading-none tracking-[-.1em] text-white/[.025]" aria-hidden="true">00</span>
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-accent-lime/25 bg-accent-lime/10 text-accent-lime">
            <Search className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-6 text-[9px] font-black uppercase tracking-[.2em] text-accent-lime">{copy.eyebrow}</p>
          <h2 id="services-empty-title" className="mt-4 font-display text-[clamp(2.5rem,5vw,4.8rem)] font-black uppercase leading-[.88] tracking-[-.06em]">{copy.title}</h2>
          {activeLabel && <p className="mt-4 break-words text-xs font-bold uppercase tracking-[.1em] text-white/35">{activeLabel}</p>}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/52">{copy.description}</p>
          {hasFilters && (
            <Button asChild variant="outline" size="lg" className="mt-7 rounded-full border-white/15 bg-white/[.04] text-white hover:bg-white/[.08]">
              <Link href="/services">{clearLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
