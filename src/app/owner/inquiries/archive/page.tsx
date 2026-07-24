import Link from "next/link";
import { ArrowLeft, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { InquiryTable } from "@/features/inquiries/inquiry-table";
import { restoreInquiryAction } from "@/features/inquiries/owner-actions";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export default async function InquiryArchivePage() {
  const [locale, inquiries] = await Promise.all([getLocale(), prisma.inquiry.findMany({ where: { archivedAt: { not: null } }, orderBy: { archivedAt: "desc" }, take: 100 })]);
  const dictionary = getDictionary(locale);
  return <><WorkspacePageHeader eyebrow={dictionary.portal.inquiries} title={dictionary.common.archiveRecords} description="Archived inquiries are hidden from the active list only. Project and quotation data remains unchanged." actions={<Button asChild variant="outline"><Link href="/owner/inquiries"><ArrowLeft className="size-4" aria-hidden="true"/>{dictionary.common.activeRecords}</Link></Button>}/><InquiryTable inquiries={inquiries} archived empty="No archived inquiries."/><div className="mt-5 flex flex-wrap gap-3">{inquiries.map((inquiry) => <form key={inquiry.id} action={restoreInquiryAction}><input type="hidden" name="inquiryId" value={inquiry.id}/><Button variant="outline" size="sm"><ArchiveRestore className="size-4"/>{dictionary.common.restore} {inquiry.inquiryNumber}</Button></form>)}</div></>;
}
