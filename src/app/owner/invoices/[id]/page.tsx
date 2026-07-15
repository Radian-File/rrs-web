import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InvoiceDocument } from "@/components/invoice-document";
import { voidInvoiceAction } from "@/features/invoices/actions";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function OwnerInvoiceDetail({params}:{params:Promise<{id:string}>}){const {id}=await params;const invoice=await prisma.invoice.findUnique({where:{id},include:{client:true,project:true,paymentSchedule:true}});if(!invoice)notFound();return <><InvoiceDocument invoice={invoice}/>{!["PAID","REFUNDED","VOID"].includes(invoice.status)&&Number(invoice.paidAmount)===0&&<form action={voidInvoiceAction} className="mt-5 flex justify-end"><input type="hidden" name="invoiceId" value={invoice.id}/><Button variant="danger">Void Invoice</Button></form>}</>}
