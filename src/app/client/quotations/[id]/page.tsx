import { notFound } from "next/navigation";
import { Card,CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { formatIdr } from "@/lib/utils";
export const dynamic="force-dynamic";
export default async function ClientQuotationDetail({params}:{params:Promise<{id:string}>}){const user=await requireClient();const {id}=await params;const quote=await prisma.quotation.findFirst({where:{id,OR:[{clientId:user.id},{clientEmail:user.email??undefined}]},include:{items:{orderBy:{sequence:"asc"}},paymentTerms:{orderBy:{sequence:"asc"}}}});if(!quote)notFound();return <><Badge>{quote.status.replaceAll("_"," ")}</Badge><h1 className="mt-3 font-display text-3xl font-extrabold">{quote.projectTitle}</h1><p className="mt-2 text-sm text-secondary">{quote.quotationNumber} v{quote.version}</p><Card className="mt-8"><CardContent><div className="divide-y divide-border">{quote.items.map((item)=><div key={item.id} className="flex justify-between gap-5 py-4"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-secondary">{item.description}</p></div><p className="font-semibold">{formatIdr(item.total.toString())}</p></div>)}</div><div className="mt-5 flex justify-between border-t border-border pt-5 font-display text-xl font-extrabold text-primary"><span>Total</span><span>{formatIdr(quote.total.toString())}</span></div></CardContent></Card></>}
