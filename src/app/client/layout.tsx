import { redirect } from "next/navigation";
import { FileText, FolderKanban, Home, MessageSquare, ReceiptText, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  if (!session?.user) redirect("/login?callbackUrl=/client");
  if (session.user.role === "OWNER") redirect("/owner");
  const [dictionary, unreadCount] = await Promise.all([
    Promise.resolve(getDictionary(locale)),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ]);
  const items = [
    { label: dictionary.portal.home, href: "/client", icon: Home },
    { label: dictionary.portal.projects, href: "/client/projects", icon: FolderKanban },
    { label: dictionary.portal.messages, href: "/client/messages", icon: MessageSquare },
    { label: dictionary.portal.quotations, href: "/client/quotations", icon: FileText },
    { label: dictionary.portal.profile, href: "/client/profile", icon: UserRound },
    { label: dictionary.portal.invoices, href: "/client/invoices", icon: ReceiptText },
  ];
  return <PortalShell kind="client" title={dictionary.portal.clientPortal} userLabel={session.user.name ?? session.user.email ?? "Client"} unreadCount={unreadCount} items={items}>{children}</PortalShell>;
}
