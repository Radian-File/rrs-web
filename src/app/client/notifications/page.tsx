import Link from "next/link";
import { Bell, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { WorkspaceModule, WorkspaceModuleHeader } from "@/components/workspace/workspace-module";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import { markNotificationReadAction } from "@/features/notifications/actions";
import { requireClient } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ClientNotifications() {
  const user = await requireClient();
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <>
      <WorkspacePageHeader
        eyebrow="Notifications"
        title="Project and payment updates."
        description="The latest 50 notifications are shown in recorded order; unread state is explicit and can be cleared individually."
      />

      {notifications.length === 0 ? (
        <EmptyState className="mt-8" icon={Bell} title="No notifications yet" description="Project, quotation, payment, and delivery updates will appear here when recorded." />
      ) : (
        <WorkspaceModule titleId="client-notification-records" className="mt-8">
          <WorkspaceModuleHeader
            titleId="client-notification-records"
            eyebrow={`${unreadCount} unread`}
            title="Recorded updates"
            description="Notification links open only the protected destination stored by the workflow."
          />
          <ol className="divide-y divide-border">
            {notifications.map((notification) => (
              <li key={notification.id} className={notification.isRead ? "bg-background/20" : "bg-surface"}>
                <div className="grid gap-4 px-5 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start md:px-6">
                  <span className={`mt-1 grid size-9 place-items-center rounded-full border ${notification.isRead ? "border-border bg-surface-container text-muted" : "border-primary/25 bg-accent-soft text-primary"}`}>
                    <Circle className={`size-2.5 ${notification.isRead ? "fill-muted" : "fill-primary"}`} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{notification.title}</p>
                    <p className="mt-2 text-sm leading-6 text-secondary">{notification.message}</p>
                    <time className="mt-2 block text-xs text-muted" dateTime={notification.createdAt.toISOString()}>{notification.createdAt.toLocaleString("id-ID")}</time>
                    {notification.href && <Link href={notification.href} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-primary hover:underline">Open details</Link>}
                  </div>
                  {!notification.isRead && (
                    <form action={markNotificationReadAction}>
                      <input type="hidden" name="notificationId" value={notification.id} />
                      <Button size="sm" variant="ghost">Mark read</Button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </WorkspaceModule>
      )}
    </>
  );
}
