import { PageEntrance } from "@/components/page-entrance";
import {
  ConversionContextPanel,
  ConversionFormPanel,
  ConversionFrame,
  ConversionIdentity,
} from "@/components/conversion/conversion-frame";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProjectBriefForm } from "@/features/inquiries/project-brief-form";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const callbackUrl = `/start-project${service ? `?service=${encodeURIComponent(service)}` : ""}`;
  const [client, locale, services] = await Promise.all([
    requireClient(callbackUrl),
    getLocale(),
    prisma.service.findMany({
      where: { isPublished: true },
      select: { slug: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);
  const isId = locale === "id";
  const copy = isId
    ? {
        eyebrow: "Project brief / Client workflow",
        title: "Ceritakan apa yang ingin Anda bangun.",
        description:
          "Brief teknis ini membuat inquiry atas nama akun Anda sebagai dasar diskusi sebelum quotation diterbitkan.",
        identityLabel: "Brief atas nama",
        identityStatus: "Sedang login",
        serviceLabel: "Layanan dipilih",
        customService: "Custom / belum yakin",
        preparationLabel: "Yang perlu disiapkan",
        preparationItems: [
          "Konteks dan tujuan project",
          "Fitur atau kebutuhan utama",
          "Budget dan timeline awal",
        ],
        workflowTitle: "Workflow Client yang privat",
        workflowDescription:
          "RRS meninjau brief ini sebelum membuat quotation. Detail teknis, file, dan keputusan project tetap terhubung ke akun Client Anda.",
        formLabel: "Form technical brief tiga langkah",
      }
    : {
        eyebrow: "Project brief / Client workflow",
        title: "Tell me what you want to build.",
        description:
          "This technical brief creates an inquiry for your account before a quotation is issued.",
        identityLabel: "Brief submitted as",
        identityStatus: "Signed in",
        serviceLabel: "Selected service",
        customService: "Custom / not sure yet",
        preparationLabel: "What to prepare",
        preparationItems: [
          "Project context and goal",
          "Core features or requirements",
          "Initial budget and timeline",
        ],
        workflowTitle: "A private Client workflow",
        workflowDescription:
          "RRS reviews this brief before creating a quotation. Technical details, files, and project decisions remain connected to your Client account.",
        formLabel: "Three-step technical brief form",
      };
  const selectedService = services.find((item) => item.slug === service)?.title ?? copy.customService;

  return (
    <>
      <SiteHeader />
      <PageEntrance>
        <main>
          <ConversionFrame
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            identity={
              <ConversionIdentity
                label={copy.identityLabel}
                name={client.name}
                email={client.email}
                status={copy.identityStatus}
                serviceLabel={copy.serviceLabel}
                service={selectedService}
              />
            }
            context={
              <ConversionContextPanel
                label={copy.preparationLabel}
                items={copy.preparationItems}
                workflowTitle={copy.workflowTitle}
                workflowDescription={copy.workflowDescription}
              />
            }
          >
            <ConversionFormPanel label={copy.formLabel}>
              <ProjectBriefForm
                services={services}
                selectedService={service}
                client={{
                  id: client.id,
                  name: client.name,
                  email: client.email,
                  phone: client.whatsappNumber ?? "",
                  companyName: client.companyName ?? "",
                }}
                isId={isId}
              />
            </ConversionFormPanel>
          </ConversionFrame>
        </main>
      </PageEntrance>
      <SiteFooter />
    </>
  );
}
