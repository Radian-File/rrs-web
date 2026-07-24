import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { processEmailDeliveriesAction } from "@/features/notifications/actions";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function OwnerNotifications() {
  const owner = await requireOwner();
  const [notifications, pending] = await Promise.all([
    prisma.notification.findMany({ where: { userId: owner.id }, include: { deliveries: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.notificationDelivery.count({ where: { channel: "EMAIL", status: "PENDING" } }),
  ]);

  return <>
    <WorkspacePageHeader eyebrow="Notifications" title="Operational alerts and delivery outbox." description="The latest 50 Owner notifications and their recorded delivery states are shown. Pending email deliveries remain an explicit queue." actions={<form action={processEmailDeliveriesAction}><Button variant="outline">Process email queue ({pending})</Button></form>}/>
    {notifications.length === 0 ? <EmptyState className="mt-8" icon={Bell} title="No Owner notifications" description="Workflow and delivery alerts will appear here when recorded."/> : <div className="mt-8 space-y-3">{notifications.map((item)=><Card key={item.id}><CardContent><p className="font-semibold">{item.title}</p><p className="mt-2 text-sm leading-6 text-secondary">{item.message}</p><div className="mt-3 flex flex-wrap gap-2">{item.deliveries.map((delivery)=><Badge key={delivery.id} variant="neutral">{delivery.channel}: {delivery.status}</Badge>)}</div></CardContent></Card>)}</div>}
  </>;
}
