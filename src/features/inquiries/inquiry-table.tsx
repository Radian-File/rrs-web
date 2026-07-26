import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { RecordCheckbox } from "@/components/bulk-archive-controls";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WorkspaceTableViewport } from "@/components/workspace/table-viewport";

type InquiryRecord = Prisma.InquiryGetPayload<Record<string, never>> & {
  initialComplexityLevel?: { title: string } | null;
};

const variant = (status: string) => status === "ACCEPTED" ? "success" : status === "REJECTED" || status === "CANCELLED" ? "error" : status === "WAITING_FOR_CLIENT" ? "warning" : "default" as const;

export function InquiryTable({ inquiries, empty, archived = false, selectable = false }: { inquiries: InquiryRecord[]; empty: string; archived?: boolean; selectable?: boolean }) {
  const label = archived ? "Archived inquiry records" : "Active inquiry records";
  return <Card className="mt-6 overflow-hidden"><CardContent className="p-0"><WorkspaceTableViewport label={label}><table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">{label}</caption><thead className="border-b border-border bg-surface-container/50 text-xs uppercase tracking-wide text-secondary"><tr>{selectable&&<th className="px-5 py-4" aria-label="Select">Select</th>}<th className="px-5 py-4">Inquiry</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Project</th><th className="px-5 py-4">Budget</th><th className="px-5 py-4">Status</th>{archived && <th className="px-5 py-4">Archived</th>}</tr></thead><tbody>{inquiries.map((item) => <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent-soft/40">{selectable&&<td className="px-5 py-4"><RecordCheckbox id={item.id}/></td>}<td className="px-5 py-4"><Link href={`/owner/inquiries/${item.id}`} className="font-semibold text-primary hover:underline">{item.inquiryNumber}</Link><p className="mt-1 text-xs text-secondary">{item.createdAt.toLocaleDateString("id-ID")}</p></td><td className="px-5 py-4"><p className="font-semibold">{item.clientName}</p><p className="text-xs text-secondary">{item.companyName ?? item.clientEmail}</p></td><td className="px-5 py-4"><p>{item.projectTitle}</p>{item.initialComplexityLevel?.title ? <p className="mt-1 text-xs text-secondary">Client starting point: {item.initialComplexityLevel.title}</p> : null}</td><td className="px-5 py-4 text-secondary">{item.budgetRange ?? "Discuss"}</td><td className="px-5 py-4"><Badge variant={variant(item.status)}>{item.status.replaceAll("_", " ")}</Badge></td>{archived && <td className="px-5 py-4 text-xs text-secondary">{item.archivedAt?.toLocaleString("id-ID")}</td>}</tr>)}</tbody></table></WorkspaceTableViewport>{inquiries.length === 0 && <p className="p-10 text-center text-sm text-secondary">{empty}</p>}</CardContent></Card>;
}
