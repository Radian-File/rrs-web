"use client";

import { useActionState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { reissueReviewInvitationAction } from "@/features/reviews/actions";

const initial = { status: "idle" as const };
export function ReviewInvitationControl({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(reissueReviewInvitationAction, initial);
  return <div className="mt-4"><form action={action}><input type="hidden" name="projectId" value={projectId}/><Button size="sm" variant="outline" disabled={pending}>{pending ? "Preparing link…" : "Create / reissue review link"}</Button></form>{state.message && <p role="status" className={`mt-3 text-sm ${state.status === "error" ? "text-error" : "text-success"}`}>{state.message}</p>}{state.reviewUrl && <div className="mt-3 flex flex-wrap items-center gap-2"><code className="max-w-full break-all rounded bg-surface-container px-2 py-1 text-xs">{state.reviewUrl}</code><CopyButton value={state.reviewUrl} /></div>}</div>;
}
