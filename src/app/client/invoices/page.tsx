import Link from "next/link";
import { ArrowUpRight, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { WorkspaceRecordLink, WorkspaceRecordList } from "@/components/workspace/record-list";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [user, { page: rawPage }] = await Promise.all([requireClient(), searchParams]);
  const page = parsePage(rawPage);
  const rows = await prisma.invoice.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: {
      id: true,
      invoiceNumber: true,
      dueDate: true,
      total: true,
      status: true,
      project: { select: { title: true } },
    },
  });
  const hasNext = rows.length > pageSize;
  const invoices = rows.slice(0, pageSize);

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Invoices & payments"
        title="Payment documents for your projects."
        description="Invoice status, due date, total, and available payment records are displayed exactly as stored."
      />

      {invoices.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={ReceiptText}
            title={page > 1 ? "No invoices on this page" : "No invoice yet"}
            description={page > 1 ? "Return to the first page to view your invoice records." : "The first invoice is created after quotation acceptance. Additional invoices follow the agreed payment schedule."}
          />
          {page > 1 && <Button asChild variant="outline" className="mt-4"><Link href="/client/invoices">Return to invoices</Link></Button>}
        </div>
      ) : (
        <WorkspaceModule titleId="client-invoice-records" className="mt-8">
          <WorkspaceModuleHeader
            titleId="client-invoice-records"
            eyebrow="Finance records"
            title="Project invoices"
            description="Open an invoice to review the protected document and any payment actions currently exposed by the existing workflow."
          />
          <WorkspaceRecordList>
            {invoices.map((invoice) => (
              <WorkspaceRecordLink
                key={invoice.id}
                href={`/client/invoices/${invoice.id}`}
                icon={ReceiptText}
                eyebrow={invoice.invoiceNumber}
                title={invoice.project.title}
                description={`Due ${invoice.dueDate?.toLocaleDateString("id-ID") ?? "—"} · ${formatIdr(invoice.total.toString())}`}
                trailing={<><Badge>{invoice.status.replaceAll("_", " ")}</Badge><ArrowUpRight className="size-4 text-primary" aria-hidden="true" /></>}
                className="min-h-24"
              />
            ))}
          </WorkspaceRecordList>
        </WorkspaceModule>
      )}
      {invoices.length > 0 && <PaginationControls pathname="/client/invoices" page={page} hasNext={hasNext} />}
    </>
  );
}
