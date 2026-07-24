import { PrintButton } from "@/components/print-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  id: { agreement: "Project Agreement", project: "Proyek", parties: "Para pihak", client: "Client", commercial: "Nilai komersial", scope: "Scope pekerjaan", included: "Termasuk", excluded: "Tidak termasuk", payment: "Jadwal pembayaran", timeline: "Timeline dan batas kerja", revisions: "Batas revisi", maintenance: "Masa maintenance", days: "hari", terms: "Ketentuan kolaborasi", customTerms: "Ketentuan khusus project", acceptance: "Bukti persetujuan", acceptedBy: "Disetujui oleh", acceptedAt: "Disetujui pada", issued: "Diterbitkan", print: "Print / Save PDF", noScope: "Tidak ada detail yang tercatat.", noTerms: "Tidak ada ketentuan khusus tambahan.", quantity: "Qty", unitPrice: "Harga satuan", total: "Total", trigger: "Pemicu", reference: "Referensi quotation", version: "Versi" },
  en: { agreement: "Project Agreement", project: "Project", parties: "Parties", client: "Client", commercial: "Commercial summary", scope: "Project scope", included: "Included", excluded: "Excluded", payment: "Payment schedule", timeline: "Timeline and boundaries", revisions: "Revision limit", maintenance: "Maintenance period", days: "days", terms: "Collaboration terms", customTerms: "Project-specific terms", acceptance: "Acceptance record", acceptedBy: "Accepted by", acceptedAt: "Accepted at", issued: "Issued", print: "Print / Save PDF", noScope: "No detail was recorded.", noTerms: "No additional project-specific terms.", quantity: "Qty", unitPrice: "Unit price", total: "Total", trigger: "Trigger", reference: "Quotation reference", version: "Version" },
} as const;

