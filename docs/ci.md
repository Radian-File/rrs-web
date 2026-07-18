# Continuous Integration

GitHub Actions validates the application through [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Triggers

CI runs when:

- Code is pushed to `main`.
- A pull request targets `main`.
- A maintainer starts the workflow manually with `workflow_dispatch`.

## Validation sequence

CI runs on Ubuntu with Node.js 22 and the npm dependency cache:

```text
checkout
→ npm ci
→ prisma generate
→ lint
→ typecheck
→ Next.js production build
```

The workflow uses only schema-valid placeholder environment values. It does not contain production credentials and does not connect to a production database.

## What CI does not do

This phase is validation-only. It does **not**:

- deploy to Tencent Cloud or any VPS;
- run database migrations, seed, reset, or `db push`;
- use SSH keys, server credentials, or production secrets;
- run an automatic release.

Deployment remains a separate, manually approved phase after staging and host hardening are verified.
