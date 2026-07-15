import type { NotificationChannel, NotificationType, Prisma } from "@/generated/prisma/client";

type NotifyInput={userId:string;type:NotificationType;title:string;message:string;href?:string;metadata?:Prisma.InputJsonValue;channels?:NotificationChannel[]};
export async function enqueueNotification(tx:Prisma.TransactionClient,input:NotifyInput){const channels=input.channels??["IN_APP"];return tx.notification.create({data:{userId:input.userId,type:input.type,title:input.title,message:input.message,href:input.href,metadata:input.metadata,deliveries:{create:channels.map((channel)=>({channel,status:channel==="IN_APP"?"SENT":"PENDING",sentAt:channel==="IN_APP"?new Date():null}))}}})}
