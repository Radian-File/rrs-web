import { Bell, FileText, FolderKanban, ReceiptText, Star } from "lucide-react";
import { WorkspacePageHeader } from "@/components/workspace/workspace-page-header";
import {
  ClientDecisionModule,
  ClientEmptyWorkspace,
  type ClientDashboardAction,
} from "@/features/client-dashboard/client-decision-module";
import { getClientDashboard } from "@/features/client-dashboard/query";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";
import { requireClient } from "@/lib/authz";

export default async function ClientDashboard() {
  const [client, locale] = await Promise.all([requireClient(), getLocale()]);
  const [dictionary, dashboard] = await Promise.all([
    Promise.resolve(getDictionary(locale)),
    getClientDashboard(client.id),
  ]);
  const isId = locale === "id";
  const firstName = client.name.split(" ")[0] || "Client";
  const now = new Date();

  const ui = isId
    ? {
        attentionDescription: "Berikut pekerjaan dan keputusan yang memerlukan perhatian Anda.",
        primaryEyebrow: "Langkah berikutnya",
        primaryContext: "Konteks keputusan",
        queueEyebrow: "Masih menunggu",
        queueTitle: "Keputusan lainnya",
        contextEyebrow: "Konteks aktif",
        contextTitle: "Project dan pembaruan",
        agreementCategory: "Agreement",
        invoiceCategory: "Invoice",
        projectCategory: "Project",
        reviewCategory: "Review terverifikasi",
        notificationCategory: "Pembaruan",
        projectLabel: "Project",
        statusLabel: "Status",
        invoiceLabel: "Nomor invoice",
        dueDateLabel: "Jatuh tempo",
        updateLabel: "Belum dibaca",
        invitationLabel: "Undangan review",
        invitationReady: "Tersedia",
        invitationNeeded: "Perlu dikirim ulang",
        workspaceReady: "Workspace siap",
        workspacePath: "Alur workspace",
        workspaceSteps: [
          dictionary.dashboard.startProject,
          "Diskusi dan persetujuan quotation",
          "Workspace project dibuat",
        ],
      }
    : {
        attentionDescription: "Here are the work items and decisions that need your attention.",
        primaryEyebrow: "Your next step",
        primaryContext: "Decision context",
        queueEyebrow: "Still waiting",
        queueTitle: "Other decisions",
        contextEyebrow: "Active context",
        contextTitle: "Project and updates",
        agreementCategory: "Agreement",
        invoiceCategory: "Invoice",
        projectCategory: "Project",
        reviewCategory: "Verified review",
        notificationCategory: "Updates",
        projectLabel: "Project",
        statusLabel: "Status",
        invoiceLabel: "Invoice number",
        dueDateLabel: "Due date",
        updateLabel: "Unread",
        invitationLabel: "Review invitation",
        invitationReady: "Available",
        invitationNeeded: "Needs to be resent",
        workspaceReady: "Workspace ready",
        workspacePath: "Workspace path",
        workspaceSteps: [
          dictionary.dashboard.startProject,
          "Discussion and quotation approval",
          "Project workspace is created",
        ],
      };

  const actions: ClientDashboardAction[] = [];

  const agreementAction: ClientDashboardAction | null = dashboard.pendingAgreement
    ? {
        kind: "agreement",
        icon: FileText,
        category: ui.agreementCategory,
        title: isId ? "Agreement siap ditinjau" : "Agreement ready to review",
        description: isId
          ? `${dashboard.pendingAgreement.title} menunggu persetujuan agreement Anda.`
          : `${dashboard.pendingAgreement.title} is waiting for your agreement approval.`,
        href: `/client/projects/${dashboard.pendingAgreement.id}/agreement`,
        label: isId ? "Tinjau agreement" : "Review agreement",
        details: [
          { label: ui.projectLabel, value: dashboard.pendingAgreement.title },
          { label: ui.statusLabel, value: isId ? "Menunggu persetujuan" : "Awaiting approval" },
        ],
      }
    : null;

  const invoiceAction: ClientDashboardAction | null = dashboard.payableInvoice
    ? {
        kind: "invoice",
        icon: ReceiptText,
        category: ui.invoiceCategory,
        title:
          dashboard.payableInvoice.status === "OVERDUE"
            ? isId
              ? "Invoice melewati jatuh tempo"
              : "Invoice overdue"
            : isId
              ? "Pembayaran perlu ditinjau"
              : "Payment needs attention",
        description: `${dashboard.payableInvoice.invoiceNumber} · ${dashboard.payableInvoice.project.title}`,
        href: `/client/invoices/${dashboard.payableInvoice.id}`,
        label: isId ? "Lihat invoice" : "View invoice",
        details: [
          { label: ui.invoiceLabel, value: dashboard.payableInvoice.invoiceNumber },
          { label: ui.projectLabel, value: dashboard.payableInvoice.project.title },
          ...(dashboard.payableInvoice.dueDate
            ? [{ label: ui.dueDateLabel, value: formatDate(dashboard.payableInvoice.dueDate, locale) }]
            : []),
        ],
        tone: "warning",
      }
    : null;

  if (invoiceAction && dashboard.payableInvoice?.status === "OVERDUE") actions.push(invoiceAction);
  if (agreementAction) actions.push(agreementAction);
  if (invoiceAction && dashboard.payableInvoice?.status !== "OVERDUE") actions.push(invoiceAction);

  if (dashboard.activeProject) {
    const status = dashboard.activeProject.status.replaceAll("_", " ");
    actions.push({
      kind: "project",
      icon: FolderKanban,
      category: ui.projectCategory,
      title: isId ? "Project aktif" : "Current project",
      description: `${dashboard.activeProject.title} · ${status}`,
      href: `/client/projects/${dashboard.activeProject.id}`,
      label: isId ? "Buka project" : "Open project",
      details: [
        { label: ui.projectLabel, value: dashboard.activeProject.title },
        { label: ui.statusLabel, value: status },
      ],
      supporting: true,
    });
  }

  if (dashboard.completedProject) {
    const hasActiveReviewInvite = Boolean(
      dashboard.completedProject.reviewInvite &&
        !dashboard.completedProject.reviewInvite.revokedAt &&
        !dashboard.completedProject.reviewInvite.usedAt &&
        dashboard.completedProject.reviewInvite.expiresAt > now,
    );
    actions.push({
      kind: "review",
      icon: Star,
      category: ui.reviewCategory,
      title: isId ? "Bagikan review terverifikasi" : "Share a verified review",
      description: hasActiveReviewInvite
        ? isId
          ? `${dashboard.completedProject.title} siap untuk diulas.`
          : `${dashboard.completedProject.title} is ready for your review.`
        : isId
          ? "Hubungi RRS jika Anda memerlukan undangan review baru."
          : "Ask RRS to resend the review invitation if you need a new link.",
      href: `/client/projects/${dashboard.completedProject.id}`,
      label: isId ? "Buka project" : "Open project",
      details: [
        { label: ui.projectLabel, value: dashboard.completedProject.title },
        {
          label: ui.invitationLabel,
          value: hasActiveReviewInvite ? ui.invitationReady : ui.invitationNeeded,
        },
      ],
    });
  }

  if (dashboard.unreadNotifications > 0) {
    actions.push({
      kind: "notifications",
      icon: Bell,
      category: ui.notificationCategory,
      title: isId ? "Pembaruan belum dibaca" : "Unread updates",
      description: isId
        ? `${dashboard.unreadNotifications} notifikasi memerlukan perhatian Anda.`
        : `${dashboard.unreadNotifications} notification${dashboard.unreadNotifications === 1 ? "" : "s"} need your attention.`,
      href: "/client/notifications",
      label: isId ? "Lihat notifikasi" : "View notifications",
      details: [{ label: ui.updateLabel, value: String(dashboard.unreadNotifications) }],
      supporting: true,
    });
  }

  const hasWork = actions.length > 0;

  return (
    <>
      <WorkspacePageHeader
        eyebrow={dictionary.dashboard.clientEyebrow}
        title={<>{dictionary.dashboard.clientWelcome}, {firstName}.</>}
        description={hasWork ? ui.attentionDescription : dictionary.dashboard.clientDescription}
        className="pb-8"
        eyebrowClassName="text-[10px]"
        titleClassName="mt-4 max-w-4xl text-4xl font-bold tracking-[-.05em] md:text-5xl"
        descriptionClassName="mt-4 leading-7"
      />

      {hasWork ? (
        <ClientDecisionModule
          actions={actions}
          copy={{
            primaryEyebrow: ui.primaryEyebrow,
            primaryContext: ui.primaryContext,
            queueEyebrow: ui.queueEyebrow,
            queueTitle: ui.queueTitle,
            contextEyebrow: ui.contextEyebrow,
            contextTitle: ui.contextTitle,
          }}
        />
      ) : (
        <ClientEmptyWorkspace
          copy={{
            eyebrow: ui.workspaceReady,
            title: dictionary.dashboard.noActiveProject,
            description: dictionary.dashboard.noActiveProjectDescription,
            primaryLabel: dictionary.dashboard.startProject,
            secondaryLabel: dictionary.dashboard.exploreServices,
            pathEyebrow: ui.workspacePath,
            pathTitle: dictionary.dashboard.clientDescription,
            pathSteps: ui.workspaceSteps,
          }}
        />
      )}
    </>
  );
}

function formatDate(value: Date, locale: "id" | "en") {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}
