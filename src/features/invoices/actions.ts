"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { allocateDocumentNumber } from "@/features/documents/sequence";

export async function createScheduleInvoiceAction(formData:FormData){await requireOwner();const data=z.object({projectId:z.string(),scheduleId:z.string(),dueDate:z.string().optional()}).parse(Object.fromEntries(formData));await prisma.$transaction(async(tx)=>{const schedule=await tx.paymentSchedule.findFirst({where:{id:data.scheduleId,projectId:data.projectId},include:{project:true,invoice:true}});if(!schedule||schedule.invoice)throw new Error("Payment schedule is invalid or already invoiced.");const invoiceNumber=await allocateDocumentNumber(tx,"INVOICE");await tx.invoice.create({data:{invoiceNumber,projectId:schedule.projectId,clientId:schedule.project.clientId,paymentScheduleId:schedule.id,currency:schedule.project.currency,subtotal:schedule.amount,total:schedule.amount,status:"ISSUED",issuedAt:new Date(),dueDate:data.dueDate?new Date(`${data.dueDate}T12:00:00+07:00`):new Date(Date.now()+7*24*60*60*1000)}});await tx.projectActivity.create({data:{projectId:schedule.projectId,type:"INVOICE_ISSUED",description:`${invoiceNumber} issued for ${schedule.title}.`}});});revalidatePath(`/owner/projects/${data.projectId}`);revalidatePath("/owner/invoices")}

export async function voidInvoiceAction(formData:FormData){await requireOwner();const invoiceId=z.string().parse(formData.get("invoiceId"));const invoice=await prisma.invoice.findUniqueOrThrow({where:{id:invoiceId}});if(["PAID","REFUNDED","VOID"].includes(invoice.status)||Number(invoice.paidAmount)>0)throw new Error("Paid or allocated invoices cannot be voided.");await prisma.invoice.update({where:{id:invoice.id},data:{status:"VOID",voidedAt:new Date()}});revalidatePath(`/owner/invoices/${invoice.id}`);revalidatePath("/owner/invoices")}

export async function refreshOverdueInvoicesAction(){await requireOwner();await prisma.invoice.updateMany({where:{status:{in:["ISSUED","PENDING","PARTIALLY_PAID"]},dueDate:{lt:new Date()}},data:{status:"OVERDUE"}});revalidatePath("/owner/invoices")}
