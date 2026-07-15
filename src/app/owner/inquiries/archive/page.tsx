import Link from "next/link";
import { ArrowLeft, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InquiryTable } from "@/app/owner/inquiries/page";
import { restoreInquiryAction } from "@/features/inquiries/owner-actions";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export default async function InquiryArchivePage() {
  const [locale, inquiries] = await Promise.all([getLocale(), prisma.inquiry.findMany({ where: { archivedAt: { not: null } }, orderBy: { archivedAt: "desc" }, take: 100 })]);
  const dictionary = getDictionary(locale);
  return <><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Link href="/owner/inquiries" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"><ArrowLeft className="size-4"/>{dictionary.common.activeRecords}</Link><p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.portal.inquiries}</p><h1 className="mt-3 font-display text-3xl font-extrabold">{dictionary.common.archiveRecords}</h1><p className="mt-2 max-w-2xl text-sm text-secondary">Archived inquiries are hidden from the active list only. Project and quotation data remains unchanged.</p></div></div><InquiryTable inquiries={inquiries} archived empty="No archived inquiries."/><div className="mt-5 flex flex-wrap gap-3">{inquiries.map((inquiry) => <form key={inquiry.id} action={restoreInquiryAction}><input type="hidden" name="inquiryId" value={inquiry.id}/><Button variant="outline" size="sm"><ArchiveRestore className="size-4"/>{dictionary.common.restore} {inquiry.inquiryNumber}</Button></form>)}</div></>;
}
