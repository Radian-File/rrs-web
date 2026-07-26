import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { ServiceComplexityLevelEditor } from "@/features/services/service-complexity-level-editor";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const [service, types] = await Promise.all([
    prisma.service.findUnique({
      where: { id },
      include: { complexityLevels: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.serviceType.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  if (!service) notFound();

  const editable = {
    ...service,
    searchAliases: service.searchAliases ?? [],
    startingPrice: service.startingPrice?.toString() ?? null,
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
      <div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor service={editable} types={types} /></div>
      {service.catalogKind === "PROJECT" && service.complexityLevels.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">Project Fit & Complexity Guide</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">Level adalah context discovery non-binding. Publikasikan level hanya setelah copy, estimate, capability, dan batas scope siap untuk Client.</p>
          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            {service.complexityLevels.map((level) => (
              <ServiceComplexityLevelEditor
                key={level.id}
                level={{ ...level, startingPrice: level.startingPrice?.toString() ?? null }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
