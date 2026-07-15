# Threat Model

## Assets

- Client identity and contact details
- Project briefs, private attachments, messages, deliverables, and payment proofs
- Quotation, agreement, invoice, and payment integrity
- Owner credentials and administrative actions
- Midtrans credentials and webhook trust
- Public capability tokens for quotations and reviews

## Trust boundaries

1. Public visitor → Next.js public forms
2. Authenticated browser → server actions and protected data
3. Next.js → PostgreSQL
4. Next.js → local/private object storage provider
5. Next.js → Midtrans Sandbox
6. Midtrans → webhook route
7. Notification outbox → email provider

## Primary threats and controls

| Threat | Controls |
|---|---|
| Credential brute force | Generic login failure, bcrypt cost, per-IP/identity rate limit, secure session cookies |
| Horizontal data access | Server-side role and ownership checks on projects, quotations, invoices, payments, and files |
| Document number collision | Atomic PostgreSQL `INSERT ... ON CONFLICT ... RETURNING` sequence allocation |
| Financial tampering | Backend decimal calculations, invoice-derived payment amounts, webhook amount comparison |
| Forged/replayed webhook | SHA-512 verification, unique event key, idempotent processing, provider order ID lookup |
| Capability-token guessing | 256-bit random tokens, SHA-256 hashes at rest, expiry/revocation/current-version checks |
| Malicious upload | Size/MIME allowlist, magic-byte validation, random storage key, path traversal guard, private download authorization |
| Cross-site mutation | Next.js Server Action origin checks, same-site cookies, webhook isolated from browser auth |
| XSS/clickjacking | React escaping, CSP, frame ancestors, `X-Frame-Options`, MIME sniff prevention |
| Notification duplication | Delivery records unique by notification/channel and explicit status/attempt tracking |
| Owner impersonating review | Review requires a secure invitation linked to one completed project |

## Residual risks before Phase 16

- In-memory rate limits are appropriate for the initial single EC2 process, but require Redis/shared storage if horizontally scaled.
- Local storage is development-only; production requires private S3 objects and signed access.
- Email uses a console adapter until SES activation.
- Midtrans GET Status API reconciliation should be added during production activation as an additional authenticity check.
- No MFA is implemented for the owner account yet.
