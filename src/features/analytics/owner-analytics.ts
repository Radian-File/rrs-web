import Decimal from "decimal.js";
import { prisma } from "@/lib/db/prisma";
import {
  getAnalyticsDateRange,
  parseAnalyticsPeriod,
  percentageOf,
  remainingInvoiceAmount,
  sumMoney,
} from "@/features/analytics/owner-analytics-utils";

const activeProjectStatuses = ["AWAITING_AGREEMENT", "AWAITING_DOWN_PAYMENT", "PLANNING", "IN_PROGRESS", "CLIENT_REVIEW", "REVISION", "ON_HOLD"] as const;
const openInvoiceStatuses = ["ISSUED", "PENDING", "PARTIALLY_PAID", "OVERDUE"] as const;
const attentionInquiryStatuses = ["SUBMITTED", "REVIEWING"] as const;
const expiringQuotationStatuses = ["SENT", "VIEWED", "REVISION_REQUESTED"] as const;

export type OwnerAnalytics = Awaited<ReturnType<typeof getOwnerAnalytics>>;

function toMoney(value: Decimal.Value | null | undefined) {
  return new Decimal(value ?? 0).toString();
}

async function getPeriodMetrics(start: Date, end: Date) {
  const [inquiries, sentQuotations, acceptedQuotations, projects, paidInvoices] = await Promise.all([
    prisma.inquiry.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.quotation.count({ where: { isCurrent: true, sentAt: { gte: start, lt: end } } }),
    prisma.quotation.findMany({
      where: { isCurrent: true, status: "ACCEPTED", acceptedAt: { gte: start, lt: end } },
      select: { total: true },
    }),
    prisma.project.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.invoice.findMany({
      where: { status: "PAID", paidAt: { gte: start, lt: end } },
      select: { paidAmount: true },
    }),
  ]);

  return {
    inquiries,
    sentQuotations,
    acceptedQuotationValue: toMoney(sumMoney(acceptedQuotations.map(({ total }) => total))),
    acceptedQuotations: acceptedQuotations.length,
    projects,
    cashReceived: toMoney(sumMoney(paidInvoices.map(({ paidAmount }) => paidAmount))),
  };
}

export async function getOwnerAnalytics(rawPeriod?: string, now = new Date()) {
  const period = parseAnalyticsPeriod(rawPeriod);
  const range = getAnalyticsDateRange(period, now);
  const comparisonAvailable = range.comparisonStart !== null && range.comparisonEnd !== null;
  const attentionCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const staleProjectCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dueSoon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiringSoon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const [current, previous, openInvoices, overdueInvoices, dueSoonInvoices, activeClients, workload, delayedInquiries, expiringQuotations, pendingProofs, clientReviewProjects, staleProjects] = await Promise.all([
    getPeriodMetrics(range.start, range.end),
    comparisonAvailable ? getPeriodMetrics(range.comparisonStart!, range.comparisonEnd!) : null,
    prisma.invoice.findMany({
      where: { status: { in: [...openInvoiceStatuses] } },
      select: { total: true, paidAmount: true },
    }),
    prisma.invoice.findMany({
      where: {
        OR: [
          { status: "OVERDUE" },
          { dueDate: { lt: now }, status: { in: ["ISSUED", "PENDING", "PARTIALLY_PAID"] } },
        ],
      },
      select: { total: true, paidAmount: true, invoiceNumber: true, dueDate: true, id: true },
      orderBy: { dueDate: "asc" },
      take: 8,
    }),
    prisma.invoice.findMany({
      where: { dueDate: { gte: now, lte: dueSoon }, status: { in: ["ISSUED", "PENDING", "PARTIALLY_PAID", "OVERDUE"] } },
      select: { total: true, paidAmount: true },
    }),
    prisma.project.findMany({
      where: { status: { in: [...activeProjectStatuses] } },
      distinct: ["clientId"],
      select: { clientId: true },
    }),
    prisma.project.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.inquiry.findMany({
      where: { status: { in: [...attentionInquiryStatuses] }, createdAt: { lt: attentionCutoff } },
      select: { id: true, inquiryNumber: true, projectTitle: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 8,
    }),
    prisma.quotation.findMany({
      where: { isCurrent: true, status: { in: [...expiringQuotationStatuses] }, validUntil: { gte: now, lte: expiringSoon } },
      select: { id: true, quotationNumber: true, projectTitle: true, validUntil: true },
      orderBy: { validUntil: "asc" },
      take: 8,
    }),
    prisma.paymentAttempt.findMany({
      where: { provider: "MANUAL", manualStatus: "UNDER_VERIFICATION" },
      select: { id: true, invoice: { select: { invoiceNumber: true } }, project: { select: { title: true } }, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 8,
    }),
    prisma.project.findMany({
      where: { status: "CLIENT_REVIEW" },
      select: { id: true, projectNumber: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "asc" },
      take: 8,
    }),
    prisma.project.findMany({
      where: {
        status: { in: [...activeProjectStatuses] },
        createdAt: { lt: staleProjectCutoff },
        activities: { none: { createdAt: { gte: staleProjectCutoff } } },
      },
      select: { id: true, projectNumber: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "asc" },
      take: 8,
    }),
  ]);

  const workloadCount = (statuses: string[]) => workload.filter((item) => statuses.includes(item.status)).reduce((sum, item) => sum + item._count._all, 0);
  const overdueAmount = sumMoney(overdueInvoices.map((invoice) => remainingInvoiceAmount(invoice.total, invoice.paidAmount)));
  const outstandingAmount = sumMoney(openInvoices.map((invoice) => remainingInvoiceAmount(invoice.total, invoice.paidAmount)));
  const dueSoonAmount = sumMoney(dueSoonInvoices.map((invoice) => remainingInvoiceAmount(invoice.total, invoice.paidAmount)));

  return {
    period,
    range,
    current,
    previous,
    metrics: {
      activeClients: activeClients.length,
      outstanding: toMoney(outstandingAmount),
      overdue: { count: overdueInvoices.length, amount: toMoney(overdueAmount) },
      dueSoon: { count: dueSoonInvoices.length, amount: toMoney(dueSoonAmount) },
    },
    funnel: {
      inquiries: current.inquiries,
      quotations: current.sentQuotations,
      accepted: current.acceptedQuotations,
      projects: current.projects,
      quotationRate: percentageOf(current.sentQuotations, current.inquiries),
      acceptanceRate: percentageOf(current.acceptedQuotations, current.sentQuotations),
      projectRate: percentageOf(current.projects, current.acceptedQuotations),
    },
    workload: {
      awaiting: workloadCount(["AWAITING_AGREEMENT", "AWAITING_DOWN_PAYMENT"]),
      delivery: workloadCount(["PLANNING", "IN_PROGRESS"]),
      review: workloadCount(["CLIENT_REVIEW", "REVISION"]),
      onHold: workloadCount(["ON_HOLD"]),
      completed: workloadCount(["COMPLETED"]),
    },
    attention: {
      delayedInquiries,
      expiringQuotations,
      overdueInvoices: overdueInvoices.map((invoice) => ({ ...invoice, total: toMoney(invoice.total), paidAmount: toMoney(invoice.paidAmount) })),
      pendingProofs,
      clientReviewProjects,
      staleProjects,
    },
  };
}
