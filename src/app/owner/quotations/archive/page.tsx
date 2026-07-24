import Link from "next/link";
import { ArrowLeft, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { QuotationTable } from "@/features/quotations/quotation-table";
import { restoreQuotationAction } from "@/features/quotations/actions";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export default async function QuotationArchivePage() {
  const [locale, quotations] = await Promise.all([getLocale(), prisma.quotation.findMany({ where: { isCurrent: true, archivedAt: { not: null } }, orderBy: { archivedAt: "desc" }, take: 100 })]);
  const dictionary = getDictionary(locale);
  return <><WorkspacePageHeader eyebrow={dictionary.portal.quotations} title={dictionary.common.archiveRecords} description="Archived quotations remain valid records. Their status, totals, public access, and linked financial data are unchanged." actions={<Button asChild variant="outline"><Link href="/owner/quotations"><ArrowLeft className="size-4" aria-hidden="true"/>{dictionary.common.activeRecords}</Link></Button>}/><QuotationTable quotations={quotations} archived empty="No archived quotations."/><div className="mt-5 flex flex-wrap gap-3">{quotations.map((quotation) => <form key={quotation.id} action={restoreQuotationAction}><input type="hidden" name="quotationId" value={quotation.id}/><Button variant="outline" size="sm"><ArchiveRestore className="size-4"/>{dictionary.common.restore} {quotation.quotationNumber}</Button></form>)}</div></>;
}
