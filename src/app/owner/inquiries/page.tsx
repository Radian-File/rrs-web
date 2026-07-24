import Link from "next/link";
import { Archive, Search } from "lucide-react";
import { BulkArchiveControls } from "@/components/bulk-archive-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { InquiryTable } from "@/features/inquiries/inquiry-table";
import { bulkArchiveInquiriesAction } from "@/features/inquiries/owner-actions";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const [{ q, status }, locale] = await Promise.all([searchParams, getLocale()]);
  const dictionary = getDictionary(locale);
  const inquiries = await prisma.inquiry.findMany({
    where: {
      archivedAt: null,
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [{ inquiryNumber: { contains: q, mode: "insensitive" } }, { clientName: { contains: q, mode: "insensitive" } }, { projectTitle: { contains: q, mode: "insensitive" } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <>
    <WorkspacePageHeader
      eyebrow={dictionary.portal.inquiries}
      title="Potential projects before quotation."
      description={`${dictionary.common.activeRecords}. Search and status filtering preserve the exact current inquiry record.`}
      actions={<><form className="relative w-full sm:w-80"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-secondary" aria-hidden="true"/><Input name="q" defaultValue={q} placeholder="Search inquiry, client, project" aria-label="Search inquiries" className="pl-10"/></form><Button asChild variant="outline"><Link href="/owner/inquiries/archive"><Archive className="size-4" aria-hidden="true"/>{dictionary.common.archiveRecords}</Link></Button></>}
    />
    <form id="bulk-archive-form" action={bulkArchiveInquiriesAction} className="mt-5">
      <BulkArchiveControls allCount={await prisma.inquiry.count({ where: { archivedAt: null } })} entity="inquiries"/>
      <InquiryTable inquiries={inquiries} empty="No inquiries found." selectable/>
    </form>
  </>;
}
