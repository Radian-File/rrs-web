import { PageEntrance } from "@/components/page-entrance";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProjectBriefForm } from "@/features/inquiries/project-brief-form";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";
import { requireClient } from "@/lib/authz";
export const dynamic = "force-dynamic";

export default async function StartProjectPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const callbackUrl = `/start-project${service ? `?service=${encodeURIComponent(service)}` : ""}`;
  const [client, locale, services] = await Promise.all([
    requireClient(callbackUrl),
    getLocale(),
    prisma.service.findMany({ where: { isPublished: true }, select: { slug: true, title: true }, orderBy: { title: "asc" } }),
  ]);
  const isId = locale === "id";
  return <><SiteHeader /><PageEntrance><main><section className="border-b border-border"><div className="mx-auto max-w-[1100px] px-5 py-20 md:px-8 lg:py-24"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Project brief</p><h1 className="text-balance mt-6 max-w-5xl font-display text-5xl font-extrabold leading-[1] tracking-[-.055em] md:text-7xl">{isId ? "Ceritakan apa yang ingin Anda bangun." : "Tell me what you want to build."}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-secondary">{isId ? "Brief teknis ini membuat inquiry atas nama akun Anda sebagai dasar diskusi sebelum quotation diterbitkan." : "This technical brief creates an inquiry for your account before a quotation is issued."}</p></div></section><section data-reveal className="mx-auto grid max-w-[1100px] gap-10 px-5 py-16 md:px-8 lg:grid-cols-[240px_1fr] lg:py-24"><aside className="border-t border-border pt-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary">{isId ? "Yang perlu disiapkan" : "What to prepare"}</p><ol className="mt-5 space-y-4 text-sm leading-6 text-secondary"><li><span className="mr-2 font-bold text-primary">01</span>{isId ? "Konteks dan tujuan project" : "Project context and goal"}</li><li><span className="mr-2 font-bold text-primary">02</span>{isId ? "Fitur atau kebutuhan utama" : "Core features or requirements"}</li><li><span className="mr-2 font-bold text-primary">03</span>{isId ? "Budget dan timeline awal" : "Initial budget and timeline"}</li></ol></aside><div className="border border-border bg-surface p-6 md:p-10"><ProjectBriefForm services={services} selectedService={service} client={{ name: client.name, email: client.email, phone: client.whatsappNumber ?? "", companyName: client.companyName ?? "" }} /></div></section></main></PageEntrance><SiteFooter /></>;
}
