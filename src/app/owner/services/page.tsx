import Link from "next/link";
import { BriefcaseBusiness, Eye, EyeOff, Pencil, Plus, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PaginationControls, pageSize, parsePage } from "@/components/ui/pagination-controls";
import { WorkspaceModule } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { publishServicesThreeCatalogAction } from "@/features/services/actions";
import { defaultCatalogServiceSlugs } from "@/features/services/catalog-defaults";
import { servicesThreeCatalog } from "@/features/services/services-iii-catalog";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OwnerServicesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string; drafts?: string; publishedServices?: string; publishedLevels?: string }> }) {
  const { page: rawPage, q: rawQuery, type: rawType, drafts, publishedServices, publishedLevels } = await searchParams;
  const page = parsePage(rawPage);
  const q = rawQuery?.trim() ?? "";
  const visibleDraftPresets = new Set((drafts ?? "").split(",").filter((preset): preset is "default" | "services-three" => preset === "default" || preset === "services-three"));
  const showDefaultDrafts = visibleDraftPresets.has("default");
  const showServicesThreeDrafts = visibleDraftPresets.has("services-three");
  const servicesThreeDraftSlugs = [...new Set(servicesThreeCatalog.flatMap((service) => [service.slug, ...service.matchSlugs]))];
  const allPresetDraftSlugs = [...new Set([...defaultCatalogServiceSlugs, ...servicesThreeDraftSlugs])];
  const selectedType = rawType ? await prisma.serviceType.findUnique({ where: { slug: rawType }, select: { id: true, name: true, slug: true, isActive: true } }) : null;
  const visibilityFilter = {
    OR: [
      { isPublished: true },
      { isPublished: false, slug: { notIn: allPresetDraftSlugs } },
      ...(showDefaultDrafts ? [{ isPublished: false, slug: { in: defaultCatalogServiceSlugs } }] : []),
      ...(showServicesThreeDrafts ? [{ isPublished: false, slug: { in: servicesThreeDraftSlugs } }] : []),
    ],
  };
  const filter = { AND: [visibilityFilter, ...(selectedType ? [{ serviceTypeId: selectedType.id }] : []), ...(q ? [{ OR: [{ title: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q, mode: "insensitive" as const } }, { category: { contains: q, mode: "insensitive" as const } }] }] : [])] };
  const [rows, total, published, servicesThreeDraftCount, servicesThreeDraftLevelCount] = await Promise.all([
    prisma.service.findMany({ where: filter, orderBy: [{ isPublished: "asc" }, { category: "asc" }, { title: "asc" }], skip: (page - 1) * pageSize, take: pageSize + 1, select: { id: true, isPublished: true, isFeatured: true, catalogKind: true, showInPricingGuide: true, title: true, category: true, startingPrice: true, summary: true, updatedAt: true, _count: { select: { complexityLevels: true } } } }),
    prisma.service.count({ where: filter }),
    prisma.service.count({ where: { AND: [filter, { isPublished: true }] } }),
    prisma.service.count({ where: { slug: { in: servicesThreeDraftSlugs }, isPublished: false } }),
    prisma.serviceComplexityLevel.count({ where: { isPublished: false, service: { slug: { in: servicesThreeDraftSlugs }, isPublished: false } } }),
  ]);
  const hasNext = rows.length > pageSize;
  const services = rows.slice(0, pageSize);

  const currentDrafts = [...visibleDraftPresets].sort().join(",");
  const togglePresetHref = (preset: "default" | "services-three") => {
    const next = new Set(visibleDraftPresets);
    if (next.has(preset)) next.delete(preset); else next.add(preset);
    return ownerServicesHref({ q, type: selectedType?.slug, drafts: [...next].sort().join(",") });
  };

  return <>
    <WorkspacePageHeader eyebrow="Layanan" title="Kelola katalog yang ditampilkan ke Client." description="Draf tidak tampil di halaman publik. Preset draft dapat ditampilkan atau disembunyikan dari daftar Owner tanpa mengubah data." actions={<><form className="relative w-full sm:w-72">{selectedType ? <input type="hidden" name="type" value={selectedType.slug} /> : null}{currentDrafts ? <input type="hidden" name="drafts" value={currentDrafts} /> : null}<Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-secondary" aria-hidden="true"/><Input name="q" defaultValue={q} placeholder="Cari layanan atau kategori" aria-label="Cari layanan" className="pl-10"/></form><Button asChild variant={showDefaultDrafts ? "secondary" : "outline"}><Link href={togglePresetHref("default")}>{showDefaultDrafts ? "Sembunyikan draft default" : "Tampilkan draft default"}</Link></Button><Button asChild variant={showServicesThreeDrafts ? "secondary" : "outline"}><Link href={togglePresetHref("services-three")}>{showServicesThreeDrafts ? "Sembunyikan draft Services III" : "Tampilkan draft Services III"}</Link></Button><Button asChild variant="outline"><Link href="/owner/services/types">Jenis layanan</Link></Button><Button asChild><Link href={selectedType?.isActive ? `/owner/services/create?type=${encodeURIComponent(selectedType.slug)}` : "/owner/services/create"}><Plus className="size-4" aria-hidden="true"/>{selectedType?.isActive ? `Buat layanan di ${selectedType.name}` : "Buat layanan"}</Link></Button></>}/>
    <p className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm text-primary">{showDefaultDrafts || showServicesThreeDrafts ? "Draft preset yang dipilih sedang ditampilkan di daftar Owner. Menyembunyikannya tidak menghapus atau mengubah status layanan." : "Draft katalog default dan Services III sedang disembunyikan dari daftar Owner. Gunakan tombol di atas untuk menampilkannya."}</p>
    {publishedServices ? <p role="status" className="mt-4 rounded-[10px] bg-success-soft px-4 py-3 text-sm font-semibold text-success">Services III dipublikasikan: {publishedServices} layanan dan {publishedLevels ?? "0"} Level Project Fit sekarang tampil untuk Client.</p> : null}
    {showServicesThreeDrafts && servicesThreeDraftCount > 0 ? <section className="mt-6 rounded-[16px] border border-primary/25 bg-accent-soft/35 p-5 md:p-6" aria-labelledby="publish-services-three-title"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-start"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">Aksi publish massal</p><h2 id="publish-services-three-title" className="mt-2 font-display text-2xl font-extrabold">Publish draft Services III</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">Aksi ini akan mempublikasikan {servicesThreeDraftCount} layanan Services III dan {servicesThreeDraftLevelCount} Level Project Fit yang masih draft. Quotation, inquiry, dan data layanan lain tidak berubah.</p></div><form action={publishServicesThreeCatalogAction} className="space-y-3"><label className="flex max-w-xs items-start gap-2 text-xs leading-5 text-secondary"><input name="confirmed" type="checkbox" value="publish-services-three" required className="mt-1 size-4 accent-primary"/>Saya memahami layanan dan Level Project Fit ini akan tampil di halaman publik.</label><Button type="submit">Publish {servicesThreeDraftCount} layanan Services III</Button></form></div></section> : null}
    <dl className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
      <Metric label="Layanan terlihat" value={total}/><Metric label="Sudah dipublikasikan" value={published}/><Metric label="Draf terlihat" value={total-published}/>
    </dl>
    {selectedType ? <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-primary/20 bg-accent-soft/50 px-4 py-3 text-sm"><p><span className="font-semibold">Jenis aktif:</span> {selectedType.name}{q ? ` · Pencarian: “${q}”` : ""}</p><Button asChild size="sm" variant="outline"><Link href="/owner/services">Tampilkan semua layanan</Link></Button></div> : null}
    {services.length === 0 ? <EmptyState className="mt-8" icon={BriefcaseBusiness} title={page > 1 ? "Tidak ada layanan di halaman ini" : selectedType ? `Belum ada layanan di ${selectedType.name}` : "Belum ada layanan"} description={page > 1 ? "Kembali ke halaman pertama untuk melihat record layanan." : selectedType?.isActive ? `Buat layanan pertama yang langsung masuk ke jenis ${selectedType.name}.` : "Buat layanan pertama atau jalankan seed untuk memuat referensi layanan."}/> : <div className="mt-8 grid gap-5 lg:grid-cols-2">{services.map((service) => <WorkspaceModule key={service.id} titleId={`service-${service.id}`}><div className="p-5 md:p-6"><div className="flex justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge variant={service.isPublished ? "success" : "neutral"}>{service.isPublished ? "Published" : "Draft"}</Badge>{service.catalogKind === "MICRO_TASK" && <Badge variant="warning">Micro Task</Badge>}{service.showInPricingGuide && <Badge>Project Fit Guide</Badge>}{service.isFeatured && <Badge><Star className="size-3" aria-hidden="true"/>Unggulan</Badge>}</div><h2 id={`service-${service.id}`} className="mt-4 font-display text-xl font-extrabold">{service.title}</h2><p className="mt-2 text-sm text-secondary">{service.category} · {service.startingPrice ? `Mulai dari ${formatIdr(service.startingPrice.toString())}` : "Custom scope"}</p><p className="mt-1 text-xs text-secondary">{service._count.complexityLevels > 0 ? `${service._count.complexityLevels} level tersedia` : "Tanpa complexity level"}</p></div>{service.isPublished ? <Eye className="size-5 shrink-0 text-success" aria-label="Dipublikasikan"/> : <EyeOff className="size-5 shrink-0 text-secondary" aria-label="Draf"/>}</div><p className="mt-5 line-clamp-2 text-sm leading-6 text-secondary">{service.summary}</p><div className="mt-6 flex flex-col justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center"><p className="text-xs text-secondary">Diperbarui {service.updatedAt.toLocaleDateString("id-ID")}</p><Button asChild size="sm" variant="outline"><Link href={`/owner/services/${service.id}/edit`}><Pencil className="size-4" aria-hidden="true"/>Edit</Link></Button></div></div></WorkspaceModule>)}</div>}
    <PaginationControls pathname="/owner/services" page={page} hasNext={hasNext} params={{ q: q || undefined, type: selectedType?.slug, drafts: currentDrafts || undefined }}/>
  </>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-surface p-5 md:p-6"><dt className="text-[10px] font-bold uppercase tracking-[.14em] text-muted">{label}</dt><dd className="mt-3 font-display text-4xl font-extrabold tabular-nums">{value}</dd></div>;
}

function ownerServicesHref({ q, type, drafts }: { q?: string; type?: string; drafts?: string }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  if (drafts) params.set("drafts", drafts);
  const query = params.toString();
  return `/owner/services${query ? `?${query}` : ""}`;
}
