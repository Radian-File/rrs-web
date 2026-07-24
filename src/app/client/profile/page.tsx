import { UserRound } from "lucide-react";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage() {
  const session = await requireClient();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.id } });
  const fields = [
    ["Name", user.name],
    ["Email", user.email],
    ["WhatsApp", user.whatsappNumber ?? "—"],
    ["Company", user.companyName ?? "—"],
  ];

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Profile"
        title="Client identity and contact details."
        description="This identity anchors private quotations, projects, invoices, files, approvals, and verified reviews to the correct Client account."
      />
      <WorkspaceModule titleId="client-profile-record" className="mt-8 max-w-3xl">
        <WorkspaceModuleHeader
          titleId="client-profile-record"
          eyebrow="Account record"
          title="Current Client profile"
          aside={<span className="grid size-11 place-items-center rounded-full border border-primary/25 bg-accent-soft text-primary"><UserRound className="size-5" aria-hidden="true" /></span>}
        />
        <dl className="grid gap-px bg-border sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="min-w-0 bg-surface p-5 md:p-6">
              <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-muted">{label}</dt>
              <dd className="mt-2 break-words font-semibold text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </WorkspaceModule>
    </>
  );
}
