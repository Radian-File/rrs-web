# Legacy Audit — `Radian-File/my-porto`

## Purpose

The legacy application is a functional reference, not a code foundation. Its useful security and operational patterns should be studied, while its order/package checkout model must not be preserved.

## Keep as concepts

- Next.js App Router and TypeScript
- PostgreSQL and Prisma
- `OWNER` / `CLIENT` authorization
- Public services and portfolio
- Private file metadata and authorized downloads
- Midtrans signature verification and webhook event persistence
- In-app notifications and audit logs
- Environment validation, security headers, rate limits, and production checks

## Redesign

| Legacy concept | New RRS concept |
|---|---|
| Service package selection | Service starting price + project brief |
| Order created from service | Inquiry created before commercial agreement |
| One order / one invoice | Project with multiple payment schedules and invoices |
| Direct payment path | Quotation → agreement → invoice → payment |
| Project update tied to order | Project lifecycle, milestones, files, delivery, approvals |
| Static testimonial CMS | Verified review from a completed project |
| Admin-oriented generic dashboard | Focused owner workflow and client collaboration portal |
| Supabase-specific file logic | Storage provider contract; AWS S3 activation in Phase 16 |
| Resend-specific email logic | Email provider contract; AWS SES activation in Phase 16 |

## Remove

- Final prices sourced from predefined packages
- Shopping-cart or instant-checkout behavior
- `PricingPlan` as a public sales module
- Admin-created reviews presented as verified
- Public seller/freelancer registration
- Marketplace language that implies independent third-party sellers

## Legacy route reference

Useful public areas: homepage, services, portfolio, about, contact. Useful protected patterns: auth, client dashboard, owner dashboard, private files, invoice/payment views, security audit log, Midtrans webhook.

All new routes should be implemented against the new domain model rather than ported line by line.
