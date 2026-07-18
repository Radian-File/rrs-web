import Link from "next/link";
import { ArrowRight, Bell, FileText, FolderKanban, ReceiptText, Star, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getClientDashboard } from "@/features/client-dashboard/query";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";

export default async function ClientDashboard() {
  const [client, locale] = await Promise.all([requireClient(), getLocale()]);
  const [dictionary, dashboard] = await Promise.all([Promise.resolve(getDictionary(locale)), getClientDashboard(client.id)]);
  const hasWork = dashboard.activeProject || dashboard.pendingAgreement || dashboard.payableInvoice || dashboard.completedProject;
  return <><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{dictionary.dashboard.clientEyebrow}</p><h1 className="mt-3 font-display text-3xl font-extrabold">{dictionary.dashboard.clientWelcome}, {client.name.split(" ")[0] ?? "Client"}.</h1><p className="mt-3 text-secondary">{hasWork ? "Here is the work that needs your attention." : dictionary.dashboard.clientDescription}</p>
    {hasWork ? <div className="mt-8 grid gap-4 lg:grid-cols-2">
      {dashboard.pendingAgreement && <ActionCard icon={FileText} title="Agreement ready to review" description={`${dashboard.pendingAgreement.title} is waiting for your agreement approval.`} href={`/client/projects/${dashboard.pendingAgreement.id}/agreement`} label="Review Agreement" />}
      {dashboard.payableInvoice && <ActionCard icon={ReceiptText} title={dashboard.payableInvoice.status === "OVERDUE" ? "Invoice overdue" : "Payment needs attention"} description={`${dashboard.payableInvoice.invoiceNumber} · ${dashboard.payableInvoice.project.title}`} href={`/client/invoices/${dashboard.payableInvoice.id}`} label="View Invoice" />}
      {dashboard.activeProject && <ActionCard icon={FolderKanban} title="Current project" description={`${dashboard.activeProject.title} · ${dashboard.activeProject.status.replaceAll("_", " ")}`} href={`/client/projects/${dashboard.activeProject.id}`} label="Open Project" />}
      {dashboard.completedProject && <ActionCard icon={Star} title="Share a verified review" description={dashboard.completedProject.reviewInvite && !dashboard.completedProject.reviewInvite.revokedAt && !dashboard.completedProject.reviewInvite.usedAt && dashboard.completedProject.reviewInvite.expiresAt > new Date() ? `${dashboard.completedProject.title} is ready for your review.` : "Ask RRS to resend your review invitation if you need a new link."} href={`/client/projects/${dashboard.completedProject.id}`} label="Open Project" />}
      {dashboard.unreadNotifications > 0 && <ActionCard icon={Bell} title="Unread updates" description={`${dashboard.unreadNotifications} notification${dashboard.unreadNotifications === 1 ? "" : "s"} need your attention.`} href="/client/notifications" label="View Notifications" />}
    </div> : <><EmptyState className="mt-8" icon={FolderKanban} title={dictionary.dashboard.noActiveProject} description={dictionary.dashboard.noActiveProjectDescription} /><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/services">{dictionary.dashboard.exploreServices}<ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/start-project">{dictionary.dashboard.startProject}<ArrowRight className="size-4" /></Link></Button></div></>}
  </>;
}
function ActionCard({ icon: Icon, title, description, href, label }: { icon: LucideIcon; title: string; description: string; href: string; label: string }) { return <Card><CardContent className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-primary"><Icon className="size-5"/></span><div className="min-w-0 flex-1"><h2 className="font-display text-lg font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-secondary">{description}</p><Button asChild size="sm" variant="outline" className="mt-4"><Link href={href}>{label}<ArrowRight className="size-4"/></Link></Button></div></CardContent></Card>; }
