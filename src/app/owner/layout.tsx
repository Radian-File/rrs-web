import { redirect } from "next/navigation";
import { FileText, FolderKanban, LayoutDashboard, MessageSquareText, ReceiptText, Settings, Star } from "lucide-react";
import { auth } from "@/auth";
import { PortalShell } from "@/components/layout/portal-shell";

const items = [
  { label: "Overview", href: "/owner", icon: LayoutDashboard },
  { label: "Inquiries", href: "/owner/inquiries", icon: MessageSquareText },
  { label: "Quotations", href: "/owner/quotations", icon: FileText },
  { label: "Projects", href: "/owner/projects", icon: FolderKanban },
  { label: "Invoices", href: "/owner/invoices", icon: ReceiptText },
  { label: "Reviews", href: "/owner/reviews", icon: Star },
  { label: "Settings", href: "/owner/settings", icon: Settings },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/owner");
  if (session.user.role !== "OWNER") redirect("/client");
  return <PortalShell title="Owner workspace" userLabel={session.user.name ?? session.user.email ?? "Owner"} items={items}>{children}</PortalShell>;
}
