"use client";

import { useActionState } from "react";
import { ProjectStatus } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { updateProjectStatusAction, type ProjectStatusActionState } from "@/features/projects/actions";

const initialState: ProjectStatusActionState = { status: "idle" };
const labels: Record<ProjectStatus, string> = {
  AWAITING_AGREEMENT: "Awaiting agreement",
  AWAITING_DOWN_PAYMENT: "Awaiting down payment",
  PLANNING: "Planning",
  IN_PROGRESS: "Start implementation",
  CLIENT_REVIEW: "Send for client review",
  REVISION: "Move to revision",
  ON_HOLD: "Put on hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancel project",
};

export function ProjectStatusTransition({ projectId, currentStatus, allowedStatuses }: { projectId: string; currentStatus: ProjectStatus; allowedStatuses: readonly ProjectStatus[] }) {
  const [state, action, pending] = useActionState(updateProjectStatusAction, initialState);
  if (allowedStatuses.length === 0) return <p className="text-sm text-secondary">No further Owner status transition is available.</p>;

  return <form action={action} className="rounded-[12px] border border-border bg-surface p-3">
    <input type="hidden" name="projectId" value={projectId} />
    <p className="text-xs font-bold uppercase tracking-[.12em] text-secondary">Current: {currentStatus.replaceAll("_", " ")}</p>
    <label className="mt-2 block text-xs text-secondary">Next available step<select name="status" defaultValue={allowedStatuses[0]} className="mt-1 h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">{allowedStatuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select></label>
    {state.status !== "idle" && <p role="status" className={`mt-2 text-xs leading-5 ${state.status === "success" ? "text-success" : "text-error"}`}>{state.message}</p>}
    <Button className="mt-3 w-full" size="sm" disabled={pending}>{pending ? "Updating…" : "Update status"}</Button>
  </form>;
}
