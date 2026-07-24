import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
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

export default async function ClientQuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [user, { page: rawPage }] = await Promise.all([requireClient(), searchParams]);
  const page = parsePage(rawPage);
  const rows = await prisma.quotation.findMany({
    where: {
      isCurrent: true,
      OR: [{ clientId: user.id }, { clientEmail: user.email ?? undefined }],
    },
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: {
      id: true,
      projectTitle: true,
      quotationNumber: true,
      version: true,
      validUntil: true,
      total: true,
      status: true,
    },
  });
  const hasNext = rows.length > pageSize;
  const quotations = rows.slice(0, pageSize);

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Quotations"
        title="Commercial documents for your projects."
        description="Each linked current quotation shows its exact issuance status, version, validity, and documented total."
      />

      {quotations.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FileText}
            title={page > 1 ? "No quotations on this page" : "No linked quotations"}
            description={page > 1 ? "Return to the first page to view your linked quotation records." : "A quotation becomes linked after the matching Client email is used or the document is accepted."}
          />
          {page > 1 && <Button asChild variant="outline" className="mt-4"><Link href="/client/quotations">Return to quotations</Link></Button>}
        </div>
      ) : (
        <WorkspaceModule titleId="client-quotation-records" className="mt-8">
          <WorkspaceModuleHeader
            titleId="client-quotation-records"
            eyebrow="Current versions"
            title="Linked quotation records"
            description="Status labels are shown exactly as recorded; this list does not infer urgency or payment eligibility."
          />
          <WorkspaceRecordList>
            {quotations.map((quotation) => (
              <WorkspaceRecordLink
                key={quotation.id}
                href={`/client/quotations/${quotation.id}`}
                icon={FileText}
                eyebrow={`${quotation.quotationNumber} · v${quotation.version}`}
                title={quotation.projectTitle}
                description={`Valid until ${quotation.validUntil.toLocaleDateString("id-ID")} · ${formatIdr(quotation.total.toString())}`}
                trailing={<><Badge>{quotation.status.replaceAll("_", " ")}</Badge><ArrowUpRight className="size-4 text-primary" aria-hidden="true" /></>}
                className="min-h-24"
              />
            ))}
          </WorkspaceRecordList>
        </WorkspaceModule>
      )}
      {quotations.length > 0 && <PaginationControls pathname="/client/quotations" page={page} hasNext={hasNext} />}
    </>
  );
}
