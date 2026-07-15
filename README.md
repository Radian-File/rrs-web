# RRS Freelancer

RRS Freelancer is a single-owner freelance project management and client collaboration platform. It combines a premium public service website with structured inquiry, quotation, agreement, project, invoice, payment, delivery, and verified-review workflows.

## Product model

This is **not** an e-commerce checkout or a public multi-seller marketplace.

```text
Project brief
→ WhatsApp consultation
→ Inquiry management
→ Quotation and revision
→ Agreement
→ Project execution
→ Invoice and payment
→ Delivery
→ Verified review
```

Service pages show starting prices only. The final scope and price come from a quotation created after discussion.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 and selected Radix/shadcn-style primitives
- PostgreSQL 17 and Prisma 7
- Auth.js, Zod, React Hook Form
- Vitest and Playwright
- Midtrans Sandbox (payment phase)
- Provider-based storage and email adapters; AWS activation is deferred to Phase 16

## Local setup

1. Copy `.env.example` to `.env` and replace local placeholders.
2. Start PostgreSQL:

   ```bash
   docker compose up -d db
   ```

3. Install, migrate, and seed:

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Documentation

- `docs/product-scope.md`
- `docs/legacy-audit.md`
- `docs/architecture.md`
- `docs/database.md`
- `docs/security-baseline.md`
- `docs/threat-model.md`
- `docs/payment-testing.md`
- `docs/production-readiness.md`
- `docs/known-limitations.md`
- `docs/phase-16-handoff.md`
- `docs/development.md`

## Deployment

Phase 1–15 is implemented locally with Sandbox/provider adapters and automated quality gates. AWS deployment is intentionally deferred to Phase 16. No AWS resource should be created during Phase 1–15.
