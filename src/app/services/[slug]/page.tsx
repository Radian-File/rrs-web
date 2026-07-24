import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageEntrance } from "@/components/page-entrance";
import { ServiceDetailComposition } from "@/features/services/public/service-detail-composition";
import { getLocale } from "@/i18n/server";
import { loginUrl } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, summary: true },
  });

  return service
    ? { title: service.title, description: service.summary }
    : { title: "Service not found", robots: { index: false, follow: false } };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale, session] = await Promise.all([params, getLocale(), auth()]);
  const service = await prisma.service.findFirst({ where: { slug, isPublished: true } });
  if (!service) notFound();

  const isId = locale === "id";
  const role = session?.user?.role;
  const quotationHref =
    role === "CLIENT"
      ? `/start-project?service=${service.slug}`
      : role === "OWNER"
        ? "/owner"
        : loginUrl(`/start-project?service=${service.slug}`);
  const quotationLabel =
    role === "CLIENT"
      ? (isId ? "Mulai mengajukan quotation" : "Start a quotation request")
      : role === "OWNER"
        ? (isId ? "Buka Owner Workspace" : "Open Owner Workspace")
        : (isId ? "Login untuk mengajukan quotation" : "Sign in to request a quotation");
  const estimate = service.startingPrice
    ? `${formatIdr(service.startingPrice.toString())}+`
    : (isId ? "Sesuai scope" : "Custom scope");

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <ServiceDetailComposition
          service={service}
          estimate={estimate}
          quotationHref={quotationHref}
          quotationLabel={quotationLabel}
          isId={isId}
        />
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
