import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PrintButton } from "@/components/print-button";
import type { AgreementSnapshot } from "@/features/agreements/content";
import { formatIdr } from "@/lib/utils";

type AgreementDocumentProps = {
  agreement: { agreementNumber: string; version: number; status: string; createdAt: Date; acceptedAt: Date | null; acceptedByName: string | null; acceptedByEmail: string | null; acceptanceIp?: string | null; acceptanceAgent?: string | null };
  project: { projectNumber: string; title: string };
  snapshot: AgreementSnapshot;
  locale: "id" | "en";
  showAudit?: boolean;
};

const copy = {
  id: { agreement: "Project Agreement", project: "Proyek", parties: "Para pihak", client: "Client", commercial: "Nilai komersial", scope: "Scope pekerjaan", included: "Termasuk", excluded: "Tidak termasuk", payment: "Jadwal pembayaran", timeline: "Timeline dan batas kerja", revisions: "Batas revisi", maintenance: "Masa maintenance", days: "hari", terms: "Ketentuan kolaborasi", customTerms: "Ketentuan khusus project", acceptance: "Bukti persetujuan", acceptedBy: "Disetujui oleh", acceptedAt: "Disetujui pada", issued: "Diterbitkan", print: "Print / Save PDF", noScope: "Tidak ada detail yang tercatat.", noTerms: "Tidak ada ketentuan khusus tambahan.", quantity: "Qty", unitPrice: "Harga satuan", total: "Total", trigger: "Pemicu", reference: "Referensi quotation" },
  en: { agreement: "Project Agreement", project: "Project", parties: "Parties", client: "Client", commercial: "Commercial summary", scope: "Project scope", included: "Included", excluded: "Excluded", payment: "Payment schedule", timeline: "Timeline and boundaries", revisions: "Revision limit", maintenance: "Maintenance period", days: "days", terms: "Collaboration terms", customTerms: "Project-specific terms", acceptance: "Acceptance record", acceptedBy: "Accepted by", acceptedAt: "Accepted at", issued: "Issued", print: "Print / Save PDF", noScope: "No detail was recorded.", noTerms: "No additional project-specific terms.", quantity: "Qty", unitPrice: "Unit price", total: "Total", trigger: "Trigger", reference: "Quotation reference" },
} as const;

