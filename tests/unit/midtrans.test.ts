import { describe, expect, it } from "vitest";
import {
  midtransSignature,
  verifyMidtransSignature,
} from "@/lib/payments/midtrans";

describe("Midtrans webhook signature", () => {
  it("implements SHA512(order_id + status_code + gross_amount + ServerKey)", () => {
    const input = {
      orderId: "INV-2026-0001",
      statusCode: "200",
      grossAmount: "3000000.00",
      serverKey: "SB-Mid-server-test",
    };
    const signature = midtransSignature(
      input.orderId,
      input.statusCode,
      input.grossAmount,
      input.serverKey,
    );

    expect(signature).toHaveLength(128);
    expect(verifyMidtransSignature({ ...input, signatureKey: signature })).toBe(true);
    expect(
      verifyMidtransSignature({ ...input, signatureKey: "0".repeat(128) }),
    ).toBe(false);
  });
});
