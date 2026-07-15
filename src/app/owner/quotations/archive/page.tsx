import Link from "next/link";
import { ArrowLeft, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationTable } from "@/app/owner/quotations/page";
import { restoreQuotationAction } from "@/features/quotations/actions";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export default async function QuotationArchivePage() {
  const [locale, quotations] = await Promise.all([getLocale(), prisma.quotation.findMany({ where: { isCurrent: true, archivedAt: { not: null } }, orderBy: { archivedAt: "desc" }, take: 100 })]);
  const dictionary = getDictionary(locale);
  return <><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Link href="/owner/quotations" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"><ArrowLeft className="size-4"/>{dictionary.common.activeRecords}</Link><p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.portal.quotations}</p><h1 className="mt-3 font-display text-3xl font-extrabold">{dictionary.common.archiveRecords}</h1><p className="mt-2 max-w-2xl text-sm text-secondary">Archived quotations remain valid records. Their status, totals, public access, and linked financial data are unchanged.</p></div></div><QuotationTable quotations={quotations} archived empty="No archived quotations."/><div className="mt-5 flex flex-wrap gap-3">{quotations.map((quotation) => <form key={quotation.id} action={restoreQuotationAction}><input type="hidden" name="quotationId" value={quotation.id}/><Button variant="outline" size="sm"><ArchiveRestore className="size-4"/>{dictionary.common.restore} {quotation.quotationNumber}</Button></form>)}</div></>;
}
