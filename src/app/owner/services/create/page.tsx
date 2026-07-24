import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";

export default async function CreateServicePage() {
  const types = await prisma.serviceType.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return <>
    <WorkspacePageHeader eyebrow="Layanan baru" title="Susun referensi layanan." description="Harga publik tetap berupa starting estimate; quotation Owner menetapkan scope dan harga final." actions={<Button asChild variant="outline"><Link href="/owner/services"><ArrowLeft className="size-4" aria-hidden="true"/>Kembali ke layanan</Link></Button>}/>
    <div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor types={types}/></div>
  </>;
}
