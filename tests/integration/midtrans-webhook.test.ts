import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST } from "@/app/api/webhooks/midtrans/route";
import { midtransSignature } from "@/lib/payments/midtrans";
import { prisma } from "@/lib/db/prisma";

const suffix = randomUUID();
const email = `midtrans-${suffix}@example.com`;
const serverKey = "SB-Mid-server-integration-test";
let userId = "";
let quotationId = "";
let projectId = "";
let invoiceId = "";
let paymentId = "";

describe("Midtrans webhook route", () => {
  beforeAll(async () => {
    process.env.MIDTRANS_SERVER_KEY = serverKey;
    process.env.MIDTRANS_IS_PRODUCTION = "false";

    const user = await prisma.user.create({
      data: { name: "Webhook Client", email, role: "CLIENT" },
    });
    userId = user.id;

    const quotation = await prisma.quotation.create({
      data: {
        groupId: suffix,
        quotationNumber: `QT-TEST-${suffix}`,
        version: 1,
        isCurrent: true,
        status: "ACCEPTED",
        sourceType: "MANUAL",
        clientId: user.id,
        clientName: user.name,
        clientEmail: user.email,
        projectTitle: "Webhook project",
        projectSummary: "Integration fixture",
        currency: "IDR",
        subtotal: "3000000",
        discount: "0",
        tax: "0",
        total: "3000000",
        paymentPlanType: "FULL_PAYMENT",
        validUntil: new Date(Date.now() + 86_400_000),
      },
    });
    quotationId = quotation.id;

    const project = await prisma.project.create({
      data: {
        projectNumber: `PRJ-TEST-${suffix}`,
        quotationId: quotation.id,
        clientId: user.id,
        title: "Webhook project",
        status: "AWAITING_DOWN_PAYMENT",
        currency: "IDR",
        total: "3000000",
      },
    });
    projectId = project.id;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-TEST-${suffix}`,
        projectId: project.id,
        clientId: user.id,
        currency: "IDR",
        subtotal: "3000000",
        total: "3000000",
        status: "ISSUED",
        issuedAt: new Date(),
      },
    });
    invoiceId = invoice.id;

    const payment = await prisma.paymentAttempt.create({
      data: {
        invoiceId: invoice.id,
        projectId: project.id,
        clientId: user.id,
        provider: "MIDTRANS",
        status: "PROCESSING",
        amount: "3000000",
        providerOrderId: `PAY-TEST-${suffix}`,
      },
    });
    paymentId = payment.id;
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.webhookEvent.deleteMany({
      where: { referenceId: `PAY-TEST-${suffix}` },
    });
    await prisma.paymentAttempt.deleteMany({ where: { id: paymentId } });
    await prisma.invoice.deleteMany({ where: { id: invoiceId } });
    await prisma.project.deleteMany({ where: { id: projectId } });
    await prisma.quotation.deleteMany({ where: { id: quotationId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  });

  it("rejects invalid signatures", async () => {
    const response = await POST(
      new Request("http://localhost/api/webhooks/midtrans", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          transaction_status: "settlement",
          status_code: "200",
          signature_key: "0".repeat(128),
          order_id: `PAY-TEST-${suffix}`,
          gross_amount: "3000000.00",
        }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("idempotently settles payment, invoice, and project", async () => {
    const payload = {
      transaction_status: "settlement",
      transaction_id: `TX-${suffix}`,
      status_code: "200",
      order_id: `PAY-TEST-${suffix}`,
      gross_amount: "3000000.00",
      payment_type: "qris",
      fraud_status: "accept",
    };
    const signatureKey = midtransSignature(
      payload.order_id,
      payload.status_code,
      payload.gross_amount,
      serverKey,
    );
    const request = () =>
      new Request("http://localhost/api/webhooks/midtrans", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, signature_key: signatureKey }),
      });

    const first = await POST(request());
    const second = await POST(request());

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    const [payment, invoice, project] = await Promise.all([
      prisma.paymentAttempt.findUniqueOrThrow({ where: { id: paymentId } }),
      prisma.invoice.findUniqueOrThrow({ where: { id: invoiceId } }),
      prisma.project.findUniqueOrThrow({ where: { id: projectId } }),
    ]);

    expect(payment.status).toBe("PAID");
    expect(invoice.status).toBe("PAID");
    expect(invoice.paidAmount.toString()).toBe("3000000");
    expect(project.status).toBe("PLANNING");
  });
});
