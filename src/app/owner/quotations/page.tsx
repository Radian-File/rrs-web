import Link from "next/link";
import { Archive, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";
const variant = (status: string) => status === "ACCEPTED" ? "success" : status === "REJECTED" || status === "CANCELLED" || status === "EXPIRED" ? "error" : status === "REVISION_REQUESTED" ? "warning" : "default" as const;

export default async function QuotationsPage() {
  const [locale, quotations] = await Promise.all([getLocale(), prisma.quotation.findMany({ where: { isCurrent: true, archivedAt: null }, orderBy: { updatedAt: "desc" }, take: 100 })]);
  const dictionary = getDictionary(locale);
  return <><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.portal.quotations}</p><h1 className="mt-3 font-display text-3xl font-extrabold">Scope and price before commitment.</h1><p className="mt-2 text-sm text-secondary">{dictionary.common.activeRecords}</p></div><div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/owner/quotations/archive"><Archive className="size-4"/>{dictionary.common.archiveRecords}</Link></Button><Button asChild><Link href="/owner/quotations/create"><Plus className="size-4"/>Create Quotation</Link></Button></div></div><QuotationTable quotations={quotations} empty="No quotations yet."/></>;
}

export function QuotationTable({ quotations, empty, archived = false }: { quotations: Awaited<ReturnType<typeof prisma.quotation.findMany>>; empty: string; archived?: boolean }) {
  return <Card className="mt-8 overflow-hidden"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-border bg-surface-container/50 text-xs uppercase tracking-wide text-secondary"><tr><th className="px-5 py-4">Quotation</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Project</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Valid until</th><th className="px-5 py-4">Status</th>{archived && <th className="px-5 py-4">Archived</th>}</tr></thead><tbody>{quotations.map((quote) => <tr key={quote.id} className="border-b border-border last:border-0 hover:bg-accent-soft/40"><td className="px-5 py-4"><Link href={`/owner/quotations/${quote.id}`} className="font-semibold text-primary hover:underline">{quote.quotationNumber}</Link><p className="mt-1 text-xs text-secondary">Version {quote.version}</p></td><td className="px-5 py-4">{quote.clientName}</td><td className="px-5 py-4">{quote.projectTitle}</td><td className="px-5 py-4 font-semibold">{formatIdr(quote.total.toString())}</td><td className="px-5 py-4 text-secondary">{quote.validUntil.toLocaleDateString("id-ID")}</td><td className="px-5 py-4"><Badge variant={variant(quote.status)}>{quote.status.replaceAll("_", " ")}</Badge></td>{archived && <td className="px-5 py-4 text-xs text-secondary">{quote.archivedAt?.toLocaleString("id-ID")}</td>}</tr>)}</tbody></table>{quotations.length === 0 && <p className="p-10 text-center text-sm text-secondary">{empty}</p>}</div></CardContent></Card>;
}
