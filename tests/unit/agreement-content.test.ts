import { describe, expect, it } from "vitest";
import { buildAgreementSnapshot, normalizeAgreementSnapshot, standardAgreementClauses } from "@/features/agreements/content";

const quotation = {
  quotationNumber: "QT-2026-0001", version: 2, clientName: "Client Test", clientEmail: "client@example.com", companyName: "Test Co",
  projectTitle: "Test project", projectType: "Website", projectSummary: "A documented test project.", estimatedStartDate: new Date("2026-07-20T00:00:00.000Z"), estimatedCompletionAt: new Date("2026-08-20T00:00:00.000Z"),
  currency: "IDR", subtotal: { toString: () => "1000000" }, discount: { toString: () => "50000" }, tax: { toString: () => "0" }, total: { toString: () => "950000" },
  scopeIncluded: "Design and implementation", scopeExcluded: "Copywriting", revisionLimit: 2, maintenanceDays: 14, terms: "Project-specific payment term.",
  items: [{ title: "Website", description: "Responsive site", quantity: { toString: () => "1" }, unitPrice: { toString: () => "1000000" }, total: { toString: () => "1000000" } }],
  paymentTerms: [{ title: "Down payment", description: "Before planning", percentage: { toString: () => "50" }, amount: { toString: () => "475000" }, dueTrigger: "Before planning", sequence: 1 }],
};

describe("agreement snapshots", () => {
  it("captures complete, immutable commercial and collaboration content for future agreements", () => {
    const snapshot = buildAgreementSnapshot({ quotation, client: { name: "Client Test", email: "client@example.com", companyName: "Test Co" } });

    expect(snapshot.schemaVersion).toBe(2);
    expect(snapshot.commercial.total).toBe("950000");
    expect(snapshot.paymentTerms[0]?.amount).toBe("475000");
    expect(snapshot.items[0]?.description).toBe("Responsive site");
    expect(snapshot.standardClauses).toHaveLength(standardAgreementClauses.length);
    expect(snapshot.ownerTerms).toBe("Project-specific payment term.");
  });

  it("renders legacy agreement snapshots safely with baseline collaboration clauses", () => {
    const snapshot = normalizeAgreementSnapshot({ quotationNumber: "QT-2026-0001", quotationVersion: 1, total: "1000000", terms: "Legacy term" });

    expect(snapshot.quotation.number).toBe("QT-2026-0001");
    expect(snapshot.commercial.total).toBe("1000000");
    expect(snapshot.ownerTerms).toBe("Legacy term");
    expect(snapshot.standardClauses).toHaveLength(standardAgreementClauses.length);
  });
});
