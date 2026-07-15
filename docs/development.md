# Development Guide

## Prerequisites

- Node.js 24+
- npm 11+
- Docker and Docker Compose
- Git

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Coding rules

- Prefer Server Components and server-only feature queries.
- Keep interactive client components small.
- Use `@/` imports.
- Use shared design primitives rather than one-off styles.
- Use Manrope for display typography and Inter for body/UI.
- Do not use excessive gradients, glassmorphism, oversized pills, fake metrics, or e-commerce sales patterns.
- Add tests for every status transition, calculation, authorization policy, and reported regression.

## Checkpoint workflow

1. Apply migrations to a clean database.
2. Run the idempotent seed.
3. Run lint, typecheck, unit/integration tests, E2E where relevant, and production build.
4. Review `git diff` and `git diff --check`.
5. Confirm no secret or generated artifact is staged.
6. Create the approved phase-group commit.

Do not push or deploy unless explicitly requested.
