import Link from "next/link";
import { Search } from "lucide-react";
import { PublicEmptyState } from "@/components/public/empty-state";
import { Button } from "@/components/ui/button";

export function ServicesEmptyState({
  isId,
  hasFilters,
  activeLabel,
  clearLabel,
}: {
  isId: boolean;
  hasFilters: boolean;
  activeLabel: string | null;
  clearLabel: string;
}) {
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
    <PublicEmptyState
      titleId="services-empty-title"
      icon={Search}
      eyebrow={copy.eyebrow}
      title={copy.title}
      context={activeLabel}
      description={copy.description}
      action={
        hasFilters ? (
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 bg-white/[.04] text-white hover:bg-white/[.08]">
            <Link href="/services">{clearLabel}</Link>
          </Button>
        ) : undefined
      }
    />
  );
}
