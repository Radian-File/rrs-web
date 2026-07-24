import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { ProcessComposition } from "@/features/process/public/process-composition";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Cara Kerja" : "How It Works",
    description: isId
      ? "Alur RRS Studio dari diskusi guest, akun Client, technical brief, quotation, agreement, pembayaran, delivery, hingga review terverifikasi."
      : "The RRS Studio workflow from guest discussion and a Client account through the technical brief, quotation, agreement, payment, delivery, and verified review.",
  };
}

export default async function CaraKerjaPage() {
  const locale = await getLocale();

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <ProcessComposition isId={locale === "id"} />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
