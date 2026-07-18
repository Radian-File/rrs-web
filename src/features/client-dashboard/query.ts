import { prisma } from "@/lib/db/prisma";

export async function getClientDashboard(clientId: string) {
  const [activeProject, pendingAgreement, payableInvoice, completedProject, unreadNotifications] = await Promise.all([
    prisma.project.findFirst({ where: { clientId, status: { notIn: ["COMPLETED", "ON_HOLD"] } }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, status: true } }),
    prisma.project.findFirst({ where: { clientId, status: "AWAITING_AGREEMENT" }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, agreement: { select: { status: true } } } }),
    prisma.invoice.findFirst({ where: { clientId, status: { in: ["ISSUED", "PENDING", "PARTIALLY_PAID", "OVERDUE"] } }, orderBy: [{ status: "asc" }, { dueDate: "asc" }], select: { id: true, invoiceNumber: true, status: true, dueDate: true, project: { select: { title: true } } } }),
    prisma.project.findFirst({ where: { clientId, status: "COMPLETED", review: null }, orderBy: { completedAt: "desc" }, select: { id: true, title: true, reviewInvite: { select: { expiresAt: true, revokedAt: true, usedAt: true } } } }),
    prisma.notification.count({ where: { userId: clientId, isRead: false } }),
  ]);
  return { activeProject, pendingAgreement, payableInvoice, completedProject, unreadNotifications };
}
