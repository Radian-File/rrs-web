import Link from "next/link";
import { BriefcaseBusiness, ChartNoAxesCombined, FileText, FolderKanban, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function OwnerDashboard() {
  const [locale, inquiries, quotations, projects, services] = await Promise.all([
    getLocale(),
    prisma.inquiry.count({ where: { status: { notIn: ["ARCHIVED", "CANCELLED"] } } }),
    prisma.quotation.count({ where: { isCurrent: true, status: { in: ["DRAFT", "SENT", "VIEWED", "REVISION_REQUESTED"] } } }),
    prisma.project.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.service.count({ where: { isPublished: true } }),
  ]);
  const dictionary = getDictionary(locale);
  const metrics = [[locale === "id" ? "Inquiry aktif" : "Active inquiries", inquiries, MessageSquareText], [locale === "id" ? "Quotation terbuka" : "Open quotations", quotations, FileText], [locale === "id" ? "Proyek aktif" : "Active projects", projects, FolderKanban], [locale === "id" ? "Layanan publik" : "Public services", services, BriefcaseBusiness]] as const;
  return <><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.dashboard.ownerEyebrow}</p><h1 className="mt-3 font-display text-3xl font-extrabold">{dictionary.dashboard.ownerTitle}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">{dictionary.dashboard.ownerDescription}</p></div><div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/owner/analytics"><ChartNoAxesCombined className="size-4"/>{dictionary.portal.analytics}</Link></Button><Button asChild><Link href="/owner/services"><BriefcaseBusiness className="size-4"/>Kelola layanan</Link></Button></div></div><div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, Icon]) => <Card key={label}><CardContent><Icon className="size-5 text-primary" /><p className="mt-8 font-display text-4xl font-extrabold">{value}</p><p className="mt-2 text-sm text-secondary">{label}</p></CardContent></Card>)}</div></>;
}
