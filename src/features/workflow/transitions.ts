import {
  InquiryStatus,
  InvoiceStatus,
  ProjectStatus,
  QuotationStatus,
} from "@/generated/prisma/enums";

const inquiryTransitions: Record<InquiryStatus, readonly InquiryStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["REVIEWING", "CANCELLED"],
  REVIEWING: ["DISCUSSING", "WAITING_FOR_CLIENT", "CANCELLED"],
  DISCUSSING: ["WAITING_FOR_CLIENT", "READY_FOR_QUOTATION", "CANCELLED"],
  WAITING_FOR_CLIENT: ["DISCUSSING", "READY_FOR_QUOTATION", "CANCELLED"],
  READY_FOR_QUOTATION: ["QUOTATION_SENT", "DISCUSSING", "CANCELLED"],
  QUOTATION_SENT: ["ACCEPTED", "DISCUSSING", "REJECTED", "CANCELLED"],
  ACCEPTED: ["ARCHIVED"],
  REJECTED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

const quotationTransitions: Record<QuotationStatus, readonly QuotationStatus[]> = {
  DRAFT: ["SENT", "CANCELLED"],
  SENT: ["VIEWED", "REVISION_REQUESTED", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"],
  VIEWED: ["REVISION_REQUESTED", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"],
  REVISION_REQUESTED: ["CANCELLED"],
  ACCEPTED: [],
  REJECTED: [],
  EXPIRED: [],
  CANCELLED: [],
};

const invoiceTransitions: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
  DRAFT: ["ISSUED", "VOID"],
  ISSUED: ["PENDING", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"],
  PENDING: ["PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"],
  PARTIALLY_PAID: ["PAID", "OVERDUE", "REFUNDED"],
  PAID: ["REFUNDED"],
  OVERDUE: ["PARTIALLY_PAID", "PAID", "VOID"],
  VOID: [],
  REFUNDED: [],
};

const projectTransitions: Record<ProjectStatus, readonly ProjectStatus[]> = {
  AWAITING_AGREEMENT: ["AWAITING_DOWN_PAYMENT", "CANCELLED"],
  AWAITING_DOWN_PAYMENT: ["PLANNING", "ON_HOLD", "CANCELLED"],
  PLANNING: ["IN_PROGRESS", "ON_HOLD", "CANCELLED"],
  IN_PROGRESS: ["CLIENT_REVIEW", "ON_HOLD", "CANCELLED"],
  CLIENT_REVIEW: ["REVISION", "COMPLETED", "ON_HOLD"],
  REVISION: ["IN_PROGRESS", "CLIENT_REVIEW", "ON_HOLD"],
  ON_HOLD: ["AWAITING_DOWN_PAYMENT", "PLANNING", "IN_PROGRESS", "CLIENT_REVIEW", "REVISION", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransition<T extends string>(
  map: Record<T, readonly T[]>,
  from: T,
  to: T,
) {
  return map[from].includes(to);
}

export const inquiryWorkflow = {
  canTransition: (from: InquiryStatus, to: InquiryStatus) =>
    canTransition(inquiryTransitions, from, to),
};

export const quotationWorkflow = {
  canTransition: (from: QuotationStatus, to: QuotationStatus) =>
    canTransition(quotationTransitions, from, to),
};

export const invoiceWorkflow = {
  canTransition: (from: InvoiceStatus, to: InvoiceStatus) =>
    canTransition(invoiceTransitions, from, to),
};

export function getAllowedProjectTransitions(from: ProjectStatus): readonly ProjectStatus[] {
  return projectTransitions[from];
}

export const projectWorkflow = {
  canTransition: (from: ProjectStatus, to: ProjectStatus) =>
    canTransition(projectTransitions, from, to),
  allowedTransitions: getAllowedProjectTransitions,
};
