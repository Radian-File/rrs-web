import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { createServiceTypeAction } from "@/features/services/actions";
import { prisma } from "@/lib/db/prisma";

const inputClass = "mt-2 h-11 w-full rounded-[10px] border border-border bg-surface px-3 text-sm";

export default async function ServiceTypesPage() {
  const types = await prisma.serviceType.findMany({ include: { _count: { select: { services: true } } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return <>
    <WorkspacePageHeader eyebrow="Katalog layanan" title="Jenis layanan." description="Jenis aktif mengelompokkan layanan Owner; jumlah layanan adalah hitungan relasi saat ini." actions={<Button asChild variant="outline"><Link href="/owner/services"><ArrowLeft className="size-4" aria-hidden="true"/>Kembali ke layanan</Link></Button>}/>
    <form action={createServiceTypeAction} className="mt-8 grid gap-4 rounded-[16px] border border-border bg-surface p-5 md:grid-cols-[1fr_1fr_.65fr_auto] md:items-end">
      <label className="text-sm font-semibold">Nama<input name="name" required placeholder="Mobile Development" className={inputClass}/></label>
      <label className="text-sm font-semibold">Slug<input name="slug" required placeholder="mobile-development" className={inputClass}/></label>
      <label className="text-sm font-semibold">Icon key<input name="icon" defaultValue="globe" className={inputClass}/></label>
      <Button>Buat jenis</Button>
    </form>
    <div className="mt-6 divide-y divide-border border border-border bg-surface">{types.map(type=><div key={type.id} className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center"><span className="font-semibold">{type.name}</span><span className="text-sm text-secondary">{type._count.services} layanan · {type.isActive?"Aktif":"Nonaktif"}</span></div>)}</div>
  </>;
}
