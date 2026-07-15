# RRS Freelancer — Agent Guide

## Mandatory Next.js rule

This project uses Next.js 16. APIs and conventions may differ from older versions. Read the relevant local guide in `node_modules/next/dist/docs/` before implementing a Next.js feature, and follow current deprecation notices.

## Product source of truth

- Business context: Obsidian `RRS - Web Freelance/RRS - Overview.md`
- Visual direction: Obsidian `RRS - Web Freelance/RRS - Design.md`
- Legacy reference: `https://github.com/Radian-File/my-porto`

The legacy repository is a functional reference only. Do not copy its order/package checkout architecture.

## Core business flow

`Project brief → Inquiry → WhatsApp discussion → Quotation → Agreement → Project → Invoice/Payment → Delivery → Verified review`

- Service prices are starting estimates, never final checkout prices.
- Final price comes from an owner-created quotation.
- Midtrans transactions come from invoices only.
- Reviews must originate from completed projects.
- The product is single-owner: `OWNER` and `CLIENT`; no public seller registration.

## Engineering conventions

- Server Components by default; add `use client` only at the smallest interactive boundary.
- Validate all boundaries with Zod.
- Keep authorization and ownership checks close to data access.
- Put status transitions, money calculations, document sequences, and transaction orchestration in domain services.
- Never trust financial totals from the browser.
- Never edit a sent quotation in place; create a new version.
- Store public tokens as hashes and protect private files with authorization.
- Never commit secrets, local uploads, generated Prisma client, or test artifacts.

## Required checks

Before a checkpoint commit run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

When database or critical journeys change, also run clean migrations, seed, and Playwright tests.
