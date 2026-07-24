import { Settings } from "lucide-react";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";

export default function OwnerSettingsPage() {
  return <>
    <WorkspacePageHeader eyebrow="Settings" title="Workspace configuration." description="A read-only overview of configuration ownership; no unsupported in-app editor is implied." />
    <WorkspaceModule titleId="owner-configuration-boundary" className="mt-8 max-w-3xl">
      <WorkspaceModuleHeader titleId="owner-configuration-boundary" eyebrow="Environment controlled" title="Configuration boundary" aside={<span className="grid size-11 place-items-center rounded-full border border-primary/25 bg-accent-soft text-primary"><Settings className="size-5" aria-hidden="true"/></span>}/>
      <div className="p-5 md:p-6"><p className="text-sm leading-7 text-secondary">Owner identity, WhatsApp destination, document branding, payment provider, storage, and email delivery settings are controlled through the application environment and deployment configuration. Changes are not available from this workspace.</p></div>
    </WorkspaceModule>
  </>;
}