export function AgreementDocument({ agreement, project, snapshot, locale, showAudit = false }: AgreementDocumentProps) {
  const t = copy[locale];
  const date = (value: Date | string | null) => value ? new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(value)) : "—";

  return (
    <section className="mt-5 overflow-hidden rounded-[20px] border border-[#17483b] bg-[#08251f] shadow-[0_24px_70px_rgba(7,31,26,.14)] print:mt-0 print:overflow-visible print:rounded-none print:border-0 print:bg-white print:shadow-none" aria-label={t.agreement}>
      <div className="flex flex-col justify-between gap-4 px-5 py-4 text-white sm:flex-row sm:items-center md:px-6 print:hidden">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#bde77e]">RRS / {t.agreement}</p>
          <p className="mt-1 text-sm font-semibold text-white/80">{agreement.agreementNumber} · {t.version} {agreement.version}</p>
        </div>
        <PrintButton />
      </div>

      <div className="border-t border-white/10 p-3 md:p-6 md:pt-5 print:border-0 print:p-0">
        <Card role="document" aria-labelledby="agreement-document-title" className="mx-auto max-w-[1080px] rounded-[12px] border-0 bg-white text-[#151915] shadow-[0_20px_60px_rgba(0,0,0,.24)] print:max-w-none print:rounded-none print:shadow-none">
          <CardContent className="p-6 md:p-10 lg:p-12 print:p-0">
            <header className="flex flex-col justify-between gap-7 border-b border-[#dfe2dc] pb-8 sm:flex-row">
              <div>
                <div className="h-1 w-16 bg-[#175c46]" aria-hidden="true" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.18em] text-[#687069]">{t.agreement}</p>
                <h2 id="agreement-document-title" className="mt-2 font-display text-3xl font-extrabold tracking-[-.035em] text-[#111511] md:text-4xl">{agreement.agreementNumber}</h2>
                <p className="mt-3 text-sm leading-6 text-[#687069]">
                  {project.projectNumber} · {t.reference}: {snapshot.quotation.number} v{snapshot.quotation.version} · {t.version} {agreement.version}
                </p>
              </div>
              <div className="sm:max-w-xs sm:text-right">
                <Badge className="bg-[#e7f0eb] text-[#175c46]">{agreement.status}</Badge>
                <p className="mt-4 text-xs font-medium text-[#687069]">{t.issued} {date(agreement.createdAt)}</p>
                <p className="mt-1 text-sm font-semibold text-[#242a25]">{project.title}</p>
              </div>
            </header>

            <section className="border-b border-[#dfe2dc] py-8" aria-labelledby="agreement-parties-title">
              <SectionTitle id="agreement-parties-title">{t.parties}</SectionTitle>
              <div className="mt-5 grid gap-px overflow-hidden rounded-[10px] border border-[#dfe2dc] bg-[#dfe2dc] sm:grid-cols-2">
                <DocumentParty title={t.client} name={snapshot.client.name} company={snapshot.client.companyName} email={snapshot.client.email} />
                <div className="bg-[#f7f8f5] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#687069]">{t.project}</p>
                  <p className="mt-2 font-semibold text-[#1b211c]">{snapshot.project.title}</p>
                  <p className="mt-1 text-sm text-[#687069]">{snapshot.project.type}</p>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#4f5750]">{snapshot.project.summary}</p>
                </div>
              </div>
            </section>

            <section className="border-b border-[#dfe2dc] py-8" aria-labelledby="agreement-commercial-title">
              <SectionTitle id="agreement-commercial-title">{t.commercial}</SectionTitle>
              <div role="region" aria-label={t.commercial} tabIndex={0} className="mt-5 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#175c46]">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm print:min-w-0">
                  <caption className="sr-only">{t.commercial}</caption>
                  <thead className="border-y border-[#dfe2dc] bg-[#f7f8f5] text-[10px] uppercase tracking-[.13em] text-[#687069]">
                    <tr>
                      <th scope="col" className="px-3 py-3 font-bold">{t.scope}</th>
                      <th scope="col" className="px-3 py-3 text-right font-bold">{t.quantity}</th>
                      <th scope="col" className="px-3 py-3 text-right font-bold">{t.unitPrice}</th>
                      <th scope="col" className="px-3 py-3 text-right font-bold">{t.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.items.map((item, index) => (
                      <tr key={`${item.title}-${index}`} className="border-b border-[#e6e8e3] last:border-0">
                        <th scope="row" className="px-3 py-4 text-left font-normal">
                          <p className="font-semibold text-[#1b211c]">{item.title}</p>
                          <p className="mt-1 text-xs font-normal leading-5 text-[#687069]">{item.description}</p>
                        </th>
                        <td className="px-3 py-4 text-right tabular-nums">{item.quantity}</td>
                        <td className="px-3 py-4 text-right tabular-nums">{formatIdr(item.unitPrice)}</td>
                        <td className="px-3 py-4 text-right font-semibold tabular-nums">{formatIdr(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="ml-auto mt-7 max-w-sm rounded-[10px] border border-[#dfe2dc] bg-[#fafbf8] px-4 py-3 text-sm">
                <SummaryRow label="Subtotal" value={formatIdr(snapshot.commercial.subtotal)} />
                <SummaryRow label="Discount" value={`- ${formatIdr(snapshot.commercial.discount)}`} />
                <SummaryRow label="Tax" value={formatIdr(snapshot.commercial.tax)} />
                <SummaryRow label={t.total} value={formatIdr(snapshot.commercial.total)} strong />
              </dl>
            </section>

            <div className="grid gap-8 border-b border-[#dfe2dc] py-8 md:grid-cols-2">
              <section aria-labelledby="agreement-scope-title">
                <SectionTitle id="agreement-scope-title">{t.scope}</SectionTitle>
                <DocumentText label={t.included} value={snapshot.scopeIncluded} fallback={t.noScope} />
                <DocumentText label={t.excluded} value={snapshot.scopeExcluded} fallback={t.noScope} />
              </section>
              <section aria-labelledby="agreement-timeline-title">
                <SectionTitle id="agreement-timeline-title">{t.timeline}</SectionTitle>
                <dl className="mt-4 divide-y divide-[#dfe2dc] text-sm">
                  <SummaryRow label="Start" value={date(snapshot.project.estimatedStartDate)} />
                  <SummaryRow label="Completion" value={date(snapshot.project.estimatedCompletionAt)} />
                  <SummaryRow label={t.revisions} value={snapshot.revisionLimit ?? "—"} />
                  <SummaryRow label={t.maintenance} value={snapshot.maintenanceDays === null ? "—" : `${snapshot.maintenanceDays} ${t.days}`} />
                </dl>
              </section>
            </div>

            <section className="border-b border-[#dfe2dc] py-8" aria-labelledby="agreement-payment-title">
              <SectionTitle id="agreement-payment-title">{t.payment}</SectionTitle>
              {snapshot.paymentTerms.length ? (
                <ol className="mt-5 divide-y divide-[#dfe2dc] border-y border-[#dfe2dc]">
                  {snapshot.paymentTerms.map((term) => (
                    <li key={term.sequence} className="grid gap-4 py-5 sm:grid-cols-[40px_minmax(0,1fr)_auto] sm:items-start">
                      <span className="grid size-8 place-items-center rounded-full bg-[#e7f0eb] text-xs font-bold text-[#175c46]" aria-hidden="true">{String(term.sequence).padStart(2, "0")}</span>
                      <div>
                        <p className="font-semibold text-[#1b211c]">{term.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#687069]">{term.description}</p>
                        <p className="mt-2 text-xs text-[#687069]">{t.trigger}: {term.dueTrigger}{term.percentage ? ` · ${term.percentage}%` : ""}</p>
                      </div>
                      <p className="font-display text-lg font-extrabold text-[#175c46] tabular-nums sm:text-right">{formatIdr(term.amount)}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-[#687069]">{t.noScope}</p>
              )}
            </section>

            <section className="border-b border-[#dfe2dc] py-8" aria-labelledby="agreement-terms-title">
              <SectionTitle id="agreement-terms-title">{t.terms}</SectionTitle>
              <ol className="mt-6 space-y-5">
                {snapshot.standardClauses.map((clause, index) => (
                  <li key={clause.title} className="grid break-inside-avoid grid-cols-[32px_1fr] gap-4">
                    <span className="grid size-8 place-items-center rounded-full border border-[#cfd8d1] text-xs font-bold text-[#175c46]" aria-hidden="true">{index + 1}</span>
                    <div>
                      <p className="font-semibold text-[#1b211c]">{clause.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5f675f]">{clause.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <aside className="mt-7 rounded-[10px] border border-[#dfe2dc] bg-[#f7f8f5] p-5">
                <p className="font-semibold text-[#1b211c]">{t.customTerms}</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5f675f]">{snapshot.ownerTerms || t.noTerms}</p>
              </aside>
            </section>

            {agreement.acceptedAt && (
              <section className="pt-8" aria-labelledby="agreement-acceptance-title">
                <div className="rounded-[10px] border border-[#bfd2c5] bg-[#f2f7f3] p-5 md:p-6">
                  <SectionTitle id="agreement-acceptance-title">{t.acceptance}</SectionTitle>
                  <dl className="mt-4 divide-y divide-[#d5e1d8] text-sm">
                    <SummaryRow label={t.acceptedBy} value={`${agreement.acceptedByName ?? "—"}${agreement.acceptedByEmail ? ` · ${agreement.acceptedByEmail}` : ""}`} />
                    <SummaryRow label={t.acceptedAt} value={date(agreement.acceptedAt)} />
                    {showAudit && (
                      <>
                        <SummaryRow label="IP" value={agreement.acceptanceIp ?? "—"} />
                        <SummaryRow label="User agent" value={agreement.acceptanceAgent ?? "—"} />
                      </>
                    )}
                  </dl>
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h3 id={id} className="font-display text-xl font-extrabold tracking-[-.02em] text-[#182019]">{children}</h3>;
}

function DocumentParty({ title, name, company, email }: { title: string; name: string; company: string | null; email: string | null }) {
  return (
    <div className="bg-[#f7f8f5] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#687069]">{title}</p>
      <p className="mt-2 font-semibold text-[#1b211c]">{name}</p>
      {company && <p className="mt-1 text-sm text-[#687069]">{company}</p>}
      {email && <p className="text-sm text-[#687069]">{email}</p>}
    </div>
  );
}

function DocumentText({ label, value, fallback }: { label: string; value: string | null; fallback: string }) {
  return (
    <div className="mt-5 border-l-2 border-[#bdd0c2] pl-4">
      <p className="text-sm font-semibold text-[#1b211c]">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#5f675f]">{value || fallback}</p>
    </div>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string | number; strong?: boolean }) {
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5 py-2.5 ${strong ? "mt-1 border-t border-[#cfd5cf] pt-3 font-display text-lg font-extrabold text-[#175c46]" : ""}`}>
      <dt>{label}</dt>
      <dd className={`min-w-0 break-words text-right tabular-nums ${strong ? "" : "font-semibold text-[#2a302b]"}`}>{value}</dd>
    </div>
  );
}
