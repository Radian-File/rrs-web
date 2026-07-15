# Payment Testing Guide

## Midtrans Sandbox

Production mode is blocked before Phase 16. Configure only sandbox keys:

```env
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
MIDTRANS_IS_PRODUCTION="false"
```

The application creates Snap transactions from the current outstanding **invoice amount**, never from a service or quotation directly.

## Webhook contract

Endpoint:

```text
POST /api/webhooks/midtrans
Content-Type: application/json
```

Verification:

```text
SHA512(order_id + status_code + gross_amount + ServerKey)
```

The handler also verifies:

- provider order ID exists,
- webhook amount equals the payment attempt,
- successful card capture is not fraud-rejected,
- duplicate events do not allocate payment twice,
- invoice and project changes occur in one transaction.

## Automated coverage

```bash
npm run test -- tests/unit/midtrans.test.ts
npm run test -- tests/integration/midtrans-webhook.test.ts
```

The integration fixture verifies invalid-signature rejection, valid settlement, repeated notification idempotency, invoice `PAID`, and project unlock to `PLANNING`.

## Manual payment

1. Client opens an issued invoice.
2. Client uploads a valid private image/PDF proof.
3. Payment becomes `UNDER_VERIFICATION`.
4. Owner verifies or rejects it from `/owner/payments`.
5. Verification uses the same reconciliation service as Midtrans.
6. Rejection stores reason and notifies the client.

## Sandbox manual checklist

- pending Snap transaction does not mark invoice paid,
- settlement marks exactly one attempt paid,
- duplicate settlement remains idempotent,
- incorrect signature returns 401,
- incorrect amount returns non-2xx and records processing error,
- expire/cancel/failure map to non-paid states,
- refund recalculates paid amount,
- first paid invoice moves `AWAITING_DOWN_PAYMENT` project to `PLANNING`.
