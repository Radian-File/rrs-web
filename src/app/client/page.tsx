import { auth } from "@/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderKanban } from "lucide-react";

export default async function ClientDashboard() {
  const session = await auth();
  return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Client overview</p><h1 className="mt-3 font-display text-3xl font-extrabold">Welcome, {session?.user.name?.split(" ")[0] ?? "Client"}.</h1><p className="mt-3 text-secondary">Your accepted quotations, active projects, files, and invoices will appear here.</p><EmptyState className="mt-8" icon={FolderKanban} title="No active project yet" description="Start with a project brief. After discussion and quotation approval, your project workspace will be created automatically." /></>;
}
