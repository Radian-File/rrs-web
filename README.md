# RRS Studio

RRS Studio is a quotation-first web and product studio platform. It combines a public studio website with private Client and Owner workspaces for technical briefs, quotations, agreements, projects, invoices, payments, delivery approval, and verified reviews.

The application is designed for an independent studio rather than a marketplace or instant-checkout business.

```text
Initial discussion
→ Client account
→ Technical brief
→ Inquiry
→ Versioned quotation
→ Protected agreement
→ Project workspace
→ Invoice and payment verification
→ Delivery approval
→ Verified review
```

Public service prices are starting estimates. Final scope, commercial terms, and pricing are documented in an Owner-issued quotation.

## Product areas

### Public website

- Dark editorial studio experience with Indonesian and English localization.
- Published services with Service Type filters and alias-aware search.
- Published portfolio projects and moderated, verified reviews only.
- Guest contact form and WhatsApp handoff.
- Session-aware navigation and quotation-request actions.
- Public token-based quotation view with Client-only formal decisions.

### Client Portal

- Client-owned quotations and formal quotation decisions.
- Protected agreements and acceptance records.
- Projects, milestones, messages, and private files.
- Invoices and manual payment-proof submission.
- Delivery approval and verified review handoff.

### Owner Workspace

- Inquiry pipeline and reversible archives.
- Service and Service Type management.
- Versioned quotation builder and discussion workflow.
- Project, agreement, milestone, file, invoice, and payment operations.
- Review moderation.
- Operational analytics and attention items.

## Core engineering rules

- Server Components are the default; Client Components are limited to interactive boundaries.
- Authorization and ownership checks stay close to data access.
- Zod validates action, route, environment, and webhook boundaries.
- Financial values are calculated server-side with Decimal-compatible operations.
- Sent quotations are immutable; changes create a new version.
- Agreements and private files are never exposed through public capability links.
- Public quotation and review tokens are stored as hashes.
- Reviews originate from completed projects.

## Technology

| Area | Technology |
|---|---|
| Application | Next.js 16 App Router, React 19, TypeScript |
| Interface | Tailwind CSS 4, Radix UI, Lucide, GSAP/ScrollTrigger |
| Database | PostgreSQL 17, Prisma 7 |
| Authentication | Auth.js credentials sessions |
| Validation | Zod, React Hook Form |
| Payments | Midtrans adapter and manual payment verification |
| Testing | Vitest, Playwright, ESLint, TypeScript |
| Production | Tencent Cloud CVM, Docker Compose, Nginx, Let's Encrypt |

## Local development

### Requirements

- Node.js 22
- npm
- Docker Desktop or another Docker Engine with Compose

### Setup

```bash
npm install

# Windows PowerShell
Copy-Item .env.example .env

# macOS or Linux
cp .env.example .env

npm run db:generate
docker compose up -d db
npm run db:migrate
npm run db:seed
npm run dev
```

