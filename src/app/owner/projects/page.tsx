import Link from "next/link";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { WorkspaceRecordLink, WorkspaceRecordList } from "@/components/workspace/record-list";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OwnerProjectsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  const rows = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: { id: true, title: true, projectNumber: true, total: true, status: true, client: { select: { name: true } } },
  });
  const hasNext = rows.length > pageSize;
  const projects = rows.slice(0, pageSize);

  return <>
    <WorkspacePageHeader eyebrow="Projects" title="Delivery workspaces from accepted quotations." description="Every record retains its current lifecycle status, Client owner, and accepted quotation value." />
    {projects.length === 0 ? <div className="mt-8"><EmptyState icon={FolderKanban} title={page > 1 ? "No projects on this page" : "No project workspace yet"} description={page > 1 ? "Return to the first page to view recorded projects." : "A project is created only through quotation acceptance."}/>{page > 1 && <Button asChild variant="outline" className="mt-4"><Link href="/owner/projects">Return to projects</Link></Button>}</div> : <WorkspaceModule titleId="owner-project-records" className="mt-8"><WorkspaceModuleHeader titleId="owner-project-records" eyebrow="Operational records" title="Project workspaces" description="Open a project for lifecycle, agreement, payment schedule, delivery, files, and communication controls."/><WorkspaceRecordList>{projects.map((project)=><WorkspaceRecordLink key={project.id} href={`/owner/projects/${project.id}`} icon={FolderKanban} eyebrow={`${project.projectNumber} · ${project.client.name}`} title={project.title} description={formatIdr(project.total.toString())} trailing={<><Badge>{project.status.replaceAll("_"," ")}</Badge><ArrowUpRight className="size-4 text-primary" aria-hidden="true"/></>} className="min-h-24"/>)}</WorkspaceRecordList></WorkspaceModule>}
    {projects.length > 0 && <PaginationControls pathname="/owner/projects" page={page} hasNext={hasNext}/>}
  </>;
}
