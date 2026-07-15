import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card,CardContent } from "@/components/ui/card";
import { processEmailDeliveriesAction } from "@/features/notifications/actions";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function OwnerNotifications(){const owner=await requireOwner();const [notifications,pending]=await Promise.all([prisma.notification.findMany({where:{userId:owner.id},include:{deliveries:true},orderBy:{createdAt:"desc"},take:50}),prisma.notificationDelivery.count({where:{channel:"EMAIL",status:"PENDING"}})]);return <><div className="flex justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Notifications</p><h1 className="mt-3 font-display text-3xl font-extrabold">Operational alerts and delivery outbox.</h1></div><form action={processEmailDeliveriesAction}><Button variant="outline">Process email queue ({pending})</Button></form></div><div className="mt-8 space-y-3">{notifications.map((item)=><Card key={item.id}><CardContent><p className="font-semibold">{item.title}</p><p className="mt-2 text-sm text-secondary">{item.message}</p><div className="mt-3 flex gap-2">{item.deliveries.map((delivery)=><Badge key={delivery.id} variant="neutral">{delivery.channel}: {delivery.status}</Badge>)}</div></CardContent></Card>)}</div></>}
