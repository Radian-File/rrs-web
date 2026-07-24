# Known Limitations

Updated for Redesign III on 24 July 2026.

## Production operations

- Production targets a Tencent Cloud CVM with Docker Compose, Nginx, Let’s Encrypt, a persistent PostgreSQL volume, and a persistent private-upload volume.
- Local-volume storage requires coordinated PostgreSQL and upload backups. A restore rehearsal remains mandatory; Tencent COS or another private S3-compatible store is a future scale option.
- Email delivery remains on the console adapter until an approved transactional provider and worker are configured.
- Midtrans remains Sandbox-only until production account approval, credentials, webhook registration, and GET Status reconciliation are complete.
- Rate limiting is process-local and assumes the current single-instance/single-process topology.
- Owner MFA and email-based password reset are not implemented.
- Automatic WhatsApp messaging is intentionally excluded; the application produces user-initiated deep links.
- Document PDF output relies on browser print/save-as-PDF rather than server-side PDF generation.

## Content and policy

- Only published database records may appear as services, portfolio projects, or reviews.
- Verified portfolio screenshots and final Owner photography are not yet approved in the repository. Public proof surfaces therefore use honest data-backed fallbacks rather than fabricated media.
- Privacy, Terms, and Cancellation/Refund pages remain unpublished until official business identity, contact, provider, retention, cancellation, refund, and legal-review details are confirmed.
- Public reviews remain empty until real completed projects produce moderated feedback.

## Domain follow-up

The following pre-existing findings require separate security, lifecycle, finance, or product decisions and must not be changed as visual work:

- Public review queries do not yet use one consistent completed-project predicate.
- Client visibility of `DRAFT` quotations requires a product decision.
- Invoice/payment eligibility, allocation, and ordering require a dedicated finance review.
- Client active-project selection can choose `CANCELLED`, excludes `ON_HOLD`, and can duplicate an awaiting-agreement project.
- Payment received before agreement acceptance can require reconciliation after the project enters the down-payment state.
- Cash-received attribution, funnel percentages, goal, forecast, and pipeline-value definitions require authoritative formulas before further visualization.
- Session-expired continuation, callback handling, raw error/rate-limit behavior, and Contact `?sent=` trust semantics require a separate security review.

## Current validation environment

- Redesign III C0–C9 is complete through local checkpoint validation.
- ESLint, strict TypeScript, the production build, and `git diff --check` pass.
- Vitest passes **20 files / 64 tests**.
- Playwright passes **51 tests with 1 intentional skip** across desktop and mobile projects.
- A Linux production image builds successfully and passes a database-backed runtime smoke for public routes, protected redirects, health, security headers, runtime robots, and runtime sitemap URLs.
- The committed Nginx HTTP bootstrap configuration passes `nginx -t`. The certificate-mounted HTTPS configuration still requires validation on the target host before deployment.
- Lighthouse 13.4.1 reports 100 Accessibility, Best Practices, and SEO for the audited homepage, Services, and Contact routes. Performance is 83 for the cinematic mobile homepage, 100 for Services desktop, and 91 for Contact mobile in the local simulated environment.
- The production dependency audit reports **0 critical, 0 high, and 3 moderate** advisories. All three trace to the Prisma CLI development chain through `@hono/node-server`’s Windows `serve-static` advisory; it is not used by the application request path or the Linux runtime server. Upgrade Prisma separately after compatibility review.
