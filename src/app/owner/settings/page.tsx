import { Layers3, Settings } from "lucide-react";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { StudioStackManager } from "@/features/studio-stack/stack-manager";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export default async function OwnerSettingsPage() {
  await requireOwner();
  const stackItems = await prisma.studioStackItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, category: true, sortOrder: true, isPublished: true },
  });

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Settings"
        title="Control what represents the studio."
        description="Manage the public technology stack here. Environment, payment, storage, and delivery configuration stay deployment-controlled."
      />

      <WorkspaceModule titleId="owner-public-stack" className="mt-8 max-w-6xl">
        <WorkspaceModuleHeader
          titleId="owner-public-stack"
          eyebrow="Public content"
          title="Studio stack"
          description="Freeform technology, fixed category, and reversible publishing. Nothing appears on About until you publish it."
          aside={<span className="grid size-11 place-items-center rounded-full border border-primary/25 bg-accent-soft text-primary"><Layers3 className="size-5" aria-hidden="true" /></span>}
        />
        <div className="p-5 md:p-6">
          <StudioStackManager items={stackItems} />
        </div>
      </WorkspaceModule>

      <WorkspaceModule titleId="owner-configuration-boundary" className="mt-8 max-w-3xl">
        <WorkspaceModuleHeader
          titleId="owner-configuration-boundary"
          eyebrow="Environment controlled"
          title="Configuration boundary"
          aside={<span className="grid size-11 place-items-center rounded-full border border-primary/25 bg-accent-soft text-primary"><Settings className="size-5" aria-hidden="true" /></span>}
        />
        <div className="p-5 md:p-6">
          <p className="text-sm leading-7 text-secondary">Owner identity, WhatsApp destination, document branding, payment provider, storage, and email delivery settings remain controlled through the application environment and deployment configuration.</p>
        </div>
      </WorkspaceModule>
    </>
  );
}
