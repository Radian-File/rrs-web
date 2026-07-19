import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) { const [{ id }, { created }] = await Promise.all([params, searchParams]); const [service, types] = await Promise.all([prisma.service.findUnique({ where: { id } }), prisma.serviceType.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })]); if (!service) notFound(); const editable = { ...service, searchAliases: (service as { searchAliases?: string[] }).searchAliases ?? [], startingPrice: service.startingPrice?.toString() ?? null }; return <><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><Link href="/owner/services" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"><ArrowLeft className="size-4"/>Kembali ke layanan</Link>{service.isPublished && <Button asChild size="sm" variant="outline"><Link href={`/services/${service.slug}`} target="_blank"><ExternalLink className="size-4"/>Lihat publik</Link></Button>}</div>{created && <p role="status" className="mt-6 rounded-[10px] bg-accent-soft px-4 py-3 text-sm font-semibold text-primary">Layanan dibuat sebagai draf. Lengkapi informasi lalu publikasikan saat siap.</p>}<p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-primary">Edit layanan</p><h1 className="mt-3 font-display text-3xl font-extrabold">{service.title}</h1><div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor service={editable} types={types}/></div></>; }
