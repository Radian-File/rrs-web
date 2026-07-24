# Production Readiness — Redesign III

Updated on 24 July 2026.

## Validated in the current release cycle

- Dark editorial public journey with route-specific composition for Services, Portfolio, Reviews, About, Process, Contact, and conversion surfaces.
- Decision-first Client Portal and exact-state Owner command center with responsive desktop rail and mobile navigation.
- Session-aware Guest, Client, and Owner navigation and actions.
- Desktop-only GSAP/ScrollTrigger cinematic scenes, native scrolling, static mobile composition, and complete reduced-motion fallback.
- Published-only service, portfolio, and review data with honest empty states.
- Client-owned technical briefs, quotations, agreements, projects, invoices, files, approvals, and verified-review handoff.
- Owner inquiry, archive, quotation versioning, project, invoice, payment, service, review, notification, and analytics workflows.
- Database-backed role freshness for private file downloads.
- Strict TypeScript, ESLint, Vitest, full Playwright desktop/mobile regression, and whitespace validation.
- Route-wide structural accessibility audit covering 26 public, conversion, Client, and Owner routes.
- Lighthouse 13.4.1 accessibility, best-practice, SEO, and performance audits on the optimized production server.
- Linux multi-stage Docker image build and database-backed runtime smoke.
- Runtime-aware metadata base, robots host, and sitemap URLs; Docker build placeholders are not emitted by the runtime container.
- Next.js security headers, direct-CVM Nginx forwarding-header hardening, and Nginx HTTP configuration syntax.
- Professional Tencent Cloud deployment documentation.

## Local C9 evidence

- Vitest: **20 files / 64 tests passed**.
- Playwright: **51 passed / 1 intentional skip**.
- Lighthouse:
  - homepage mobile — Performance 83, Accessibility 100, Best Practices 100, SEO 100;
  - Services desktop — 100 across all four categories;
  - Contact mobile — Performance 91, Accessibility 100, Best Practices 100, SEO 100.
- Production dependency audit: **0 critical / 0 high / 3 moderate**; the moderate chain is documented in [known-limitations.md](known-limitations.md).
- Docker runtime image: approximately 109 MB, non-root `nextjs` user, public route 200 responses, protected route 307 responses, and health/robots/sitemap 200 responses.

## Required before the next production deployment

- Review the final release against approved real media and production content; do not add unverified proof assets.
- Validate committed migrations from a clean disposable database only within an explicitly approved database-validation window.
- Run the production Compose graph with the real `.env.production` on the target host.
- Validate `nginx -t` inside the certificate-mounted production Nginx container.
- Verify the public HTTPS health endpoint, canonical metadata, robots, and sitemap after startup.
- Back up PostgreSQL and the uploads volume, then complete a restore rehearsal.
- Confirm Tencent Cloud Security Group, host firewall, SSH, log retention, monitoring, and incident-contact settings.
- Replace or rotate production credentials when required.
- Keep Midtrans in Sandbox until production approval and reconciliation requirements are complete.
- Keep the console email adapter until an approved provider is configured.
- Complete Privacy, Terms, cancellation, ownership, refund, retention, and agreement-clause review before publishing policy or registration consent.
- Resolve or formally accept the deferred security, lifecycle, finance, and analytics findings in [known-limitations.md](known-limitations.md).

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

The Linux Docker builder intentionally invokes `next build --webpack`. This is Next.js’s supported fallback when the image has SWC WASM but no platform-native Turbopack binding; the output remains the same standalone production runtime copied into the non-root runner image.

## Deployment policy

A local commit does not authorize a deployment. Pushing to `main` can trigger the protected production workflow after CI; therefore, push only after release review and explicit deployment intent.

Do not deploy with a dirty server working tree. Do not run database reset commands, `prisma migrate dev`, `docker compose down -v`, or volume deletion in production.

## Deferred legal gate

Legal pages are intentionally absent rather than populated with placeholder policy language. Publishing those pages requires confirmed business/legal inputs and appropriate review.
