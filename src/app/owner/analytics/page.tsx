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

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#19483d] bg-[#071f1a] text-white shadow-[0_24px_70px_rgba(7,31,26,.16)]">
      <header className="border-b border-white/10 px-5 py-7 md:px-7 md:py-9 lg:px-9">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#bde77e]">{copy.eyebrow}</p>
            <h1 id="analytics-title" className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-[-.05em] text-white md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">{copy.description}</p>
          </div>

          <div className="border-l border-[#bde77e]/45 pl-5 lg:justify-self-end lg:text-right">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/45">{copy.currentPeriod}</p>
            <p className="mt-2 font-display text-lg font-bold text-white">{formatDateRange(analytics.range.start, analytics.range.end, locale)}</p>
            <nav className="mt-5 flex flex-wrap gap-2 lg:justify-end" aria-label={copy.currentPeriod}>
              {analyticsPeriods.map((period) => {
                const isCurrent = analytics.period === period;
                return (
                  <Button
                    key={period}
                    asChild
                    size="sm"
                    variant={isCurrent ? "primary" : "outline"}
                    className={isCurrent
                      ? "bg-[#bde77e] text-[#09261f] hover:bg-[#c9ef91]"
                      : "border-white/15 bg-transparent text-white/70 hover:border-[#bde77e]/50 hover:bg-white/[.06] hover:text-white"}
                  >
                    <Link href={`/owner/analytics?period=${period}`} aria-current={isCurrent ? "page" : undefined}>{periodLabels[period]}</Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {isEmpty ? (
        <section className="p-4 md:p-7 lg:p-9" aria-labelledby="analytics-empty-title">
          <Card className="border-dashed border-white/20 bg-[#0b2b24] text-white">
            <CardContent className="py-14 text-center md:py-16">
              <span className="mx-auto grid size-12 place-items-center rounded-full border border-[#bde77e]/30 bg-[#bde77e]/10">
                <ClipboardList className="size-5 text-[#bde77e]" aria-hidden="true" />
              </span>
              <h2 id="analytics-empty-title" className="mt-5 font-display text-2xl font-extrabold text-white">{copy.noDataTitle}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/60">{copy.noDataDescription}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-[#bde77e] text-[#09261f] hover:bg-[#c9ef91]"><Link href="/owner/inquiries">{dictionary.portal.inquiries}</Link></Button>
                <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:border-[#bde77e]/50 hover:bg-white/[.06]"><Link href="/owner/quotations/create">{dictionary.portal.quotations}</Link></Button>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        <div className="p-4 md:p-7 lg:p-9">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-12" aria-label={copy.eyebrow}>
            <Metric className="xl:col-span-3" icon={ClipboardList} label={copy.inquiries} value={analytics.current.inquiries} comparison={comparisonLabel(analytics.current.inquiries, comparison?.inquiries ?? null, copy.previousPeriod)} />
            <Metric className="xl:col-span-3" icon={FileText} label={copy.quotationsSent} value={analytics.current.sentQuotations} comparison={comparisonLabel(analytics.current.sentQuotations, comparison?.sentQuotations ?? null, copy.previousPeriod)} />
            <Metric className="md:col-span-2 xl:col-span-6" featured icon={FileText} label={copy.acceptedValue} value={formatIdr(analytics.current.acceptedQuotationValue)} comparison={comparison ? `${copy.previousPeriod}: ${formatIdr(comparison.acceptedQuotationValue)}` : null} />
            <Metric className="xl:col-span-5" icon={BanknoteArrowDown} label={copy.cashReceived} value={formatIdr(analytics.current.cashReceived)} comparison={comparison ? `${copy.previousPeriod}: ${formatIdr(comparison.cashReceived)}` : null} />
            <Metric className="xl:col-span-4" icon={ReceiptText} label={copy.outstanding} value={formatIdr(analytics.metrics.outstanding)} note={copy.activeNow} />
            <Metric className="md:col-span-2 xl:col-span-3" icon={UsersRound} label={copy.activeClients} value={analytics.metrics.activeClients} note={copy.activeNow} />
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <Card className="border-white/10 bg-[#0a2922] text-white">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bde77e]">{copy.operationalPipeline}</p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-white">Inquiry → Project</h2>
                  </div>
                  <Badge variant="neutral" className="w-fit bg-white/[.07] text-white/60">{copy.funnelNote}</Badge>
                </div>

                <ol className="mt-7 grid gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
                  <FunnelStep label={copy.inquiries} value={analytics.funnel.inquiries} rate={null} />
                  <FunnelStep label={copy.quotationsSent} value={analytics.funnel.quotations} rate={analytics.funnel.quotationRate === null ? copy.noConversion : `${analytics.funnel.quotationRate}%`} />
                  <FunnelStep label={copy.acceptedQuotations} value={analytics.funnel.accepted} rate={analytics.funnel.acceptanceRate === null ? copy.noConversion : `${analytics.funnel.acceptanceRate}%`} />
                  <FunnelStep label={dictionary.portal.projects} value={analytics.funnel.projects} rate={analytics.funnel.projectRate === null ? copy.noConversion : `${analytics.funnel.projectRate}%`} />
                </ol>

                <dl className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-3">
                  <Rate label={copy.quotationRate} value={analytics.funnel.quotationRate} noData={copy.noConversion} />
                  <Rate label={copy.acceptanceRate} value={analytics.funnel.acceptanceRate} noData={copy.noConversion} />
                  <Rate label={copy.projectRate} value={analytics.funnel.projectRate} noData={copy.noConversion} />
                </dl>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0a2922] text-white">
              <CardContent className="p-5 md:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bde77e]">{copy.financialHealth}</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{copy.activeNow}</h2>
                <dl className="mt-7 divide-y divide-white/10 text-sm">
                  <FinanceRow label={copy.overdue} value={`${analytics.metrics.overdue.count} · ${formatIdr(analytics.metrics.overdue.amount)}`} danger />
                  <FinanceRow label={copy.dueSoon} value={`${analytics.metrics.dueSoon.count} · ${formatIdr(analytics.metrics.dueSoon.amount)}`} />
                  <FinanceRow label={copy.outstanding} value={formatIdr(analytics.metrics.outstanding)} />
                </dl>
              </CardContent>
            </Card>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[.65fr_1.35fr]">
            <Card className="border-white/10 bg-[#0a2922] text-white">
              <CardContent className="p-5 md:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bde77e]">{copy.projectWorkload}</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{copy.activeNow}</h2>
                <dl className="mt-7 divide-y divide-white/10 text-sm">
                  <FinanceRow label={copy.awaiting} value={analytics.workload.awaiting} />
                  <FinanceRow label={copy.delivery} value={analytics.workload.delivery} />
                  <FinanceRow label={copy.review} value={analytics.workload.review} />
                  <FinanceRow label={copy.onHold} value={analytics.workload.onHold} />
                  <FinanceRow label={copy.completed} value={analytics.workload.completed} />
                </dl>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0a2922] text-white">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#bde77e]">{copy.attention}</p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{copy.attention}</h2>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#bde77e]/25 bg-[#bde77e]/10">
                    <CircleAlert className="size-4 text-[#bde77e]" aria-hidden="true" />
                  </span>
                </div>

                {attentionGroups.length === 0 ? (
                  <p className="mt-7 rounded-[10px] border border-[#bde77e]/15 bg-[#bde77e]/[.07] p-4 text-sm leading-6 text-white/65">{copy.noAttention}</p>
                ) : (
                  <div className="mt-5 divide-y divide-white/10">
                    {attentionGroups.map((group) => (
                      <section key={group.title} className="py-5 first:pt-0 last:pb-0" aria-label={group.title}>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-white/45">{group.title} · {group.items.length}</p>
                        <div className="grid gap-1">
                          {group.items.map((item) => (
                            <Link
                              key={`${item.href}-${item.title}`}
                              href={item.href}
                              className="group grid gap-2 rounded-[9px] border border-transparent px-3 py-3 text-sm hover:border-white/10 hover:bg-white/[.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bde77e] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                            >
                              <span className="min-w-0">
                                <span className="font-semibold text-white">{item.title}</span>
                                <span className="ml-2 text-white/55">{item.detail}</span>
                              </span>
                              <span className="flex shrink-0 items-center gap-1.5 text-xs text-white/45">
                                {item.date ? formatDate(item.date, locale) : "—"}
                                <ArrowUpRight className="size-3 text-[#bde77e]" aria-hidden="true" />
                              </span>
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      )}

      <p className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-white/45 md:px-7 lg:px-9">{copy.includedArchives}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value, comparison, note, className = "", featured = false }: { icon: typeof ClipboardList; label: string; value: string | number; comparison?: string | null; note?: string; className?: string; featured?: boolean }) {
  return (
    <article className={`flex min-h-48 flex-col justify-between rounded-[14px] border p-5 ${featured ? "border-[#bde77e]/30 bg-[#10382e]" : "border-white/10 bg-[#0a2922]"} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`grid size-9 place-items-center rounded-full ${featured ? "bg-[#bde77e] text-[#09261f]" : "border border-white/10 bg-white/[.05] text-[#bde77e]"}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        {(comparison || note) && <p className="max-w-[70%] text-right text-xs leading-5 text-white/45">{comparison ?? note}</p>}
      </div>
      <div className="mt-8">
        <p className="break-words font-display text-[clamp(1.75rem,3vw,2.6rem)] font-extrabold leading-none tracking-[-.045em] text-white tabular-nums">{value}</p>
        <p className="mt-3 text-sm font-semibold text-white/75">{label}</p>
      </div>
    </article>
  );
}

function FunnelStep({ label, value, rate }: { label: string; value: number; rate: string | null }) {
  return (
    <li className="flex min-h-36 flex-col justify-between bg-[#0d3028] p-4">
      <p className="font-display text-3xl font-extrabold text-white tabular-nums">{value}</p>
      <div className="mt-5 border-l-2 border-[#bde77e] pl-3">
        <p className="text-sm font-semibold leading-5 text-white/80">{label}</p>
        {rate && <p className="mt-1 text-xs text-white/45">{rate}</p>}
      </div>
    </li>
  );
}

function Rate({ label, value, noData }: { label: string; value: number | null; noData: string }) {
  return (
    <div>
      <dt className="text-xs text-white/45">{label}</dt>
      <dd className="mt-1 font-semibold text-white tabular-nums">{value === null ? noData : `${value}%`}</dd>
    </div>
  );
}

function FinanceRow({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <dt className="text-white/50">{label}</dt>
      <dd className={danger ? "text-right font-semibold text-[#ff9f94] tabular-nums" : "text-right font-semibold text-white tabular-nums"}>{value}</dd>
    </div>
  );
}
