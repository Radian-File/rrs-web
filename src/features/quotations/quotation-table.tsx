import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { RecordCheckbox } from "@/components/bulk-archive-controls";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WorkspaceTableViewport } from "@/components/workspace/table-viewport";
import { formatIdr } from "@/lib/utils";

type QuotationRecord = Prisma.QuotationGetPayload<Record<string, never>>;

const variant = (status: string) => status === "ACCEPTED" ? "success" : status === "REJECTED" || status === "CANCELLED" || status === "EXPIRED" ? "error" : status === "REVISION_REQUESTED" ? "warning" : "default" as const;

export function QuotationTable({ quotations, empty, archived = false, selectable = false }: { quotations: QuotationRecord[]; empty: string; archived?: boolean; selectable?: boolean }) {
  const label = archived ? "Archived quotation records" : "Current quotation records";
  return <Card className="mt-6 overflow-hidden"><CardContent className="p-0"><WorkspaceTableViewport label={label}><table className="w-full min-w-[820px] text-left text-sm"><caption className="sr-only">{label}</caption><thead className="border-b border-border bg-surface-container/50 text-xs uppercase tracking-wide text-secondary"><tr>{selectable&&<th className="px-5 py-4" aria-label="Select">Select</th>}<th className="px-5 py-4">Quotation</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Project</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Valid until</th><th className="px-5 py-4">Status</th>{archived && <th className="px-5 py-4">Archived</th>}</tr></thead><tbody>{quotations.map((quote) => <tr key={quote.id} className="border-b border-border last:border-0 hover:bg-accent-soft/40">{selectable&&<td className="px-5 py-4"><RecordCheckbox id={quote.id}/></td>}<td className="px-5 py-4"><Link href={`/owner/quotations/${quote.id}`} className="font-semibold text-primary hover:underline">{quote.quotationNumber}</Link><p className="mt-1 text-xs text-secondary">Version {quote.version}</p></td><td className="px-5 py-4">{quote.clientName}</td><td className="px-5 py-4">{quote.projectTitle}</td><td className="px-5 py-4 font-semibold">{formatIdr(quote.total.toString())}</td><td className="px-5 py-4 text-secondary">{quote.validUntil.toLocaleDateString("id-ID")}</td><td className="px-5 py-4"><Badge variant={variant(quote.status)}>{quote.status.replaceAll("_", " ")}</Badge></td>{archived && <td className="px-5 py-4 text-xs text-secondary">{quote.archivedAt?.toLocaleString("id-ID")}</td>}</tr>)}</tbody></table></WorkspaceTableViewport>{quotations.length === 0 && <p className="p-10 text-center text-sm text-secondary">{empty}</p>}</CardContent></Card>;
}
