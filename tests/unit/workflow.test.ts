import { describe, expect, it } from "vitest";
import {
  getAllowedProjectTransitions,
  inquiryWorkflow,
  invoiceWorkflow,
  projectWorkflow,
  quotationWorkflow,
} from "@/features/workflow/transitions";

describe("inquiry workflow", () => {
  it("allows administrative progression", () => {
    expect(inquiryWorkflow.canTransition("SUBMITTED", "REVIEWING")).toBe(true);
    expect(inquiryWorkflow.canTransition("READY_FOR_QUOTATION", "QUOTATION_SENT")).toBe(true);
  });

  it("does not skip business discussion states", () => {
    expect(inquiryWorkflow.canTransition("SUBMITTED", "ACCEPTED")).toBe(false);
  });
});

describe("quotation workflow", () => {
  it("allows a sent quotation to be viewed or actioned", () => {
    expect(quotationWorkflow.canTransition("SENT", "VIEWED")).toBe(true);
    expect(quotationWorkflow.canTransition("SENT", "REVISION_REQUESTED")).toBe(true);
  });

  it("keeps accepted quotations terminal", () => {
    expect(quotationWorkflow.canTransition("ACCEPTED", "CANCELLED")).toBe(false);
  });
});

describe("invoice workflow", () => {
  it("supports issue, partial payment, payment, and refund progression", () => {
    expect(invoiceWorkflow.canTransition("DRAFT", "ISSUED")).toBe(true);
    expect(invoiceWorkflow.canTransition("ISSUED", "PARTIALLY_PAID")).toBe(true);
    expect(invoiceWorkflow.canTransition("PARTIALLY_PAID", "PAID")).toBe(true);
    expect(invoiceWorkflow.canTransition("PAID", "REFUNDED")).toBe(true);
  });

  it("keeps void invoices terminal", () => {
    expect(invoiceWorkflow.canTransition("VOID", "ISSUED")).toBe(false);
  });
});

describe("project workflow", () => {
  it("follows agreement, payment, planning, and delivery order", () => {
    expect(projectWorkflow.canTransition("AWAITING_AGREEMENT", "AWAITING_DOWN_PAYMENT")).toBe(true);
    expect(projectWorkflow.canTransition("AWAITING_DOWN_PAYMENT", "PLANNING")).toBe(true);
    expect(projectWorkflow.canTransition("CLIENT_REVIEW", "COMPLETED")).toBe(true);
  });

  it("does not complete a project directly from planning", () => {
    expect(projectWorkflow.canTransition("PLANNING", "COMPLETED")).toBe(false);
  });

  it("exposes only valid next states for Owner status controls", () => {
    expect(getAllowedProjectTransitions("PLANNING")).toEqual(["IN_PROGRESS", "ON_HOLD", "CANCELLED"]);
    expect(getAllowedProjectTransitions("IN_PROGRESS")).toContain("CLIENT_REVIEW");
    expect(getAllowedProjectTransitions("PLANNING")).not.toContain("CLIENT_REVIEW");
  });
});
