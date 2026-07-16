import Link from "next/link";
import { ArrowUpRight, BanknoteArrowDown, CircleAlert, ClipboardList, FileText, ReceiptText, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOwnerAnalytics } from "@/features/analytics/owner-analytics";
import { analyticsPeriods, type AnalyticsPeriod } from "@/features/analytics/owner-analytics-utils";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ period?: string }>;

function formatDateRange(start: Date, end: Date, locale: "id" | "en") {
  const formatter = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" });
  const lastDay = new Date(end.getTime() - 1);
  return `${formatter.format(start)} – ${formatter.format(lastDay)}`;
}

function formatDate(value: Date, locale: "id" | "en") {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { timeZone: "Asia/Jakarta", day: "numeric", month: "short" }).format(value);
}

function comparisonLabel(current: number, previous: number | null, label: string) {
  if (previous === null) return null;
  const difference = current - previous;
  return `${difference > 0 ? "+" : ""}${difference} ${label}`;
}

export default async function OwnerAnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ period: rawPeriod }, locale] = await Promise.all([searchParams, getLocale()]);
  const analytics = await getOwnerAnalytics(rawPeriod);
  const dictionary = getDictionary(locale);
  const copy = dictionary.analytics;
  const isEmpty = analytics.current.inquiries === 0 && analytics.current.sentQuotations === 0 && analytics.current.projects === 0 && analytics.current.cashReceived === "0";
  const periodLabels: Record<AnalyticsPeriod, string> = { "7d": copy.last7Days, "30d": copy.last30Days, "90d": copy.last90Days, ytd: copy.yearToDate };
  const comparison = analytics.previous;

  const attentionGroups = [
    {
      title: copy.delayedInquiries,
      items: analytics.attention.delayedInquiries.map((item) => ({ href: `/owner/inquiries/${item.id}`, title: item.inquiryNumber, detail: item.projectTitle, date: item.createdAt })),
    },
    {
      title: copy.expiringQuotations,
      items: analytics.attention.expiringQuotations.map((item) => ({ href: `/owner/quotations/${item.id}`, title: item.quotationNumber, detail: item.projectTitle, date: item.validUntil })),
    },
    {
      title: copy.overdue,
      items: analytics.attention.overdueInvoices.map((item) => ({ href: `/owner/invoices/${item.id}`, title: item.invoiceNumber, detail: formatIdr(item.total), date: item.dueDate })),
    },
    {
      title: copy.pendingProofs,
      items: analytics.attention.pendingProofs.map((item) => ({ href: "/owner/payments", title: item.invoice.invoiceNumber, detail: item.project.title, date: item.createdAt })),
    },
    {
      title: copy.clientReview,
      items: analytics.attention.clientReviewProjects.map((item) => ({ href: `/owner/projects/${item.id}`, title: item.projectNumber, detail: item.title, date: item.updatedAt })),
    },
    {
      title: copy.staleProjects,
      items: analytics.attention.staleProjects.map((item) => ({ href: `/owner/projects/${item.id}`, title: item.projectNumber, detail: item.title, date: item.updatedAt })),
    },
  ].filter((group) => group.items.length > 0);

  return <>
    <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{copy.eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-.035em] md:text-4xl">{copy.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">{copy.description}</p>
      </div>
      <p className="text-sm font-semibold text-secondary"><span className="text-foreground">{copy.currentPeriod}:</span> {formatDateRange(analytics.range.start, analytics.range.end, locale)}</p>
    </div>

    <nav className="mt-6 flex flex-wrap gap-2" aria-label={copy.currentPeriod}>
      {analyticsPeriods.map((period) => <Button key={period} asChild size="sm" variant={analytics.period === period ? "primary" : "outline"}>
        <Link href={`/owner/analytics?period=${period}`}>{periodLabels[period]}</Link>
      </Button>)}
    </nav>

    {isEmpty ? <Card className="mt-8 border-dashed"><CardContent className="py-12 text-center"><ClipboardList className="mx-auto size-8 text-primary" /><h2 className="mt-5 font-display text-2xl font-extrabold">{copy.noDataTitle}</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-secondary">{copy.noDataDescription}</p><div className="mt-6 flex justify-center gap-3"><Button asChild><Link href="/owner/inquiries">{dictionary.portal.inquiries}</Link></Button><Button asChild variant="outline"><Link href="/owner/quotations/create">{dictionary.portal.quotations}</Link></Button></div></CardContent></Card> : <>
      <section className="mt-8 grid gap-px overflow-hidden rounded-[18px] border border-border bg-border sm:grid-cols-2 xl:grid-cols-3" aria-label={copy.eyebrow}>
        <Metric icon={ClipboardList} label={copy.inquiries} value={analytics.current.inquiries} comparison={comparisonLabel(analytics.current.inquiries, comparison?.inquiries ?? null, copy.previousPeriod)} />
        <Metric icon={FileText} label={copy.quotationsSent} value={analytics.current.sentQuotations} comparison={comparisonLabel(analytics.current.sentQuotations, comparison?.sentQuotations ?? null, copy.previousPeriod)} />
        <Metric icon={FileText} label={copy.acceptedValue} value={formatIdr(analytics.current.acceptedQuotationValue)} comparison={comparison ? `${copy.previousPeriod}: ${formatIdr(comparison.acceptedQuotationValue)}` : null} />
        <Metric icon={BanknoteArrowDown} label={copy.cashReceived} value={formatIdr(analytics.current.cashReceived)} comparison={comparison ? `${copy.previousPeriod}: ${formatIdr(comparison.cashReceived)}` : null} />
        <Metric icon={ReceiptText} label={copy.outstanding} value={formatIdr(analytics.metrics.outstanding)} note={copy.activeNow} />
        <Metric icon={UsersRound} label={copy.activeClients} value={analytics.metrics.activeClients} note={copy.activeNow} />
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <Card><CardContent><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{copy.operationalPipeline}</p><h2 className="mt-2 font-display text-2xl font-extrabold">Inquiry → Project</h2></div><Badge variant="neutral">{copy.funnelNote}</Badge></div><div className="mt-8 grid gap-5 sm:grid-cols-4"><FunnelStep label={copy.inquiries} value={analytics.funnel.inquiries} rate={null} /><FunnelStep label={copy.quotationsSent} value={analytics.funnel.quotations} rate={analytics.funnel.quotationRate === null ? copy.noConversion : `${analytics.funnel.quotationRate}%`} /><FunnelStep label={copy.acceptedQuotations} value={analytics.funnel.accepted} rate={analytics.funnel.acceptanceRate === null ? copy.noConversion : `${analytics.funnel.acceptanceRate}%`} /><FunnelStep label={dictionary.portal.projects} value={analytics.funnel.projects} rate={analytics.funnel.projectRate === null ? copy.noConversion : `${analytics.funnel.projectRate}%`} /></div><div className="mt-7 grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-3"><Rate label={copy.quotationRate} value={analytics.funnel.quotationRate} noData={copy.noConversion} /><Rate label={copy.acceptanceRate} value={analytics.funnel.acceptanceRate} noData={copy.noConversion} /><Rate label={copy.projectRate} value={analytics.funnel.projectRate} noData={copy.noConversion} /></div></CardContent></Card>
        <Card><CardContent><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{copy.financialHealth}</p><h2 className="mt-2 font-display text-2xl font-extrabold">{copy.activeNow}</h2><dl className="mt-7 divide-y divide-border text-sm"><FinanceRow label={copy.overdue} value={`${analytics.metrics.overdue.count} · ${formatIdr(analytics.metrics.overdue.amount)}`} danger /><FinanceRow label={copy.dueSoon} value={`${analytics.metrics.dueSoon.count} · ${formatIdr(analytics.metrics.dueSoon.amount)}`} /><FinanceRow label={copy.outstanding} value={formatIdr(analytics.metrics.outstanding)} /></dl></CardContent></Card>
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-[.85fr_1.35fr]">
        <Card><CardContent><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{copy.projectWorkload}</p><h2 className="mt-2 font-display text-2xl font-extrabold">{copy.activeNow}</h2><dl className="mt-7 divide-y divide-border text-sm"><FinanceRow label={copy.awaiting} value={analytics.workload.awaiting} /><FinanceRow label={copy.delivery} value={analytics.workload.delivery} /><FinanceRow label={copy.review} value={analytics.workload.review} /><FinanceRow label={copy.onHold} value={analytics.workload.onHold} /><FinanceRow label={copy.completed} value={analytics.workload.completed} /></dl></CardContent></Card>
        <Card><CardContent><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{copy.attention}</p><h2 className="mt-2 font-display text-2xl font-extrabold">{copy.attention}</h2></div><CircleAlert className="size-5 text-primary" /></div>{attentionGroups.length === 0 ? <p className="mt-8 rounded-[12px] bg-accent-soft p-4 text-sm text-secondary">{copy.noAttention}</p> : <div className="mt-6 divide-y divide-border">{attentionGroups.map((group) => <div key={group.title} className="py-4 first:pt-0"><p className="mb-3 text-xs font-bold uppercase tracking-[.12em] text-secondary">{group.title} · {group.items.length}</p><div className="grid gap-2">{group.items.map((item) => <Link key={`${item.href}-${item.title}`} href={item.href} className="group flex items-center justify-between gap-4 rounded-[10px] px-2 py-2 text-sm hover:bg-accent-soft"><span><span className="font-semibold text-foreground">{item.title}</span><span className="ml-2 text-secondary">{item.detail}</span></span><span className="flex shrink-0 items-center gap-1 text-xs text-secondary">{item.date ? formatDate(item.date, locale) : "—"}<ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></Link>)}</div></div>)}</div>}</CardContent></Card>
      </section>
    </>}

    <p className="mt-8 text-xs leading-5 text-secondary">{copy.includedArchives}</p>
  </>;
}

function Metric({ icon: Icon, label, value, comparison, note }: { icon: typeof ClipboardList; label: string; value: string | number; comparison?: string | null; note?: string }) {
  return <div className="bg-surface p-5"><Icon className="size-5 text-primary" /><p className="mt-8 font-display text-3xl font-extrabold tracking-[-.035em]">{value}</p><p className="mt-2 text-sm font-semibold">{label}</p>{(comparison || note) && <p className="mt-1 text-xs text-secondary">{comparison ?? note}</p>}</div>;
}

function FunnelStep({ label, value, rate }: { label: string; value: number; rate: string | null }) {
  return <div className="border-l-2 border-primary pl-3"><p className="font-display text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm font-semibold leading-5">{label}</p>{rate && <p className="mt-2 text-xs text-secondary">{rate}</p>}</div>;
}

function Rate({ label, value, noData }: { label: string; value: number | null; noData: string }) {
  return <p><span className="text-secondary">{label}</span><span className="ml-2 font-semibold">{value === null ? noData : `${value}%`}</span></p>;
}

function FinanceRow({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"><dt className="text-secondary">{label}</dt><dd className={danger ? "font-semibold text-error" : "font-semibold"}>{value}</dd></div>;
}
