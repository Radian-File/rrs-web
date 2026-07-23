import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ChartNoAxesCombined, FileText, FolderKanban, MessageSquareText, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function OwnerDashboard() {
  const [locale, inquiries, quotations, projects, services] = await Promise.all([
    getLocale(),
    prisma.inquiry.count({ where: { archivedAt: null, status: { notIn: ["ARCHIVED", "CANCELLED"] } } }),
    prisma.quotation.count({ where: { archivedAt: null, isCurrent: true, status: { in: ["DRAFT", "SENT", "VIEWED", "REVISION_REQUESTED"] } } }),
    prisma.project.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.service.count({ where: { isPublished: true } }),
  ]);
  const dictionary = getDictionary(locale);
  const isId = locale === "id";
  const metrics: Array<{ label: string; value: number; icon: LucideIcon; href: string; detail: string; featured?: boolean }> = [
    { label: isId ? "Inquiry aktif" : "Active inquiries", value: inquiries, icon: MessageSquareText, href: "/owner/inquiries", detail: isId ? "Permintaan yang belum diarsipkan" : "Requests that are not archived", featured: true },
    { label: isId ? "Quotation terbuka" : "Open quotations", value: quotations, icon: FileText, href: "/owner/quotations", detail: isId ? "Draft, terkirim, ditinjau, atau direvisi" : "Draft, sent, viewed, or under revision" },
    { label: isId ? "Project aktif" : "Active projects", value: projects, icon: FolderKanban, href: "/owner/projects", detail: isId ? "Project yang belum selesai" : "Projects that are not complete" },
    { label: isId ? "Layanan published" : "Published services", value: services, icon: BriefcaseBusiness, href: "/owner/services", detail: isId ? "Tersedia pada katalog publik" : "Available in the public catalogue" },
  ];

  return <>
    <header className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{dictionary.dashboard.ownerEyebrow}</p><h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-[-.05em] md:text-5xl">{dictionary.dashboard.ownerTitle}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-secondary">{dictionary.dashboard.ownerDescription}</p></div>
      <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/owner/analytics"><ChartNoAxesCombined className="size-4" aria-hidden="true" />{dictionary.portal.analytics}</Link></Button><Button asChild><Link href="/owner/services"><BriefcaseBusiness className="size-4" aria-hidden="true" />{isId ? "Kelola layanan" : "Manage services"}</Link></Button></div>
    </header>

    <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-12" aria-label={isId ? "Ringkasan operasional" : "Operational summary"}>
      {metrics.map((metric, index) => <Metric key={metric.label} {...metric} index={index} className={metric.featured ? "xl:col-span-6" : "xl:col-span-2"} />)}
    </section>

    <section className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className="border border-border bg-surface p-6 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{isId ? "Alur utama" : "Primary flow"}</p><h2 className="mt-3 font-display text-2xl font-bold tracking-[-.035em]">Inquiry → Quotation → Project</h2><div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-3">{[[dictionary.portal.inquiries, inquiries, "/owner/inquiries"], [dictionary.portal.quotations, quotations, "/owner/quotations"], [dictionary.portal.projects, projects, "/owner/projects"]].map(([label, value, href], index) => <Link key={href} href={String(href)} className="group bg-background p-5 hover:bg-surface-hover"><span className="font-mono text-[9px] text-accent-lime">0{index + 1}</span><p className="mt-8 font-display text-3xl font-bold tabular-nums">{value}</p><p className="mt-2 flex items-center justify-between text-sm font-semibold text-secondary group-hover:text-foreground">{label}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></p></Link>)}</div></div>
      <div className="border border-border bg-[#0a2b23] p-6 text-white md:p-8"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#bde77e]">{isId ? "Analitik" : "Analytics"}</p><h2 className="mt-3 font-display text-2xl font-bold tracking-[-.035em]">{isId ? "Konteks untuk keputusan berikutnya." : "Context for the next decision."}</h2><p className="mt-4 text-sm leading-7 text-white/60">{isId ? "Tinjau pipeline, posisi invoice, workload, dan item yang memerlukan perhatian pada dashboard analitik." : "Review the pipeline, invoice position, workload, and items requiring attention in the analytics dashboard."}</p><Button asChild variant="outline" className="mt-7 border-white/20 bg-transparent text-white hover:bg-white/10"><Link href="/owner/analytics">{isId ? "Buka analitik" : "Open analytics"}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button></div>
    </section>
  </>;
}

function Metric({ label, value, icon: Icon, href, detail, featured, index, className }: { label: string; value: number; icon: LucideIcon; href: string; detail: string; featured?: boolean; index: number; className?: string }) {
  return <Link href={href} className={`group flex min-h-56 flex-col justify-between border p-6 transition-colors ${featured ? "border-primary/35 bg-accent-soft" : "border-border bg-surface hover:bg-surface-hover"} ${className ?? ""}`}><div className="flex items-start justify-between"><span className={`grid size-11 place-items-center rounded-full ${featured ? "bg-accent-lime text-background" : "bg-surface-container text-primary"}`}><Icon className="size-5" aria-hidden="true" /></span><span className="font-mono text-[9px] text-muted">0{index + 1}</span></div><div className="mt-8"><p className={`font-display font-bold leading-none tracking-[-.05em] tabular-nums ${featured ? "text-6xl" : "text-4xl"}`}>{value}</p><p className="mt-3 text-sm font-semibold">{label}</p><p className="mt-1 text-xs leading-5 text-secondary">{detail}</p></div></Link>;
}
