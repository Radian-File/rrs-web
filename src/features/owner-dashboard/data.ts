import Decimal from "decimal.js";
import type { InvoiceStatus, QuotationStatus } from "@/generated/prisma/enums";
import { remainingInvoiceAmount } from "@/features/analytics/owner-analytics-utils";
import { requireOwner } from "@/lib/authz";
import { prisma } from "@/lib/db/prisma";
import {
  activeProjectStatuses,
  type OwnerDashboardData,
  type RecordedActivity,
  type RecordedActivityEvent,
  type RecordedActivitySource,
} from "@/features/owner-dashboard/types";

const currentQuotationStatuses = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "REVISION_REQUESTED",
] as const satisfies readonly QuotationStatus[];

const openInvoiceStatuses = [
  "ISSUED",
  "PENDING",
  "PARTIALLY_PAID",
  "OVERDUE",
] as const satisfies readonly InvoiceStatus[];

const activitySourceLimit = 6;
const activityDisplayLimit = 6;

const activityEventAllowlist: Readonly<Record<string, RecordedActivityEvent>> = {
  "inquiry:SUBMITTED": "inquiry-submitted",
  "inquiry:STATUS_UPDATED": "inquiry-status-updated",
  "inquiry:QUOTATION_SENT": "inquiry-quotation-sent",
  "inquiry:ARCHIVED": "record-archived",
  "inquiry:RESTORED": "record-restored",
  "quotation:CREATED": "quotation-created",
  "quotation:DRAFT_UPDATED": "quotation-draft-updated",
  "quotation:SENT": "quotation-sent",
  "quotation:VIEWED": "quotation-viewed",
  "quotation:REVISION_REQUESTED": "quotation-revision-requested",
  "quotation:REJECTED": "quotation-rejected",
  "quotation:ACCEPTED": "quotation-accepted",
  "quotation:LINK_REGENERATED": "quotation-link-regenerated",
  "quotation:VERSION_CREATED": "quotation-version-created",
  "quotation:DISCUSSION_RECEIVED": "quotation-discussion-recorded",
  "quotation:ARCHIVED": "record-archived",
  "quotation:RESTORED": "record-restored",
  "project:AGREEMENT_ACCEPTED": "project-agreement-accepted",
  "project:STATUS_UPDATED": "project-status-updated",
  "project:DELIVERY_APPROVED": "project-delivery-approved",
  "project:REVIEW_SUBMITTED": "project-review-submitted",
  "project:REVIEW_INVITATION_REISSUED": "project-review-invitation-reissued",
};

function toRecordedActivity({
  id,
  source,
  type,
  identifier,
  href,
  recordedAt,
}: {
  id: string;
  source: RecordedActivitySource;
  type: string;
  identifier: string;
  href: string;
  recordedAt: Date;
}): RecordedActivity | null {
  const event = activityEventAllowlist[`${source}:${type}`];
  if (!event) return null;

  return {
    id: `${source}:${id}`,
    source,
    event,
    identifier,
    href,
    recordedAt,
  };
}

function isRecordedActivity(activity: RecordedActivity | null): activity is RecordedActivity {
  return activity !== null;
}

export async function getOwnerDashboardData(): Promise<OwnerDashboardData> {
  await requireOwner();

  const [
    activeInquiries,
    currentQuotations,
    publishedServices,
    paymentVerifications,
    openInvoices,
    groupedProjects,
    inquiryActivities,
    quotationActivities,
    projectActivities,
  ] = await Promise.all([
    prisma.inquiry.count({
      where: {
        archivedAt: null,
        status: { notIn: ["ARCHIVED", "CANCELLED"] },
      },
    }),
    prisma.quotation.count({
      where: {
        archivedAt: null,
        isCurrent: true,
        status: { in: [...currentQuotationStatuses] },
      },
    }),
    prisma.service.count({ where: { isPublished: true } }),
    prisma.paymentAttempt.count({
      where: {
        provider: "MANUAL",
        manualStatus: "UNDER_VERIFICATION",
      },
    }),
    prisma.invoice.findMany({
      where: { status: { in: [...openInvoiceStatuses] } },
      select: {
        currency: true,
        total: true,
        paidAmount: true,
      },
    }),
    prisma.project.groupBy({
      by: ["status"],
      where: { status: { in: [...activeProjectStatuses] } },
      _count: { _all: true },
    }),
    prisma.inquiryActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: activitySourceLimit,
      select: {
        id: true,
        type: true,
        createdAt: true,
        inquiry: {
          select: {
            id: true,
            inquiryNumber: true,
          },
        },
      },
    }),
    prisma.quotationActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: activitySourceLimit,
      select: {
        id: true,
        type: true,
        createdAt: true,
        quotation: {
          select: {
            id: true,
            quotationNumber: true,
            version: true,
          },
        },
      },
    }),
    prisma.projectActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: activitySourceLimit,
      select: {
        id: true,
        type: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            projectNumber: true,
          },
        },
      },
    }),
  ]);

  const projectCountByStatus = new Map(
    groupedProjects.map((item) => [item.status, item._count._all]),
  );
  const projectDistribution = activeProjectStatuses.map((status) => ({
    status,
    count: projectCountByStatus.get(status) ?? 0,
  }));
  const activeProjects = projectDistribution.reduce(
    (total, item) => total + item.count,
    0,
  );

  const receivableByCurrency = new Map<
    string,
    { amount: Decimal; invoiceCount: number }
  >();
  for (const invoice of openInvoices) {
    const current = receivableByCurrency.get(invoice.currency) ?? {
      amount: new Decimal(0),
      invoiceCount: 0,
    };
    receivableByCurrency.set(invoice.currency, {
      amount: current.amount.plus(
        remainingInvoiceAmount(
          invoice.total.toString(),
          invoice.paidAmount.toString(),
        ),
      ),
      invoiceCount: current.invoiceCount + 1,
    });
  }

  const currencies = [...receivableByCurrency.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([currency, value]) => ({
      currency,
      amount: value.amount.toFixed(2),
    }));

  const recentRecordedActivity = [
    ...inquiryActivities.map((activity) =>
      toRecordedActivity({
        id: activity.id,
        source: "inquiry",
        type: activity.type,
        identifier: activity.inquiry.inquiryNumber,
        href: `/owner/inquiries/${activity.inquiry.id}`,
        recordedAt: activity.createdAt,
      }),
    ),
    ...quotationActivities.map((activity) =>
      toRecordedActivity({
        id: activity.id,
        source: "quotation",
        type: activity.type,
        identifier: `${activity.quotation.quotationNumber} · v${activity.quotation.version}`,
        href: `/owner/quotations/${activity.quotation.id}`,
        recordedAt: activity.createdAt,
      }),
    ),
    ...projectActivities.map((activity) =>
      toRecordedActivity({
        id: activity.id,
        source: "project",
        type: activity.type,
        identifier: activity.project.projectNumber,
        href: `/owner/projects/${activity.project.id}`,
        recordedAt: activity.createdAt,
      }),
    ),
  ]
    .filter(isRecordedActivity)
    .sort(
      (left, right) =>
        right.recordedAt.getTime() - left.recordedAt.getTime(),
    )
    .slice(0, activityDisplayLimit);

  return {
    counts: {
      activeInquiries,
      currentQuotations,
      activeProjects,
      publishedServices,
      paymentVerifications,
    },
    outstandingReceivable: {
      openInvoiceCount: openInvoices.length,
      currencies,
    },
    projectDistribution,
    recentRecordedActivity,
  };
}
