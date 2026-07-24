import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) { const [{ id }, { created }] = await Promise.all([params, searchParams]); const [service, types] = await Promise.all([prisma.service.findUnique({ where: { id } }), prisma.serviceType.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })]); if (!service) notFound(); const editable = { ...service, searchAliases: (service as { searchAliases?: string[] }).searchAliases ?? [], startingPrice: service.startingPrice?.toString() ?? null }; return <><WorkspacePageHeader eyebrow="Edit layanan" title={service.title} description="Perubahan publikasi mengatur katalog publik tanpa menghapus relasi historis." actions={<><Button asChild variant="outline"><Link href="/owner/services"><ArrowLeft className="size-4" aria-hidden="true"/>Kembali ke layanan</Link></Button>{service.isPublished && <Button asChild size="sm" variant="outline"><Link href={`/services/${service.slug}`} target="_blank"><ExternalLink className="size-4" aria-hidden="true"/>Lihat publik</Link></Button>}</>}/>{created && <p role="status" className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">Layanan dibuat sebagai draf. Lengkapi informasi lalu publikasikan saat siap.</p>}<div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor service={editable} types={types}/></div></>; }
