import { redirect } from "next/navigation";
import { BriefcaseBusiness, ChartNoAxesCombined, CreditCard, FileText, FolderKanban, LayoutDashboard, MessageSquareText, ReceiptText, Settings, Star } from "lucide-react";
import { auth } from "@/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { prisma } from "@/lib/db/prisma";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  if (!session?.user) redirect("/login?callbackUrl=/owner");
  if (session.user.role !== "OWNER") redirect("/client");
  const [dictionary, unreadCount] = await Promise.all([
    Promise.resolve(getDictionary(locale)),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ]);
  const items = [
    { label: dictionary.portal.overview, href: "/owner", icon: LayoutDashboard },
    { label: dictionary.portal.inquiries, href: "/owner/inquiries", icon: MessageSquareText },
    { label: dictionary.portal.services, href: "/owner/services", icon: BriefcaseBusiness },
    { label: dictionary.portal.quotations, href: "/owner/quotations", icon: FileText },
    { label: dictionary.portal.projects, href: "/owner/projects", icon: FolderKanban },
    { label: dictionary.portal.invoices, href: "/owner/invoices", icon: ReceiptText },
    { label: dictionary.portal.payments, href: "/owner/payments", icon: CreditCard },
    { label: dictionary.portal.reviews, href: "/owner/reviews", icon: Star },
    { label: dictionary.portal.analytics, href: "/owner/analytics", icon: ChartNoAxesCombined },
    { label: dictionary.portal.settings, href: "/owner/settings", icon: Settings },
  ];
  return <PortalShell kind="owner" title={dictionary.portal.ownerWorkspace} userLabel={session.user.name ?? session.user.email ?? "Owner"} unreadCount={unreadCount} items={items}>{children}</PortalShell>;
}
