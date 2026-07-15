"use server";
import { revalidatePath } from "next/cache";
import { requireOwner,requireUser } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import { getEmailProvider } from "@/lib/email/provider";
export async function markNotificationReadAction(formData:FormData){const user=await requireUser();const id=String(formData.get("notificationId")??"");await prisma.notification.updateMany({where:{id,userId:user.id},data:{isRead:true,readAt:new Date()}});revalidatePath("/client/notifications");revalidatePath("/owner/notifications")}
export async function processEmailDeliveriesAction(){await requireOwner();const deliveries=await prisma.notificationDelivery.findMany({where:{channel:"EMAIL",status:"PENDING"},include:{notification:{include:{user:true}}},orderBy:{createdAt:"asc"},take:20});const provider=getEmailProvider();for(const delivery of deliveries){try{await provider.send({to:delivery.notification.user.email,subject:delivery.notification.title,text:delivery.notification.message});await prisma.notificationDelivery.update({where:{id:delivery.id},data:{status:"SENT",sentAt:new Date(),attempts:{increment:1},lastError:null}})}catch(error){await prisma.notificationDelivery.update({where:{id:delivery.id},data:{status:"FAILED",attempts:{increment:1},lastError:error instanceof Error?error.message:"Delivery failed"}})}}revalidatePath("/owner/notifications")}
