import { ArrowUpRight, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { WorkspaceRecordLink, WorkspaceRecordList } from "@/components/workspace/record-list";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ClientMessagesPage() {
  const user = await requireClient();
  const projects = await prisma.project.findMany({
    where: { clientId: user.id },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Messages"
        title="Project conversations with context."
        description="Messages remain attached to their protected project instead of becoming detached public chat."
      />

      {projects.length === 0 ? (
        <EmptyState className="mt-8" icon={MessageSquare} title="No project conversation" description="Messages become available inside a project workspace after quotation acceptance." />
      ) : (
        <WorkspaceModule titleId="client-project-conversations" className="mt-8">
          <WorkspaceModuleHeader
            titleId="client-project-conversations"
            eyebrow="Project threads"
            title="Available conversations"
            description="Open a project to view message history and send a contextual update."
          />
          <WorkspaceRecordList>
            {projects.map((project) => (
              <WorkspaceRecordLink
                key={project.id}
                href={`/client/projects/${project.id}`}
                icon={MessageSquare}
                title={project.title}
                description={project.messages[0]?.message ?? "Open the project to start the conversation."}
                trailing={<ArrowUpRight className="size-4 text-primary" aria-hidden="true" />}
                className="min-h-24"
              />
            ))}
          </WorkspaceRecordList>
        </WorkspaceModule>
      )}
    </>
  );
}
