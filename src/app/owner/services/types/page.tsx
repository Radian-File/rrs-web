import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { createServiceTypeAction } from "@/features/services/actions";
import { prisma } from "@/lib/db/prisma";

const inputClass = "mt-2 h-11 w-full rounded-[10px] border border-border bg-surface px-3 text-sm";

export default async function ServiceTypesPage() {
  const types = await prisma.serviceType.findMany({ include: { _count: { select: { services: true } } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return <>
    <WorkspacePageHeader eyebrow="Katalog layanan" title="Jenis layanan." description="Pilih jenis untuk membuka layanan terkait, lalu tambahkan layanan baru langsung ke jenis tersebut." actions={<Button asChild variant="outline"><Link href="/owner/services"><ArrowLeft className="size-4" aria-hidden="true"/>Kembali ke layanan</Link></Button>}/>
    <form action={createServiceTypeAction} className="mt-8 grid gap-4 rounded-[16px] border border-border bg-surface p-5 md:grid-cols-[1fr_1fr_.65fr_auto] md:items-end">
      <label className="text-sm font-semibold">Nama<input name="name" required placeholder="Mobile Development" className={inputClass}/></label>
      <label className="text-sm font-semibold">Slug<input name="slug" required placeholder="mobile-development" className={inputClass}/></label>
      <label className="text-sm font-semibold">Icon key<input name="icon" defaultValue="globe" className={inputClass}/></label>
      <Button>Buat jenis</Button>
    </form>
    <div className="mt-6 divide-y divide-border overflow-hidden border border-border bg-surface">
      {types.map((type) => <Link key={type.id} href={`/owner/services?type=${encodeURIComponent(type.slug)}`} className="group relative flex min-h-20 flex-col justify-between gap-3 overflow-hidden px-4 py-5 transition-colors duration-200 hover:bg-accent-soft/45 focus-visible:bg-accent-soft/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus motion-reduce:transition-none sm:flex-row sm:items-center sm:px-5" aria-label={`Buka layanan jenis ${type.name}`}>
        <span className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none" aria-hidden="true" />
        <span className="font-display text-lg font-extrabold tracking-[-.025em] transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:translate-x-0 motion-reduce:transition-none">{type.name}</span>
        <span className="flex items-center gap-3 text-sm text-secondary"><span>{type._count.services} layanan · {type.isActive ? "Aktif" : "Nonaktif"}</span><ArrowUpRight className="size-4 text-primary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-none" aria-hidden="true" /></span>
      </Link>)}
    </div>
  </>;
}
