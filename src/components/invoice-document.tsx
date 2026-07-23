import { PrintButton } from "@/components/print-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIdr } from "@/lib/utils";

type InvoiceDocumentProps = {
  invoice: {
    invoiceNumber: string;
    status: string;
    currency: string;
    subtotal: { toString(): string };
    discount: { toString(): string };
    tax: { toString(): string };
    total: { toString(): string };
    paidAmount: { toString(): string };
    issuedAt: Date | null;
    dueDate: Date | null;
    notes: string | null;
    client: { name: string; email: string; companyName: string | null };
    project: { projectNumber: string; title: string };
    paymentSchedule: { title: string; description: string | null } | null;
  };
};

export function InvoiceDocument({ invoice }: InvoiceDocumentProps) {
  const date = (value: Date | null) => value?.toLocaleDateString("id-ID") ?? "—";
  const lineTitle = invoice.paymentSchedule?.title ?? "Project invoice";

  return (
    <section className="mt-5 overflow-hidden rounded-[20px] border border-[#17483b] bg-[#08251f] shadow-[0_24px_70px_rgba(7,31,26,.14)] print:mt-0 print:overflow-visible print:rounded-none print:border-0 print:bg-white print:shadow-none" aria-label="Invoice">
      <div className="flex flex-col justify-between gap-4 px-5 py-4 text-white sm:flex-row sm:items-center md:px-6 print:hidden">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#bde77e]">RRS / Invoice</p>
          <p className="mt-1 text-sm font-semibold text-white/80">{invoice.invoiceNumber} · {invoice.currency}</p>
        </div>
        <PrintButton />
      </div>

      <div className="border-t border-white/10 p-3 md:p-6 md:pt-5 print:border-0 print:p-0">
        <Card role="document" aria-labelledby="invoice-document-title" className="mx-auto max-w-[980px] rounded-[12px] border-0 bg-white text-[#151915] shadow-[0_20px_60px_rgba(0,0,0,.24)] print:max-w-none print:rounded-none print:shadow-none">
          <CardContent className="p-6 md:p-10 lg:p-12 print:p-0">
            <header className="flex flex-col justify-between gap-7 border-b border-[#dfe2dc] pb-8 sm:flex-row">
              <div>
                <div className="h-1 w-16 bg-[#175c46]" aria-hidden="true" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.18em] text-[#687069]">Invoice</p>
                <h1 id="invoice-document-title" className="mt-2 font-display text-3xl font-extrabold tracking-[-.035em] text-[#111511] md:text-4xl">{invoice.invoiceNumber}</h1>
                <p className="mt-3 text-sm font-semibold text-[#687069]">{invoice.project.projectNumber}</p>
              </div>
              <div className="sm:text-right">
                <Badge className="bg-[#e7f0eb] text-[#175c46]">{invoice.status.replaceAll("_", " ")}</Badge>
                <dl className="mt-4 grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-xs text-[#687069] sm:justify-end">
                  <dt>Issued</dt>
                  <dd className="font-semibold text-[#303731] tabular-nums">{date(invoice.issuedAt)}</dd>
                  <dt>Due</dt>
                  <dd className="font-semibold text-[#303731] tabular-nums">{date(invoice.dueDate)}</dd>
                  <dt>Currency</dt>
                  <dd className="font-semibold text-[#303731]">{invoice.currency}</dd>
                </dl>
              </div>
            </header>

            <section className="border-b border-[#dfe2dc] py-8" aria-label="Invoice parties and project">
              <div className="grid gap-px overflow-hidden rounded-[10px] border border-[#dfe2dc] bg-[#dfe2dc] sm:grid-cols-2">
                <div className="bg-[#f7f8f5] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#687069]">Bill to</p>
                  <address className="mt-2 not-italic">
                    <p className="font-semibold text-[#1b211c]">{invoice.client.name}</p>
                    {invoice.client.companyName && <p className="mt-1 text-sm text-[#687069]">{invoice.client.companyName}</p>}
                    <p className="text-sm text-[#687069]">{invoice.client.email}</p>
                  </address>
                </div>
                <div className="bg-[#f7f8f5] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#687069]">Project</p>
                  <p className="mt-2 font-semibold text-[#1b211c]">{invoice.project.title}</p>
                  <p className="mt-1 text-sm text-[#687069]">{invoice.paymentSchedule?.title}</p>
                </div>
              </div>
            </section>

            <section className="py-8" aria-labelledby="invoice-charges-title">
              <h2 id="invoice-charges-title" className="font-display text-xl font-extrabold tracking-[-.02em] text-[#182019]">Invoice details</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm print:min-w-0">
                  <caption className="sr-only">Invoice details</caption>
                  <thead className="border-y border-[#dfe2dc] bg-[#f7f8f5] text-[10px] uppercase tracking-[.13em] text-[#687069]">
                    <tr>
                      <th scope="col" className="px-3 py-3 font-bold">Description</th>
                      <th scope="col" className="px-3 py-3 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#dfe2dc]">
                      <th scope="row" className="px-3 py-5 text-left font-normal">
                        <p className="font-semibold text-[#1b211c]">{lineTitle}</p>
                        <p className="mt-1 text-sm font-normal leading-6 text-[#687069]">{invoice.paymentSchedule?.description}</p>
                      </th>
                      <td className="px-3 py-5 text-right font-semibold text-[#1b211c] tabular-nums">{formatIdr(invoice.subtotal.toString())}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <dl className="ml-auto mt-7 max-w-sm rounded-[10px] border border-[#dfe2dc] bg-[#fafbf8] px-4 py-3 text-sm">
                <SummaryRow label="Subtotal" value={formatIdr(invoice.subtotal.toString())} />
                <SummaryRow label="Discount" value={`- ${formatIdr(invoice.discount.toString())}`} />
                <SummaryRow label="Tax" value={formatIdr(invoice.tax.toString())} />
                <SummaryRow label="Total" value={formatIdr(invoice.total.toString())} strong />
                <SummaryRow label="Paid" value={formatIdr(invoice.paidAmount.toString())} />
              </dl>

              {invoice.notes && (
                <aside className="mt-8 rounded-[10px] border border-[#dfe2dc] bg-[#f7f8f5] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#687069]">Notes</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5f675f]">{invoice.notes}</p>
                </aside>
              )}
            </section>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5 py-2.5 ${strong ? "mt-1 border-t border-[#cfd5cf] pt-3 font-display text-lg font-extrabold text-[#175c46]" : ""}`}>
      <dt>{label}</dt>
      <dd className={`min-w-0 break-words text-right tabular-nums ${strong ? "" : "font-semibold text-[#2a302b]"}`}>{value}</dd>
    </div>
  );
}
