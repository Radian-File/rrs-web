import { FileText, FolderKanban, Home, MessageSquare, ReceiptText, UserRound } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";
import { requireClient } from "@/lib/authz";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const [client, locale] = await Promise.all([requireClient(), getLocale()]);
  const [dictionary, unreadCount] = await Promise.all([
    Promise.resolve(getDictionary(locale)),
    prisma.notification.count({ where: { userId: client.id, isRead: false } }),
  ]);
  const items = [
    { label: dictionary.portal.home, href: "/client", icon: Home },
    { label: dictionary.portal.projects, href: "/client/projects", icon: FolderKanban },
    { label: dictionary.portal.messages, href: "/client/messages", icon: MessageSquare },
    { label: dictionary.portal.quotations, href: "/client/quotations", icon: FileText },
    { label: dictionary.portal.profile, href: "/client/profile", icon: UserRound },
    { label: dictionary.portal.invoices, href: "/client/invoices", icon: ReceiptText },
  ];
  return <PortalShell kind="client" title={dictionary.portal.clientPortal} userLabel={client.name ?? client.email} unreadCount={unreadCount} items={items}>{children}</PortalShell>;
}
