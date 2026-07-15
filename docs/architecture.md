# Architecture

## Application shape

RRS is a modular Next.js application with three presentation areas:

- Public marketing and project acquisition
- Client collaboration portal
- Owner operations dashboard

All areas call shared feature modules. Feature modules own validation, queries, policies, domain services, and transaction orchestration.

## Boundaries

```text
App Router page/layout
→ feature query or action
→ authorization + Zod boundary
→ domain service
→ Prisma transaction / provider contract
→ PostgreSQL or external provider
```

- Server Components read data directly through server-only feature queries.
- Client Components only manage local interaction state.
- Server Actions handle authenticated form mutations.
- Route Handlers are reserved for webhooks, downloads, and public integration endpoints.

## Domain invariants

- Document numbers are allocated inside database transactions.
- Financial totals are recalculated on the server with decimal arithmetic.
- Sent quotation versions are immutable.
- Only one current quotation version and one accepted version exist per group.
- Quotation acceptance provisions all dependent records atomically.
- Project transitions are explicit and guarded.
- Invoice and payment allocation cannot exceed project totals.
- Reviews require completed projects and are unique by project.

## Provider contracts

- Storage: local adapter in development/test, S3 adapter activated in Phase 16.
- Email: console/test adapter before SES activation.
- Payment: Midtrans Sandbox adapter; transactions originate from invoices.
- WhatsApp: deep-link generator, not a bot integration.

## Observability

Structured application logs must redact secrets, tokens, password data, raw payment credentials, and private file URLs. Important business and security mutations also write immutable audit records.
