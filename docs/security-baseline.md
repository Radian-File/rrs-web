# Security Baseline

## Authentication and sessions

- Use one Auth.js configuration.
- Store password hashes only; use a modern cost factor and generic login errors.
- Secure, HTTP-only, same-site cookies in production.
- Owner accounts are created through controlled bootstrap, never public registration.

## Authorization

- Enforce role and resource ownership on the server for every query and mutation.
- Treat JWT role/ID claims as session transport only: validate the authenticated identity against the current `User` record before protected workspace access or mutations, and clear stale sessions after database reset/reseed or role changes.
- Protect file access independently of page access.
- Treat public quotation/review tokens as scoped capabilities, not full sessions.
- Agreements are never public capabilities: Client agreement pages require an authenticated CLIENT session and a server-side `project.clientId` ownership match; Owner agreement pages require OWNER role.

## Input and financial safety

- Validate environment, forms, actions, routes, webhooks, and uploads with Zod.
- Recalculate all totals on the server.
- Reject invalid state transitions.
- Verify Midtrans signature, reference, amount, environment, and replay status.

## Files

- Validate filename, extension, MIME type, signature where practical, and size.
- Store private objects outside public paths.
- Generate authorized or signed downloads on demand.
- Payment proof and deliverables are private by default.

## Web controls

- Same-origin checks for sensitive mutations.
- Rate limits for auth, public forms, token actions, payment creation, and uploads.
- CSP and security headers.
- Error responses must not expose stack traces, secrets, database details, or provider payloads.
- Logs and audit metadata must be redacted.
- Agreement acceptance stores the accepting client identity, timestamp, and limited request metadata for audit purposes. This evidence is visible only to Owner and must follow the production privacy policy/retention rules.

## Secret handling

Real credentials stay in ignored environment files. `.env.example` contains placeholders only. AWS and production payment credentials are out of scope before Phase 16.
