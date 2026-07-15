import { Card,CardContent } from "@/components/ui/card";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function ClientProfilePage(){const session=await requireClient();const user=await prisma.user.findUniqueOrThrow({where:{id:session.id}});return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Profile</p><h1 className="mt-3 font-display text-3xl font-extrabold">Client identity and contact details.</h1><Card className="mt-8 max-w-2xl"><CardContent><dl className="grid gap-5 sm:grid-cols-2">{[["Name",user.name],["Email",user.email],["WhatsApp",user.whatsappNumber??"—"],["Company",user.companyName??"—"]].map(([label,value])=><div key={label}><dt className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</dt><dd className="mt-2 font-semibold">{value}</dd></div>)}</dl></CardContent></Card></>}
