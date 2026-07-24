import Link from "next/link";
import { Archive, Plus } from "lucide-react";
import { BulkArchiveControls } from "@/components/bulk-archive-controls";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { bulkArchiveQuotationsAction } from "@/features/quotations/actions";
import { QuotationTable } from "@/features/quotations/quotation-table";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function QuotationsPage() {
  const [locale, quotations] = await Promise.all([
    getLocale(),
    prisma.quotation.findMany({ where: { isCurrent: true, archivedAt: null }, orderBy: { updatedAt: "desc" }, take: 100 }),
  ]);
  const dictionary = getDictionary(locale);

  return <>
    <WorkspacePageHeader
      eyebrow={dictionary.portal.quotations}
      title="Scope and price before commitment."
      description="Current, non-archived quotation versions only. Status, version, validity, and totals remain explicit."
      actions={<><Button asChild variant="outline"><Link href="/owner/quotations/archive"><Archive className="size-4" aria-hidden="true"/>{dictionary.common.archiveRecords}</Link></Button><Button asChild><Link href="/owner/quotations/create"><Plus className="size-4" aria-hidden="true"/>Create quotation</Link></Button></>}
    />
    <form id="bulk-archive-form" action={bulkArchiveQuotationsAction} className="mt-5">
      <BulkArchiveControls allCount={await prisma.quotation.count({ where: { isCurrent: true, archivedAt: null } })} entity="quotations"/>
      <QuotationTable quotations={quotations} empty="No quotations yet." selectable/>
    </form>
  </>;
}
