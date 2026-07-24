import Link from "next/link";
import { Archive, Search } from "lucide-react";
import { BulkArchiveControls, RecordCheckbox } from "@/components/bulk-archive-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { WorkspaceTableViewport } from "@/components/workspace/table-viewport";
import { bulkArchiveInquiriesAction } from "@/features/inquiries/owner-actions";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
const variant = (status: string) => status === "ACCEPTED" ? "success" : status === "REJECTED" || status === "CANCELLED" ? "error" : status === "WAITING_FOR_CLIENT" ? "warning" : "default" as const;

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

export function InquiryTable({ inquiries, empty, archived = false, selectable = false }: { inquiries: Awaited<ReturnType<typeof prisma.inquiry.findMany>>; empty: string; archived?: boolean; selectable?: boolean }) {
  return <Card className="mt-6 overflow-hidden"><CardContent className="p-0"><WorkspaceTableViewport label={archived ? "Archived inquiry records" : "Active inquiry records"}><table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">{archived ? "Archived inquiry records" : "Active inquiry records"}</caption><thead className="border-b border-border bg-surface-container/50 text-xs uppercase tracking-wide text-secondary"><tr>{selectable&&<th className="px-5 py-4" aria-label="Select">Select</th>}<th className="px-5 py-4">Inquiry</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Project</th><th className="px-5 py-4">Budget</th><th className="px-5 py-4">Status</th>{archived && <th className="px-5 py-4">Archived</th>}</tr></thead><tbody>{inquiries.map((item) => <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent-soft/40">{selectable&&<td className="px-5 py-4"><RecordCheckbox id={item.id}/></td>}<td className="px-5 py-4"><Link href={`/owner/inquiries/${item.id}`} className="font-semibold text-primary hover:underline">{item.inquiryNumber}</Link><p className="mt-1 text-xs text-secondary">{item.createdAt.toLocaleDateString("id-ID")}</p></td><td className="px-5 py-4"><p className="font-semibold">{item.clientName}</p><p className="text-xs text-secondary">{item.companyName ?? item.clientEmail}</p></td><td className="px-5 py-4">{item.projectTitle}</td><td className="px-5 py-4 text-secondary">{item.budgetRange ?? "Discuss"}</td><td className="px-5 py-4"><Badge variant={variant(item.status)}>{item.status.replaceAll("_", " ")}</Badge></td>{archived && <td className="px-5 py-4 text-xs text-secondary">{item.archivedAt?.toLocaleString("id-ID")}</td>}</tr>)}</tbody></table></WorkspaceTableViewport>{inquiries.length === 0 && <p className="p-10 text-center text-sm text-secondary">{empty}</p>}</CardContent></Card>;
}
