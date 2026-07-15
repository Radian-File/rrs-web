import { notFound } from "next/navigation";
import { InvoiceDocument } from "@/components/invoice-document";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function ClientInvoiceDetail({params}:{params:Promise<{id:string}>}){const user=await requireClient();const {id}=await params;const invoice=await prisma.invoice.findFirst({where:{id,clientId:user.id},include:{client:true,project:true,paymentSchedule:true}});if(!invoice)notFound();return <InvoiceDocument invoice={invoice}/>}