export function AgreementDocument({ agreement, project, snapshot, locale, showAudit = false }: AgreementDocumentProps) {
  const t = copy[locale];
  const date = (value: Date | string | null) => value ? new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(value)) : "—";
  return <>
    <div className="flex justify-end print:hidden"><PrintButton /></div>
    <Card className="mt-5 print:border-0 print:shadow-none"><CardContent className="p-6 md:p-10">
      <header className="flex flex-col justify-between gap-6 border-b border-border pb-7 sm:flex-row">
        <div><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary">{t.agreement}</p><h1 className="mt-2 font-display text-3xl font-extrabold">{agreement.agreementNumber}</h1><p className="mt-2 text-sm text-secondary">{project.projectNumber} · {t.reference}: {snapshot.quotation.number} v{snapshot.quotation.version}</p></div>
        <div className="sm:text-right"><Badge>{agreement.status}</Badge><p className="mt-3 text-xs text-secondary">{t.issued} {date(agreement.createdAt)}</p><p className="text-xs text-secondary">{project.title}</p></div>
      </header>

      <section className="grid gap-8 border-b border-border py-7 sm:grid-cols-2"><DocumentParty title={t.client} name={snapshot.client.name} company={snapshot.client.companyName} email={snapshot.client.email} /><div><p className="text-xs font-bold uppercase tracking-wide text-secondary">{t.project}</p><p className="mt-2 font-semibold">{snapshot.project.title}</p><p className="mt-1 text-sm text-secondary">{snapshot.project.type}</p><p className="mt-3 whitespace-pre-line text-sm leading-6 text-secondary">{snapshot.project.summary}</p></div></section>

      <section className="border-b border-border py-7"><SectionTitle>{t.commercial}</SectionTitle><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wide text-secondary"><tr><th className="pb-3">{t.scope}</th><th className="pb-3 text-right">{t.quantity}</th><th className="pb-3 text-right">{t.unitPrice}</th><th className="pb-3 text-right">{t.total}</th></tr></thead><tbody>{snapshot.items.map((item, index) => <tr key={`${item.title}-${index}`} className="border-b border-border last:border-0"><td className="py-4"><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs text-secondary">{item.description}</p></td><td className="py-4 text-right">{item.quantity}</td><td className="py-4 text-right">{formatIdr(item.unitPrice)}</td><td className="py-4 text-right font-semibold">{formatIdr(item.total)}</td></tr>)}</tbody></table></div><div className="ml-auto mt-6 max-w-sm space-y-2 text-sm"><SummaryRow label="Subtotal" value={formatIdr(snapshot.commercial.subtotal)} /><SummaryRow label="Discount" value={`- ${formatIdr(snapshot.commercial.discount)}`} /><SummaryRow label="Tax" value={formatIdr(snapshot.commercial.tax)} /><SummaryRow label={t.total} value={formatIdr(snapshot.commercial.total)} strong /></div></section>

      <section className="grid gap-7 border-b border-border py-7 md:grid-cols-2"><div><SectionTitle>{t.scope}</SectionTitle><DocumentText label={t.included} value={snapshot.scopeIncluded} fallback={t.noScope} /><DocumentText label={t.excluded} value={snapshot.scopeExcluded} fallback={t.noScope} /></div><div><SectionTitle>{t.timeline}</SectionTitle><dl className="mt-4 divide-y divide-border text-sm"><SummaryRow label="Start" value={date(snapshot.project.estimatedStartDate)} /><SummaryRow label="Completion" value={date(snapshot.project.estimatedCompletionAt)} /><SummaryRow label={t.revisions} value={snapshot.revisionLimit ?? "—"} /><SummaryRow label={t.maintenance} value={snapshot.maintenanceDays === null ? "—" : `${snapshot.maintenanceDays} ${t.days}`} /></dl></div></section>

      <section className="border-b border-border py-7"><SectionTitle>{t.payment}</SectionTitle><div className="mt-4 divide-y divide-border">{snapshot.paymentTerms.length ? snapshot.paymentTerms.map((term) => <div key={term.sequence} className="flex flex-col justify-between gap-2 py-4 sm:flex-row"><div><p className="font-semibold">{term.title}</p><p className="mt-1 text-sm text-secondary">{term.description}</p><p className="mt-1 text-xs text-secondary">{t.trigger}: {term.dueTrigger}{term.percentage ? ` · ${term.percentage}%` : ""}</p></div><p className="font-semibold text-primary">{formatIdr(term.amount)}</p></div>) : <p className="text-sm text-secondary">{t.noScope}</p>}</div></section>

      <section className="border-b border-border py-7"><SectionTitle>{t.terms}</SectionTitle><ol className="mt-5 space-y-5">{snapshot.standardClauses.map((clause, index) => <li key={clause.title} className="grid grid-cols-[28px_1fr] gap-3"><span className="grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-bold text-primary">{index + 1}</span><div><p className="font-semibold">{clause.title}</p><p className="mt-1 text-sm leading-6 text-secondary">{clause.body}</p></div></li>)}</ol><div className="mt-7 rounded-[12px] bg-surface-container/60 p-4"><p className="font-semibold">{t.customTerms}</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-secondary">{snapshot.ownerTerms || t.noTerms}</p></div></section>

      {agreement.acceptedAt && <section className="pt-7"><SectionTitle>{t.acceptance}</SectionTitle><dl className="mt-4 divide-y divide-border text-sm"><SummaryRow label={t.acceptedBy} value={`${agreement.acceptedByName ?? "—"}${agreement.acceptedByEmail ? ` · ${agreement.acceptedByEmail}` : ""}`} /><SummaryRow label={t.acceptedAt} value={date(agreement.acceptedAt)} />{showAudit && <><SummaryRow label="IP" value={agreement.acceptanceIp ?? "—"} /><SummaryRow label="User agent" value={agreement.acceptanceAgent ?? "—"} /></>}</dl></section>}
    </CardContent></Card>
  </>;
}

function SectionTitle({ children }: { children: React.ReactNode }) { return <h2 className="font-display text-xl font-extrabold">{children}</h2>; }
function DocumentParty({ title, name, company, email }: { title: string; name: string; company: string | null; email: string | null }) { return <div><p className="text-xs font-bold uppercase tracking-wide text-secondary">{title}</p><p className="mt-2 font-semibold">{name}</p><p className="text-sm text-secondary">{company}</p><p className="text-sm text-secondary">{email}</p></div>; }
function DocumentText({ label, value, fallback }: { label: string; value: string | null; fallback: string }) { return <div className="mt-4"><p className="text-sm font-semibold">{label}</p><p className="mt-1 whitespace-pre-line text-sm leading-6 text-secondary">{value || fallback}</p></div>; }
function SummaryRow({ label, value, strong = false }: { label: string; value: string | number; strong?: boolean }) { return <div className={`flex justify-between gap-5 py-2 ${strong ? "border-t border-border pt-3 font-display text-xl font-extrabold text-primary" : ""}`}><span>{label}</span><span className={strong ? "" : "text-right font-semibold"}>{value}</span></div>; }
