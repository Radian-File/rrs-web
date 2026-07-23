# Known Limitations

Updated for Redesign II on 24 July 2026.

## Production operations

- Production uses a Tencent Cloud CVM with Docker Compose, Nginx, Let's Encrypt, a persistent PostgreSQL volume, and a persistent private-upload volume.
- Local-volume storage requires coordinated PostgreSQL and upload backups. A restore rehearsal remains mandatory; Tencent COS or another private S3-compatible store is a future scale option.
- Email delivery remains on the console adapter until an approved transactional provider and worker are configured.
- Midtrans remains Sandbox-only until production account approval, credentials, webhook registration, and GET Status reconciliation are complete.
- Rate limiting is process-local and assumes the current single-instance/single-process topology.
- Owner MFA and email-based password reset are not implemented.
- Automatic WhatsApp messaging is intentionally excluded; the application produces user-initiated deep links.
- Document PDF output relies on browser print/save-as-PDF rather than server-side PDF generation.

## Content and policy

- Only published database records may appear as services, portfolio projects, or reviews.
- Verified portfolio screenshots and final owner photography are not yet available in the repository. Public demonstration UI is explicitly labelled.
- Privacy, Terms, and Cancellation/Refund pages remain unpublished until official business identity, contact, provider, retention, cancellation, refund, and legal-review details are confirmed.
- Public reviews remain empty until real completed projects produce moderated feedback.

## Domain follow-up

The following pre-existing findings require separate domain decisions and must not be changed as visual work:

- Payment received before agreement acceptance can require reconciliation after the project enters the down-payment state.
- Multiple concurrent payment attempts require stronger allocation controls.
- Cash-received period attribution and funnel percentages require clarified analytics definitions.
- Operational active counts must consistently respect archive semantics.

## Current validation environment

- The Redesign II production build, ESLint, TypeScript, and database-independent unit tests pass locally.
- Database integration and Playwright suites could not be rerun in the current validation session because Docker Desktop's Linux engine was unavailable. They remain required before deployment.
- The production dependency audit has no remaining critical advisory after Next.js, Auth.js, Sharp, and `fast-uri` patches. A moderate advisory remains in the Prisma CLI development chain through the pinned Hono adapter; it is not part of the application request path and should be removed when Prisma confirms compatibility with Hono 2.
