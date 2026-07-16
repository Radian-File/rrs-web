import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceEditor } from "@/features/services/service-editor";
import { prisma } from "@/lib/db/prisma";
export default async function CreateServicePage() { const types=await prisma.serviceType.findMany({where:{isActive:true},orderBy:[{sortOrder:"asc"},{name:"asc"}]}); return <><Link href="/owner/services" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"><ArrowLeft className="size-4"/>Kembali ke layanan</Link><p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-primary">Layanan baru</p><h1 className="mt-3 font-display text-3xl font-extrabold">Susun referensi layanan.</h1><div className="mt-8 rounded-[20px] border border-border bg-surface p-6 md:p-8"><ServiceEditor types={types}/></div></>; }