The development database is exposed locally at `127.0.0.1:5434`. The application runs at [http://localhost:3000](http://localhost:3000).

Never commit environment files, credentials, private uploads, database exports, generated Prisma clients, or Playwright artifacts.

### Commands

```bash
npm run dev             # Start the Next.js development server
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript without emitting files
npm run test            # Run Vitest unit and integration tests
npm run test:e2e        # Run Playwright journeys
npm run build           # Create a production build
npm run check           # Lint, typecheck, test, and build
npm run db:generate     # Generate Prisma Client
npm run db:migrate      # Apply development migrations
npm run db:migrate:deploy # Apply committed migrations
npm run db:seed         # Seed controlled development data
npm run db:studio       # Open Prisma Studio
```

Database-backed integration and Playwright tests require the local PostgreSQL container and an appropriate seeded state.

## Quality gate

Before a release checkpoint:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
git diff --check
```

When schema or critical domain behavior changes, also validate migrations from a clean database and rehearse the relevant data or payment journey.

## Tencent Cloud production deployment

Production runs on a Tencent Cloud CVM instance from `/opt/rrs-studio` using [docker-compose.production.yml](docker-compose.production.yml).

### Runtime topology

```text
Internet
→ Tencent Cloud CVM security group
→ Nginx :80/:443
→ Next.js app :3000 on private Docker networks
→ PostgreSQL :5432 on an internal-only Docker network

Persistent volumes:
- rrs_postgres_data
- rrs_uploads
```

Only Nginx publishes host ports. PostgreSQL and the Next.js container are not bound directly to the public host interface.

### Production prerequisites

- Tencent Cloud CVM with Docker Engine and Docker Compose.
- DNS for `rrs-studio.store` pointing to the CVM public address.
- TCP 80 and 443 allowed by the CVM security group; SSH restricted to trusted administration sources.
- Repository checked out at `/opt/rrs-studio`.
- Production environment file at `/opt/rrs-studio/.env.production` with mode `600`.
- Let's Encrypt certificate files available under `/etc/letsencrypt/live/rrs-studio.store/`.
- A backup process for both PostgreSQL and the uploads volume.

Create the environment file from [.env.production.example](.env.production.example) and replace every placeholder with a secret generated for production.

```bash
cd /opt/rrs-studio
cp .env.production.example .env.production
chmod 600 .env.production
```

Important production settings:

- `DATABASE_URL` must use the internal Docker hostname `db:5432`.
- `NEXT_PUBLIC_APP_URL` and `AUTH_URL` must use the production HTTPS origin.
- `AUTH_SECRET` must be a strong random value and remain stable between deployments.
- `OWNER_PASSWORD`, database credentials, Midtrans keys, and provider credentials must not be stored in Git.
- Keep `MIDTRANS_IS_PRODUCTION=false` until production credentials and webhook verification are formally approved.
- Keep `EMAIL_DRIVER=console` until an approved transactional provider is configured.

### First deployment

```bash
cd /opt/rrs-studio
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker compose --env-file .env.production -f docker-compose.production.yml build app migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d db uploads-init
docker compose --env-file .env.production -f docker-compose.production.yml run --rm migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d --remove-orphans
docker compose --env-file .env.production -f docker-compose.production.yml exec -T nginx nginx -t
curl --fail https://rrs-studio.store/api/health
```

The migration target is built from the same source revision as the application. Production deployment must never run `prisma migrate dev`, reset the database, remove volumes, or recreate the database as a routine step.

### Routine deployment

[deploy-production.sh](deploy-production.sh) performs a guarded deployment:

1. Refuses to proceed from a dirty server working tree.
2. Fast-forwards from `origin/main`.
3. Validates the Compose configuration.
4. Builds both `app` and `migrate` images.
5. Starts database and upload prerequisites without running `compose down`.
6. Applies committed migrations.
7. Starts the production stack.
8. Validates Nginx TLS configuration inside the container.
9. Waits for the application health check.
10. Verifies the public HTTPS health endpoint.

```bash
ssh <production-user>@<cvm-host>
bash /opt/rrs-studio/deploy-production.sh
```

### GitHub Actions deployment

[Deploy Production](.github/workflows/deploy-production.yml) connects to the Tencent Cloud CVM over SSH and invokes the server deployment script.

A successful CI run triggered by a push to `main` can start the production workflow. A manual `workflow_dispatch` on `main` is also available. Pull requests do not receive production secrets.

**A local commit does not deploy anything. Do not push to `main` until the release has been reviewed and production deployment is explicitly intended.**

Required GitHub environment secrets:

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`

The production environment should retain required reviewers and deployment protection rules.

### TLS and proxy identity

Nginx terminates TLS and forwards requests directly to the private application container. Because the current CVM topology has no trusted load balancer in front of Nginx, `X-Forwarded-For` is overwritten with the direct remote address instead of appending a client-supplied value.

If a Tencent Cloud Load Balancer or CDN is added later, define its trusted proxy addresses before changing this policy.

### Backup requirements

Back up both data stores together:

- PostgreSQL logical or physical backup from `rrs_postgres_data`.
- Private upload backup from `rrs_uploads`.

Backups are not complete until restore has been tested in an isolated environment. Keep database and upload retention aligned so file records do not point to missing objects.

### Rollback

Prefer a reviewed Git revert on `main`, followed by the normal deployment workflow. Before reverting a release that applied a migration:

1. Review migration backward compatibility.
2. Confirm the previous application revision can read the current schema.
3. Preserve a database and upload backup.
4. Rebuild both application and migration targets from the selected revision.
5. Validate Nginx and `/api/health` after restart.

Do not use `docker compose down -v`, delete production volumes, or run database reset commands as rollback procedures.

## Security and privacy

- `OWNER` and `CLIENT` are the only application roles.
- Protected sessions are checked against the current database role.
- Client ownership is enforced for projects, agreements, invoices, payment attempts, messages, and private file downloads.
- Technical brief confirmation is Client-owned and excluded from search indexing.
- Direct-CVM forwarding headers cannot override the trusted remote address.
- Security headers include CSP, frame denial, content-type protection, and controlled browser permissions.
- Sensitive responses and file downloads use private/no-store cache policy.

See [docs/security-baseline.md](docs/security-baseline.md) and [docs/threat-model.md](docs/threat-model.md).

## Motion and accessibility

The public website uses GSAP and ScrollTrigger for coordinated, section-scoped motion. Native browser scrolling remains authoritative.

- No scroll hijacking.
- Cinematic motion is limited to public storytelling surfaces.
- Forms, financial tables, agreements, invoices, and workspaces use restrained state transitions only.
- `prefers-reduced-motion` disables scrub, floating loops, pointer depth, and marquee movement while keeping all content visible.
- Keyboard navigation, focus visibility, semantic landmarks, and mobile alternatives are required for every primary action.

## Documentation

- [docs/product-scope.md](docs/product-scope.md) — product and actor boundaries
- [docs/architecture.md](docs/architecture.md) — application architecture and invariants
- [docs/database.md](docs/database.md) — data model guidance
- [docs/security-baseline.md](docs/security-baseline.md) — security controls
- [docs/threat-model.md](docs/threat-model.md) — threats and mitigations
- [docs/payment-testing.md](docs/payment-testing.md) — payment validation
- [docs/production-readiness.md](docs/production-readiness.md) — release requirements
- [docs/development.md](docs/development.md) — engineering workflow
- [docs/known-limitations.md](docs/known-limitations.md) — known constraints and follow-up work

## Legal status

Privacy, Terms, and Cancellation/Refund pages are not published as final policy until official business identity, contact, provider, retention, cancellation, refund, and legal-review details are confirmed. The application must not present placeholder legal language as an approved policy.

## License

Private project. All rights reserved.
