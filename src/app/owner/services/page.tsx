import Link from "next/link";
import { BriefcaseBusiness, Eye, EyeOff, Pencil, Plus, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { WorkspaceModule } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { importDefaultServiceCatalogAction, importServicesThreeCatalogAction } from "@/features/services/actions";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OwnerServicesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; catalog?: string; preset?: string; types?: string; services?: string; levels?: string; created?: string; updated?: string; skipped?: string; levelsCreated?: string; levelsUpdated?: string; levelsSkipped?: string }> }) {
  const { page: rawPage, q: rawQuery, type: rawType, catalog, preset, types: importedTypes, services: importedServices, levels: importedLevels, created, updated, skipped, levelsCreated, levelsUpdated, levelsSkipped } = await searchParams;
  const page = parsePage(rawPage);
  const q = rawQuery?.trim() ?? "";
  const selectedType = rawType ? await prisma.serviceType.findUnique({ where: { slug: rawType }, select: { id: true, name: true, slug: true, isActive: true } }) : null;
  const filter = { ...(selectedType ? { serviceTypeId: selectedType.id } : {}), ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q, mode: "insensitive" as const } }, { category: { contains: q, mode: "insensitive" as const } }] } : {}) };
  const [rows, total, published] = await Promise.all([
    prisma.service.findMany({ where: filter, orderBy: [{ isPublished: "asc" }, { category: "asc" }, { title: "asc" }], skip: (page - 1) * pageSize, take: pageSize + 1, select: { id: true, isPublished: true, isFeatured: true, catalogKind: true, showInPricingGuide: true, title: true, category: true, startingPrice: true, summary: true, updatedAt: true, _count: { select: { complexityLevels: true } } } }),
    prisma.service.count(),
    prisma.service.count({ where: { isPublished: true } }),
  ]);
  const hasNext = rows.length > pageSize;
  const services = rows.slice(0, pageSize);

  return <>
    <WorkspacePageHeader eyebrow="Layanan" title="Kelola katalog yang ditampilkan ke Client." description="Draf tidak tampil di halaman publik. Unpublish mempertahankan riwayat quotation dan inquiry tanpa menghapus relasinya." actions={<><form className="relative w-full sm:w-72">{selectedType ? <input type="hidden" name="type" value={selectedType.slug} /> : null}<Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-secondary" aria-hidden="true"/><Input name="q" defaultValue={q} placeholder="Cari layanan atau kategori" aria-label="Cari layanan" className="pl-10"/></form><form action={importDefaultServiceCatalogAction}><Button type="submit" variant="outline">Impor katalog default</Button></form><form action={importServicesThreeCatalogAction}><Button type="submit" variant="outline">Impor preset Services III</Button></form><Button asChild variant="outline"><Link href="/owner/services/types">Jenis layanan</Link></Button><Button asChild><Link href={selectedType?.isActive ? `/owner/services/create?type=${encodeURIComponent(selectedType.slug)}` : "/owner/services/create"}><Plus className="size-4" aria-hidden="true"/>{selectedType?.isActive ? `Buat layanan di ${selectedType.name}` : "Buat layanan"}</Link></Button></>}/>
    {catalog === "imported" ? <p role="status" className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">Katalog default diperiksa: {importedTypes ?? "0"} jenis, {importedServices ?? "0"} layanan, dan {importedLevels ?? "0"} level baru ditambahkan; {skipped ?? "0"} layanan existing tidak diubah.</p> : null}
    {preset === "services-three" ? <p role="status" className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">Preset Services III selesai: {created ?? "0"} layanan draft baru, {updated ?? "0"} layanan draft diperbarui, {levelsCreated ?? "0"} level baru, dan {levelsUpdated ?? "0"} level draft diperbarui. {skipped ?? "0"} layanan historis/published serta {levelsSkipped ?? "0"} level published tidak diubah.</p> : null}
    <dl className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
      <Metric label="Total layanan" value={total}/><Metric label="Sudah dipublikasikan" value={published}/><Metric label="Draf / belum tayang" value={total-published}/>
    </dl>
    {selectedType ? <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-primary/20 bg-accent-soft/50 px-4 py-3 text-sm"><p><span className="font-semibold">Jenis aktif:</span> {selectedType.name}{q ? ` · Pencarian: “${q}”` : ""}</p><Button asChild size="sm" variant="outline"><Link href="/owner/services">Tampilkan semua layanan</Link></Button></div> : null}
    {services.length === 0 ? <EmptyState className="mt-8" icon={BriefcaseBusiness} title={page > 1 ? "Tidak ada layanan di halaman ini" : selectedType ? `Belum ada layanan di ${selectedType.name}` : "Belum ada layanan"} description={page > 1 ? "Kembali ke halaman pertama untuk melihat record layanan." : selectedType?.isActive ? `Buat layanan pertama yang langsung masuk ke jenis ${selectedType.name}.` : "Buat layanan pertama atau jalankan seed untuk memuat referensi layanan."}/> : <div className="mt-8 grid gap-5 lg:grid-cols-2">{services.map((service) => <WorkspaceModule key={service.id} titleId={`service-${service.id}`}><div className="p-5 md:p-6"><div className="flex justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge variant={service.isPublished ? "success" : "neutral"}>{service.isPublished ? "Published" : "Draft"}</Badge>{service.catalogKind === "MICRO_TASK" && <Badge variant="warning">Micro Task</Badge>}{service.showInPricingGuide && <Badge>Project Fit Guide</Badge>}{service.isFeatured && <Badge><Star className="size-3" aria-hidden="true"/>Unggulan</Badge>}</div><h2 id={`service-${service.id}`} className="mt-4 font-display text-xl font-extrabold">{service.title}</h2><p className="mt-2 text-sm text-secondary">{service.category} · {service.startingPrice ? `Mulai dari ${formatIdr(service.startingPrice.toString())}` : "Custom scope"}</p><p className="mt-1 text-xs text-secondary">{service._count.complexityLevels > 0 ? `${service._count.complexityLevels} level tersedia` : "Tanpa complexity level"}</p></div>{service.isPublished ? <Eye className="size-5 shrink-0 text-success" aria-label="Dipublikasikan"/> : <EyeOff className="size-5 shrink-0 text-secondary" aria-label="Draf"/>}</div><p className="mt-5 line-clamp-2 text-sm leading-6 text-secondary">{service.summary}</p><div className="mt-6 flex flex-col justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center"><p className="text-xs text-secondary">Diperbarui {service.updatedAt.toLocaleDateString("id-ID")}</p><Button asChild size="sm" variant="outline"><Link href={`/owner/services/${service.id}/edit`}><Pencil className="size-4" aria-hidden="true"/>Edit</Link></Button></div></div></WorkspaceModule>)}</div>}
    <PaginationControls pathname="/owner/services" page={page} hasNext={hasNext} params={{ q: q || undefined, type: selectedType?.slug }}/>
  </>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-surface p-5 md:p-6"><dt className="text-[10px] font-bold uppercase tracking-[.14em] text-muted">{label}</dt><dd className="mt-3 font-display text-4xl font-extrabold tabular-nums">{value}</dd></div>;
}
