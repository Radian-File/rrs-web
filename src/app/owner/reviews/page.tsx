import { Star } from "lucide-react";
import { ReviewStatus } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { Textarea } from "@/components/ui/textarea";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { moderateReviewAction } from "@/features/reviews/actions";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
const selectClass = "h-11 rounded-[10px] border border-border bg-surface px-3 text-sm";

export default async function OwnerReviewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  const rows = await prisma.review.findMany({ orderBy: { submittedAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize + 1, select: { id: true, overallRating: true, communicationRating: true, qualityRating: true, comment: true, status: true, ownerResponse: true, client: { select: { name: true } }, project: { select: { projectNumber: true, title: true } } } });
  const hasNext = rows.length > pageSize;
  const reviews = rows.slice(0, pageSize);

  return <>
    <WorkspacePageHeader eyebrow="Reviews" title="Moderate verified project feedback." description="Only submitted records tied to Client and project ownership are available here. Public visibility remains an explicit moderation status." />
    {reviews.length === 0 ? <EmptyState className="mt-8" icon={Star} title={page > 1 ? "No reviews on this page" : "No verified review submissions"} description={page > 1 ? "Return to the first page to view review records." : "Completed-project review submissions will appear here for explicit moderation."}/> : <div className="mt-8 space-y-5">{reviews.map((review)=><Card key={review.id}><CardContent><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="font-display text-lg font-extrabold">{review.client.name}</p><p className="mt-1 text-xs text-secondary">{review.project.projectNumber} · {review.project.title}</p></div><Badge>{review.status}</Badge></div><p className="mt-5 leading-7 text-secondary">“{review.comment}”</p><p className="mt-3 text-sm font-semibold text-primary">Overall {review.overallRating}/5 · Communication {review.communicationRating}/5 · Quality {review.qualityRating}/5</p><form action={moderateReviewAction} className="mt-6 grid gap-3 sm:grid-cols-[180px_1fr_auto]"><input type="hidden" name="reviewId" value={review.id}/><select name="status" defaultValue={review.status} className={selectClass} aria-label="Review moderation status">{Object.values(ReviewStatus).map((status)=><option key={status}>{status}</option>)}</select><Textarea name="ownerResponse" defaultValue={review.ownerResponse??""} placeholder="Optional public owner response" className="min-h-20"/><Button>Save moderation</Button></form></CardContent></Card>)}</div>}
    <PaginationControls pathname="/owner/reviews" page={page} hasNext={hasNext}/>
  </>;
}
