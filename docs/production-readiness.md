# Production Readiness — Phase 15

## Completed locally

- Next.js production build
- Strict TypeScript and ESLint
- PostgreSQL migration and idempotent seed
- Unit, integration, and desktop/mobile E2E tests
- Auth.js credentials sessions with OWNER/CLIENT roles
- Inquiry → quotation → project → invoice workflow
- Atomic document numbering and quotation acceptance
- Project ownership, protected files, and verified reviews
- Midtrans Sandbox adapter and signed/idempotent webhook
- Manual payment verification with audit evidence
- In-app notification outbox and provider-based email boundary
- Rate limiting, CSP/security headers, upload signature checks, and dependency audit

## Required before production release

- Replace all local placeholder credentials
- Rotate owner password and `AUTH_SECRET`
- Activate AWS Budget before other AWS resources
- Provision production PostgreSQL strategy and backup/restore rehearsal
- Replace local storage with private S3 adapter
- Activate SES identity/domain and delivery worker
- Configure domain, HTTPS, Nginx, and trusted proxy headers
- Configure Midtrans production keys only after account approval
- Register HTTPS webhook and verify GET Status API reconciliation
- Configure shared rate limiting if more than one app process is used
- Add monitoring, alerting, log retention, and incident contacts
- Complete legal Privacy Policy, Terms, cancellation, ownership, and refund language
- Run accessibility and browser QA with final brand content

## Release gate commands

```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm audit --audit-level=moderate
```

No deployment is authorized by this document; deployment remains Phase 16.
