import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card,CardContent } from "@/components/ui/card";
import { markNotificationReadAction } from "@/features/notifications/actions";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
export const dynamic="force-dynamic";
export default async function ClientNotifications(){const user=await requireClient();const notifications=await prisma.notification.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:50});return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Notifications</p><h1 className="mt-3 font-display text-3xl font-extrabold">Project and payment updates.</h1><div className="mt-8 space-y-3">{notifications.map((item)=><Card key={item.id} className={item.isRead?"opacity-70":""}><CardContent><div className="flex justify-between gap-4"><div><p className="font-semibold">{item.title}</p><p className="mt-2 text-sm leading-6 text-secondary">{item.message}</p><p className="mt-2 text-xs text-secondary">{item.createdAt.toLocaleString("id-ID")}</p>{item.href&&<Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Open details</Link>}</div>{!item.isRead&&<form action={markNotificationReadAction}><input type="hidden" name="notificationId" value={item.id}/><Button size="sm" variant="ghost">Mark read</Button></form>}</div></CardContent></Card>)}</div></>}
