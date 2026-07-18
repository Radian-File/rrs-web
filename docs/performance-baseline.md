# P2 Performance Baseline

Recorded: 2026-07-18 (local PostgreSQL, seeded development dataset)

## Dataset snapshot

The local seed produced small development-scale analytics data: 54 invoices, 76 quotations, 54 projects, and 48 payment attempts. This is suitable for correctness and query-shape checks, but not a production-scale load benchmark.

## Owner Analytics query plans

| Query path | Plan | Actual execution | Decision |
|---|---|---:|---|
| Paid invoices in 30-day period | Sequential scan, 47 rows returned, 7 filtered | 0.135 ms | No index justified at this dataset size. |
| Accepted current quotations in 30-day period | Sequential scan, 54 rows returned, 22 filtered | 0.529 ms | No index justified at this dataset size. |
| Manual payments awaiting verification | Sequential scan plus in-memory sort, 1 result | 0.151 ms | No index justified at this dataset size. |
| Stale active projects | Sequential project scan plus `ProjectActivity_projectId_createdAt_idx` anti join | 0.128 ms | Existing activity index supports the correlated lookup. |

## Conclusions

- The current local dataset is too small to justify speculative indexes.
- Existing `ProjectActivity(projectId, createdAt)` index supports stale-project detection.
- P2 must repeat the same `EXPLAIN ANALYZE` measurements on staging/production-like data before adding indexes for Invoice, Quotation, or PaymentAttempt.
- No analytics aggregate/index code change is made from this local baseline alone.

## Rendering and maintainability decisions

- Root locale resolution reads the `rrs-locale` cookie. This intentionally makes the current application render dynamically; no route-level cache change is made because public and portal routes share this layout and a cache split was not justified by this local baseline.
- `requireUser()` now uses React request-scoped `cache()` while retaining the database lookup and stale-session role check. This removes duplicate current-user lookups within a single render without trusting JWT claims as authorization.
- The unused `statusLabel()` helper was removed rather than introducing a one-caller formatting abstraction.
- Inquiry and quotation archive actions remain separate because their activity tables and revalidation paths are entity-specific; no generic abstraction was introduced.
- Formatter rollout is deferred: the repository has no existing formatter configuration, and a mass formatting change would be mechanical scope unrelated to measured runtime performance.

## Follow-up measurement triggers

Re-profile before adding indexes when any condition is true:

- Analytics queries return thousands of rows before aggregation.
- Query plans show sustained sequential scans/sorts with material execution time.
- Owner Analytics TTFB exceeds the agreed product budget under production-like load.
- Invoice/quotation/payment tables grow enough that current bounded attention queries regress.

## Commands

Use PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` against the local/staging database. Do not paste connection strings, secret values, payment payloads, or client-sensitive data into this document.
