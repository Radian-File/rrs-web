import { describe, expect, it } from "vitest";
import {
  inquiryWorkflow,
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

describe("project workflow", () => {
  it("follows agreement, payment, planning, and delivery order", () => {
    expect(projectWorkflow.canTransition("AWAITING_AGREEMENT", "AWAITING_DOWN_PAYMENT")).toBe(true);
    expect(projectWorkflow.canTransition("AWAITING_DOWN_PAYMENT", "PLANNING")).toBe(true);
    expect(projectWorkflow.canTransition("CLIENT_REVIEW", "COMPLETED")).toBe(true);
  });

  it("does not complete a project directly from planning", () => {
    expect(projectWorkflow.canTransition("PLANNING", "COMPLETED")).toBe(false);
  });
});
