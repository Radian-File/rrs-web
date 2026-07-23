# Production Readiness — Redesign II

Updated on 24 July 2026.

## Validated in the current release cycle

- Dark editorial public design and dark operational Client/Owner workspaces.
- Session-aware Guest, Client, and Owner navigation and actions.
- GSAP/ScrollTrigger motion with native scrolling and reduced-motion fallback.
- Next.js production build.
- Strict TypeScript and ESLint.
- Database-independent Vitest suite.
- Published-only service, portfolio, and review queries.
- Client-owned technical-brief confirmation with search indexing disabled.
- Database-backed role freshness for private file downloads.
- Client-scoped technical-brief drafts.
- Next.js, Auth.js, Sharp, and `fast-uri` security patch updates.
- Direct-CVM Nginx forwarding-header hardening.
- Professional Tencent Cloud deployment documentation.

## Required before the next production deployment

- Review the complete visual result against real seeded content on desktop and mobile.
- Start PostgreSQL and run the complete integration and Playwright suites.
- Validate committed migrations from a clean database and run the idempotent seed.
- Run a production-like Docker Compose smoke test.
- Validate `nginx -t` inside the production Nginx container.
- Verify the public HTTPS health endpoint.
- Back up PostgreSQL and the uploads volume, then confirm restore instructions.
- Confirm Tencent Cloud Security Group, host firewall, SSH, log retention, monitoring, and incident-contact settings.
- Replace or rotate production credentials when required.
- Keep Midtrans in Sandbox until production approval and reconciliation requirements are complete.
- Keep the console email adapter until an approved provider is configured.
- Complete Privacy, Terms, cancellation, ownership, refund, retention, and agreement-clause review before publishing policy or registration consent.

## Release gate

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
git diff --check
npm audit --omit=dev
```

## Deployment policy

A local commit does not authorize a deployment. Pushing to `main` can trigger the protected production workflow after CI; therefore, push only after release review and explicit deployment intent.

Do not deploy with a dirty server working tree. Do not run database reset commands, `prisma migrate dev`, `docker compose down -v`, or volume deletion in production.

## Deferred legal gate

Legal pages are intentionally absent rather than populated with placeholder policy language. Publishing those pages requires confirmed business/legal inputs and appropriate review.
