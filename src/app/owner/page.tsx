import { FileText, FolderKanban, MessageSquareText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function OwnerDashboard() {
  const [inquiries, quotations, projects] = await Promise.all([
    prisma.inquiry.count({ where: { status: { notIn: ["ARCHIVED", "CANCELLED"] } } }),
    prisma.quotation.count({ where: { isCurrent: true, status: { in: ["DRAFT", "SENT", "VIEWED", "REVISION_REQUESTED"] } } }),
    prisma.project.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
  ]);
  const metrics = [["Active inquiries", inquiries, MessageSquareText], ["Open quotations", quotations, FileText], ["Active projects", projects, FolderKanban]] as const;
  return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Owner overview</p><h1 className="mt-3 font-display text-3xl font-extrabold">Work that needs attention.</h1><div className="mt-8 grid gap-5 md:grid-cols-3">{metrics.map(([label, value, Icon]) => <Card key={label}><CardContent><Icon className="size-5 text-primary" /><p className="mt-8 font-display text-4xl font-extrabold">{value}</p><p className="mt-2 text-sm text-secondary">{label}</p></CardContent></Card>)}</div></>;
}
