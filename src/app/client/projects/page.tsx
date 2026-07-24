import Link from "next/link";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { WorkspaceRecordLink, WorkspaceRecordList } from "@/components/workspace/record-list";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ClientProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [user, { page: rawPage }] = await Promise.all([requireClient(), searchParams]);
  const page = parsePage(rawPage);
  const rows = await prisma.project.findMany({
    where: { clientId: user.id },
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: { id: true, title: true, projectNumber: true, status: true },
  });
  const hasNext = rows.length > pageSize;
  const projects = rows.slice(0, pageSize);

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Projects"
        title="Progress, files, milestones, and approvals."
        description="Each accepted project keeps its delivery record, communication, files, finance, and formal decisions in one protected workspace."
      />

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FolderKanban}
            title={page > 1 ? "No projects on this page" : "No project workspace yet"}
            description={page > 1 ? "Return to the first page to view your available project workspaces." : "A workspace is created automatically after a quotation is accepted."}
          />
          {page > 1 && <Button asChild variant="outline" className="mt-4"><Link href="/client/projects">Return to projects</Link></Button>}
        </div>
      ) : (
        <WorkspaceModule titleId="client-project-records" className="mt-8">
          <WorkspaceModuleHeader
            titleId="client-project-records"
            eyebrow="Protected records"
            title="Project workspaces"
            description="Open a project to review its current state and available actions."
          />
          <WorkspaceRecordList>
            {projects.map((project) => (
              <WorkspaceRecordLink
                key={project.id}
                href={`/client/projects/${project.id}`}
                icon={FolderKanban}
                eyebrow={project.projectNumber}
                title={project.title}
                description={project.status.replaceAll("_", " ")}
                trailing={<><Badge>{project.status.replaceAll("_", " ")}</Badge><ArrowUpRight className="size-4 text-primary" aria-hidden="true" /></>}
                className="min-h-24"
              />
            ))}
          </WorkspaceRecordList>
        </WorkspaceModule>
      )}
      {projects.length > 0 && <PaginationControls pathname="/client/projects" page={page} hasNext={hasNext} />}
    </>
  );
}
