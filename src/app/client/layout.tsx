import { redirect } from "next/navigation";
import { FileText, FolderKanban, Home, MessageSquare, ReceiptText, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { PortalShell } from "@/components/layout/portal-shell";

const items = [
  { label: "Home", href: "/client", icon: Home },
  { label: "Projects", href: "/client/projects", icon: FolderKanban },
  { label: "Messages", href: "/client/messages", icon: MessageSquare },
  { label: "Quotations", href: "/client/quotations", icon: FileText },
  { label: "Profile", href: "/client/profile", icon: UserRound },
  { label: "Invoices", href: "/client/invoices", icon: ReceiptText },
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/client");
  if (session.user.role === "OWNER") redirect("/owner");
  return <PortalShell title="Client portal" userLabel={session.user.name ?? session.user.email ?? "Client"} items={items}>{children}</PortalShell>;
}
