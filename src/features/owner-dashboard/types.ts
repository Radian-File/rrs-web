import type { ProjectStatus } from "@/generated/prisma/enums";

export const activeProjectStatuses = [
  "AWAITING_AGREEMENT",
  "AWAITING_DOWN_PAYMENT",
  "PLANNING",
  "IN_PROGRESS",
  "CLIENT_REVIEW",
  "REVISION",
  "ON_HOLD",
] as const satisfies readonly ProjectStatus[];

export type ActiveProjectStatus = (typeof activeProjectStatuses)[number];

export type RecordedActivitySource = "inquiry" | "quotation" | "project";

export type RecordedActivityEvent =
  | "inquiry-submitted"
  | "inquiry-status-updated"
  | "inquiry-quotation-sent"
  | "record-archived"
  | "record-restored"
  | "quotation-created"
  | "quotation-draft-updated"
  | "quotation-sent"
  | "quotation-viewed"
  | "quotation-revision-requested"
  | "quotation-rejected"
  | "quotation-accepted"
  | "quotation-link-regenerated"
  | "quotation-version-created"
  | "quotation-discussion-recorded"
  | "project-agreement-accepted"
  | "project-status-updated"
  | "project-delivery-approved"
  | "project-review-submitted"
  | "project-review-invitation-reissued";

export type RecordedActivity = {
  id: string;
  source: RecordedActivitySource;
  event: RecordedActivityEvent;
  identifier: string;
  href: string;
  recordedAt: Date;
};

export type OwnerDashboardData = {
  counts: {
    activeInquiries: number;
    currentQuotations: number;
    activeProjects: number;
    publishedServices: number;
    paymentVerifications: number;
  };
  outstandingReceivable: {
    openInvoiceCount: number;
    currencies: Array<{
      currency: string;
      amount: string;
    }>;
  };
  projectDistribution: Array<{
    status: ActiveProjectStatus;
    count: number;
  }>;
  recentRecordedActivity: RecordedActivity[];
};
