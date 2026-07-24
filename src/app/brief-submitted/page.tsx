import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { ConversionResultFrame } from "@/components/conversion/conversion-result";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env";
import { createWhatsAppUrl, formatWhatsAppNumber } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BriefSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const callbackUrl = `/brief-submitted?id=${encodeURIComponent(id)}`;
  const [client, locale] = await Promise.all([requireClient(callbackUrl), getLocale()]);
  const inquiry = await prisma.inquiry.findFirst({
    where: { id, clientId: client.id },
    include: { selectedService: { select: { title: true } } },
  });
  if (!inquiry) notFound();

  const isId = locale === "id";
  const env = getServerEnv();
  const message = isId
    ? `Halo RRS Studio, saya sudah mengirimkan technical brief melalui website.\n\nInquiry: ${inquiry.inquiryNumber}\nProject: ${inquiry.projectTitle}\nLayanan: ${inquiry.selectedService?.title ?? inquiry.projectType}\nBudget: ${inquiry.budgetRange ?? "Akan didiskusikan"}\n\nSaya ingin melanjutkan diskusi mengenai project tersebut.`
    : `Hello RRS Studio, I have submitted a technical brief through the website.\n\nInquiry: ${inquiry.inquiryNumber}\nProject: ${inquiry.projectTitle}\nService: ${inquiry.selectedService?.title ?? inquiry.projectType}\nBudget: ${inquiry.budgetRange ?? "To be discussed"}\n\nI would like to continue the project discussion.`;
  const whatsapp = createWhatsAppUrl(env.OWNER_WHATSAPP_NUMBER, message);
  const whatsappNumber = formatWhatsAppNumber(env.OWNER_WHATSAPP_NUMBER);

  return (
    <>
      <SiteHeader />
      <ConversionResultFrame
        icon={<CheckCircle2 className="size-7 text-success" aria-hidden="true" />}
        eyebrow={isId ? "Brief diterima" : "Brief received"}
        title={isId ? "Lanjutkan diskusi melalui WhatsApp." : "Continue the discussion on WhatsApp."}
        description={
          <>
            {isId ? "Nomor inquiry Anda adalah" : "Your inquiry number is"}{" "}
            <strong className="text-foreground">{inquiry.inquiryNumber}</strong>.{" "}
            {isId
              ? "Pesan yang disiapkan menyertakan referensi ini agar diskusi tetap terhubung dengan brief."
              : "The prepared message includes this reference so the discussion remains connected to the brief."}
          </>
        }
        notice={
          <>
            <p className="font-semibold text-foreground">
              {isId
                ? "Brief ini hanya dapat dilihat dari akun Client pemiliknya."
                : "This brief is visible only to its Client account."}
            </p>
            <p className="mt-1">
              {isId
                ? "Quotation, project, invoice, dan file akan tersedia di Client Portal sesuai tahap workflow."
                : "Quotations, projects, invoices, and files will appear in the Client Portal as the workflow progresses."}
            </p>
          </>
        }
        primaryAction={
          <Button asChild size="lg" className="w-full">
            <a href={whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" aria-hidden="true" />
              {isId ? "Lanjut ke WhatsApp" : "Continue on WhatsApp"}
            </a>
          </Button>
        }
        meta={<>WhatsApp {whatsappNumber}</>}
        secondaryAction={
          <Button asChild variant="ghost">
            <Link href="/client">{isId ? "Kembali ke Client Portal" : "Return to Client Portal"}</Link>
          </Button>
        }
      />
      <SiteFooter />
    </>
  );
}
