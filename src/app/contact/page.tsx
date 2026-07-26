import type { Metadata } from "next";
import { auth } from "@/auth";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { ContactComposition } from "@/features/contact/contact-composition";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { getServerEnv } from "@/lib/env";
import { createWhatsAppUrl, formatWhatsAppNumber } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const isId = (await getLocale()) === "id";
  return {
    title: isId ? "Kontak" : "Contact",
    description: isId
      ? "Diskusikan kebutuhan project digital melalui contact form atau WhatsApp sebelum technical brief dan quotation."
      : "Discuss a digital project through the contact form or WhatsApp before the technical brief and quotation.",
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const [{ sent }, locale, session] = await Promise.all([searchParams, getLocale(), auth()]);
  const env = getServerEnv();
  const isId = locale === "id";
  const role = session?.user?.role;
  const whatsappNumber = formatWhatsAppNumber(env.OWNER_WHATSAPP_NUMBER);
  const whatsappUrl = createWhatsAppUrl(
    env.OWNER_WHATSAPP_NUMBER,
    sent
      ? (isId
          ? `Halo RRS Studio, saya baru mengirim pesan melalui website. Reference contact: ${sent}. Saya ingin melanjutkan diskusi.`
          : `Hello RRS Studio, I have just submitted a website message. Contact reference: ${sent}. I would like to continue the discussion.`)
      : (isId
          ? "Halo RRS Studio, saya ingin berdiskusi mengenai kebutuhan project digital."
          : "Hello RRS Studio, I would like to discuss a digital project."),
  );
  const projectHref =
    role === "OWNER" ? "/owner" : role === "CLIENT" ? "/start-project" : loginUrl("/start-project");
  const projectLabel =
    role === "OWNER"
      ? (isId ? "Buka Owner Workspace" : "Open Owner Workspace")
      : (isId ? "Mulai brief proyek" : "Start a project brief");

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <ContactComposition
          isId={isId}
          whatsappNumber={whatsappNumber}
          whatsappUrl={whatsappUrl}
          projectHref={projectHref}
          projectLabel={projectLabel}
          sent={Boolean(sent)}
        />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
