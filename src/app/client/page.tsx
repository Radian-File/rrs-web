import Link from "next/link";
import { ArrowRight, Bell, FileText, FolderKanban, ReceiptText, Star, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getClientDashboard } from "@/features/client-dashboard/query";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";

export default async function ClientDashboard() {
  const [client, locale] = await Promise.all([requireClient(), getLocale()]);
  const [dictionary, dashboard] = await Promise.all([Promise.resolve(getDictionary(locale)), getClientDashboard(client.id)]);
  const isId = locale === "id";
  const hasWork = dashboard.activeProject || dashboard.pendingAgreement || dashboard.payableInvoice || dashboard.completedProject || dashboard.unreadNotifications > 0;
  const firstName = client.name.split(" ")[0] || "Client";

  const actions: Array<{ icon: LucideIcon; title: string; description: string; href: string; label: string; tone?: "warning" }> = [];
  if (dashboard.pendingAgreement) actions.push({ icon: FileText, title: isId ? "Agreement siap ditinjau" : "Agreement ready to review", description: isId ? `${dashboard.pendingAgreement.title} menunggu persetujuan agreement Anda.` : `${dashboard.pendingAgreement.title} is waiting for your agreement approval.`, href: `/client/projects/${dashboard.pendingAgreement.id}/agreement`, label: isId ? "Tinjau agreement" : "Review agreement" });
  if (dashboard.payableInvoice) actions.push({ icon: ReceiptText, title: dashboard.payableInvoice.status === "OVERDUE" ? (isId ? "Invoice melewati jatuh tempo" : "Invoice overdue") : (isId ? "Pembayaran perlu ditinjau" : "Payment needs attention"), description: `${dashboard.payableInvoice.invoiceNumber} · ${dashboard.payableInvoice.project.title}`, href: `/client/invoices/${dashboard.payableInvoice.id}`, label: isId ? "Lihat invoice" : "View invoice", tone: "warning" });
  if (dashboard.activeProject) actions.push({ icon: FolderKanban, title: isId ? "Project aktif" : "Current project", description: `${dashboard.activeProject.title} · ${dashboard.activeProject.status.replaceAll("_", " ")}`, href: `/client/projects/${dashboard.activeProject.id}`, label: isId ? "Buka project" : "Open project" });
  if (dashboard.completedProject) actions.push({ icon: Star, title: isId ? "Bagikan review terverifikasi" : "Share a verified review", description: dashboard.completedProject.reviewInvite && !dashboard.completedProject.reviewInvite.revokedAt && !dashboard.completedProject.reviewInvite.usedAt && dashboard.completedProject.reviewInvite.expiresAt > new Date() ? (isId ? `${dashboard.completedProject.title} siap untuk diulas.` : `${dashboard.completedProject.title} is ready for your review.`) : (isId ? "Hubungi RRS jika Anda memerlukan undangan review baru." : "Ask RRS to resend the review invitation if you need a new link."), href: `/client/projects/${dashboard.completedProject.id}`, label: isId ? "Buka project" : "Open project" });
  if (dashboard.unreadNotifications > 0) actions.push({ icon: Bell, title: isId ? "Pembaruan belum dibaca" : "Unread updates", description: isId ? `${dashboard.unreadNotifications} notifikasi memerlukan perhatian Anda.` : `${dashboard.unreadNotifications} notification${dashboard.unreadNotifications === 1 ? "" : "s"} need your attention.`, href: "/client/notifications", label: isId ? "Lihat notifikasi" : "View notifications" });

  return <>
    <header className="border-b border-border pb-8"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">{dictionary.dashboard.clientEyebrow}</p><h1 className="mt-4 font-display text-4xl font-bold tracking-[-.05em] md:text-5xl">{dictionary.dashboard.clientWelcome}, {firstName}.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-secondary">{hasWork ? (isId ? "Berikut pekerjaan dan keputusan yang memerlukan perhatian Anda." : "Here are the work items and decisions that need your attention.") : dictionary.dashboard.clientDescription}</p></header>
    {hasWork ? <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label={isId ? "Perlu perhatian" : "Needs attention"}>{actions.map((action, index) => <ActionCard key={`${action.href}-${action.title}`} {...action} index={index} />)}</section> : <><EmptyState className="mt-8" icon={FolderKanban} title={dictionary.dashboard.noActiveProject} description={dictionary.dashboard.noActiveProjectDescription} /><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/services">{dictionary.dashboard.exploreServices}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/start-project">{dictionary.dashboard.startProject}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button></div></>}
  </>;
}

function ActionCard({ icon: Icon, title, description, href, label, tone, index }: { icon: LucideIcon; title: string; description: string; href: string; label: string; tone?: "warning"; index: number }) {
  return <article className={`flex min-h-64 flex-col justify-between border p-6 ${tone === "warning" ? "border-warning/30 bg-warning-soft" : "border-border bg-surface"}`}><div><div className="flex items-start justify-between gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-full ${tone === "warning" ? "bg-warning/15 text-warning" : "bg-accent-soft text-primary"}`}><Icon className="size-5" aria-hidden="true" /></span><span className="font-mono text-[9px] text-muted">0{index + 1}</span></div><h2 className="mt-8 font-display text-2xl font-bold tracking-[-.035em]">{title}</h2><p className="mt-3 text-sm leading-7 text-secondary">{description}</p></div><Button asChild size="sm" variant="outline" className="mt-6 w-fit"><Link href={href}>{label}<ArrowRight className="size-4" aria-hidden="true" /></Link></Button></article>;
}
