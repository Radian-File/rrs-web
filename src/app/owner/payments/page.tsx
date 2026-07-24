import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { ManualPaymentReviewControls } from "@/features/payments/manual-payment-review-controls";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OwnerPaymentsPage() {
  const payments = await prisma.paymentAttempt.findMany({ include: { client: true, invoice: true, project: true, files: true }, orderBy: { createdAt: "desc" }, take: 100 });

  return <>
    <WorkspacePageHeader eyebrow="Payments" title="Provider attempts and manual verification." description="Each record is a payment attempt. Amount, provider state, manual state, and uploaded proof remain distinct from invoiced or received-value metrics." />
    {payments.length === 0 ? <EmptyState className="mt-8" icon={CreditCard} title="No payment attempts" description="Provider attempts and Client-submitted manual payment proofs will appear here when recorded."/> : <div className="mt-8 space-y-4">{payments.map((payment)=><Card key={payment.id} data-invoice={payment.invoice.invoiceNumber}><CardContent><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="font-display text-lg font-extrabold">{payment.invoice.invoiceNumber} · {payment.client.name}</p><p className="mt-1 text-xs text-secondary">{payment.provider} · {payment.project.title} · {payment.createdAt.toLocaleString("id-ID")}</p></div><div className="sm:text-right"><p className="font-semibold text-primary">{formatIdr(payment.amount.toString())}</p><Badge className="mt-2">{payment.manualStatus??payment.status}</Badge></div></div>{payment.files.map((file)=><Link key={file.id} href={`/api/files/${file.id}/download`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">View payment proof: {file.originalName}</Link>)}{payment.provider==="MANUAL"&&payment.manualStatus==="UNDER_VERIFICATION"&&<ManualPaymentReviewControls paymentId={payment.id}/>}</CardContent></Card>)}</div>}
  </>;
}
