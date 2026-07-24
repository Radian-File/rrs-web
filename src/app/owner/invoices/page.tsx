import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { WorkspaceTableViewport } from "@/components/workspace/table-viewport";
import { refreshOverdueInvoicesAction } from "@/features/invoices/actions";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OwnerInvoicesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  const rows = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: { id: true, invoiceNumber: true, total: true, dueDate: true, status: true, client: { select: { name: true } }, project: { select: { title: true } }, paymentSchedule: { select: { title: true } } },
  });
  const hasNext = rows.length > pageSize;
  const invoices = rows.slice(0, pageSize);

  return <>
    <WorkspacePageHeader eyebrow="Invoices" title="Amounts issued from project schedules." description="Recorded totals, due dates, and statuses are shown directly; this view does not infer cash received." actions={<form action={refreshOverdueInvoicesAction}><Button variant="outline">Refresh overdue status</Button></form>}/>
    <Card className="mt-8 overflow-hidden"><CardContent className="p-0"><WorkspaceTableViewport label="Owner invoice records"><table className="w-full min-w-[800px] text-left text-sm"><caption className="sr-only">Owner invoice records</caption><thead className="border-b border-border bg-surface-container/50 text-xs uppercase tracking-wide text-secondary"><tr><th className="px-5 py-4">Invoice</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Project</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Due</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{invoices.map((invoice)=><tr key={invoice.id} className="border-b border-border last:border-0"><td className="px-5 py-4"><Link href={`/owner/invoices/${invoice.id}`} className="font-semibold text-primary hover:underline">{invoice.invoiceNumber}</Link><p className="mt-1 text-xs text-secondary">{invoice.paymentSchedule?.title}</p></td><td className="px-5 py-4">{invoice.client.name}</td><td className="px-5 py-4">{invoice.project.title}</td><td className="px-5 py-4 font-semibold">{formatIdr(invoice.total.toString())}</td><td className="px-5 py-4 text-secondary">{invoice.dueDate?.toLocaleDateString("id-ID")??"—"}</td><td className="px-5 py-4"><Badge>{invoice.status.replaceAll("_"," ")}</Badge></td></tr>)}</tbody></table></WorkspaceTableViewport>{invoices.length === 0 && <p className="p-10 text-center text-sm text-secondary">{page > 1 ? "No invoices on this page." : "No invoices have been issued."}</p>}</CardContent></Card>
    <PaginationControls pathname="/owner/invoices" page={page} hasNext={hasNext}/>
  </>;
}
