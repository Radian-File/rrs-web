# Database Design

## Primary aggregate flow

```text
Inquiry
→ Quotation group and immutable versions
→ Agreement
→ Project
→ Payment schedules
→ Invoices
→ Payment attempts
→ Review invitation and review
```

## Key modeling decisions

- PostgreSQL is the source of truth.
- Prisma uses the PostgreSQL driver adapter.
- Financial values use `Decimal(18,2)`; Midtrans IDR conversion requires an integer value.
- Quotation line quantity uses `Decimal(12,2)`.
- Snapshot fields preserve client, project, scope, and financial document history.
- `DocumentSequence(type, year)` has a composite unique constraint and must only be incremented in a transaction.
- Public tokens are stored as unique hashes with expiry/revocation metadata.
- Activity tables capture user-facing domain history; `AuditLog` captures security and sensitive mutation evidence.

## Local database

Docker Compose exposes PostgreSQL on `127.0.0.1:5434` to avoid common local port conflicts and IPv6 `localhost` resolution issues.

```bash
docker compose up -d db
npm run db:migrate
npm run db:seed
```

Migrations are append-only after a checkpoint commit. Destructive schema changes require explicit migration notes and backup planning.
