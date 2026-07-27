import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";

export default async function CreateServicePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [{ type: rawType }, types] = await Promise.all([searchParams, prisma.serviceType.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })]);
  const selectedType = rawType ? types.find((type) => type.slug === rawType) : undefined;
  const backHref = selectedType ? `/owner/services?type=${encodeURIComponent(selectedType.slug)}` : "/owner/services";
  return <>
    <WorkspacePageHeader eyebrow="Layanan baru" title={selectedType ? `Tambah layanan di ${selectedType.name}.` : "Susun referensi layanan."} description={selectedType ? "Jenis layanan sudah dipilih dari katalog dan dikunci untuk layanan baru ini." : "Harga publik tetap berupa starting estimate; quotation Owner menetapkan scope dan harga final."} actions={<Button asChild variant="outline"><Link href={backHref}><ArrowLeft className="size-4" aria-hidden="true"/>Kembali ke layanan</Link></Button>}/>
    <div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor types={types} lockedServiceType={selectedType ? { id: selectedType.id, name: selectedType.name } : undefined}/></div>
  </>;
}
