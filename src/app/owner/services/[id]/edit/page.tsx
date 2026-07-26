import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { initializeServiceComplexityLevelsAction } from "@/features/services/actions";
import { ServiceComplexityLevelEditor } from "@/features/services/service-complexity-level-editor";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; levels?: string }>;
}) {
  const [{ id }, { created, levels: levelsStatus }] = await Promise.all([params, searchParams]);
  const [service, types] = await Promise.all([
    prisma.service.findUnique({
      where: { id },
      include: { complexityLevels: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.serviceType.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  if (!service) notFound();

  const { complexityLevels, ...serviceRecord } = service;
  const editable = {
    ...serviceRecord,
    searchAliases: serviceRecord.searchAliases ?? [],
    startingPrice: serviceRecord.startingPrice?.toString() ?? null,
  };

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Edit layanan"
        title={service.title}
        description="Perubahan publikasi mengatur katalog publik tanpa menghapus relasi historis. Harga final tetap berasal dari quotation Owner."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/owner/services"><ArrowLeft className="size-4" aria-hidden="true" />Kembali ke layanan</Link>
            </Button>
            {service.isPublished ? (
              <Button asChild size="sm" variant="outline">
                <Link href={`/services/${service.slug}`} target="_blank"><ExternalLink className="size-4" aria-hidden="true" />Lihat publik</Link>
              </Button>
            ) : null}
          </>
        }
      />
      {created ? <p role="status" className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">Layanan dibuat sebagai draf. Lengkapi informasi lalu publikasikan saat siap.</p> : null}
      {levelsStatus === "initialized" ? <p role="status" className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">Draft Level 1–3 telah dibuat. Lengkapi lalu publish level yang siap ditampilkan ke Client.</p> : null}
      <div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor service={editable} types={types} /></div>
      {service.catalogKind === "PROJECT" ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">Project Fit & Complexity Guide</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">Level adalah context discovery non-binding. Publikasikan level hanya setelah copy, estimate, capability, dan batas scope siap untuk Client.</p>
          {complexityLevels.length > 0 ? <div className="mt-5 grid gap-5 xl:grid-cols-3">{complexityLevels.map((level) => <ServiceComplexityLevelEditor key={level.id} level={{ ...level, startingPrice: level.startingPrice?.toString() ?? null }} />)}</div> : <div className="mt-5 rounded-[16px] border border-dashed border-border-strong bg-surface-container/40 p-5"><p className="text-sm font-semibold">Belum ada level untuk layanan ini.</p><p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">Buat draft Level 1–3 agar Owner dapat mengatur copy, indikator, estimate, dan status publish untuk Client.</p><form action={initializeServiceComplexityLevelsAction} className="mt-5"><input type="hidden" name="serviceId" value={service.id} /><Button type="submit">Buat draft Level 1–3</Button></form></div>}
        </section>
      ) : null}
    </>
  );
}
