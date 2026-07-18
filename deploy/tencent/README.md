# Tencent Cloud Self-Hosted Deployment

This directory contains deployment configuration for a Tencent Cloud CVM running Ubuntu 24.04, Docker Engine, Docker Compose, Nginx, Next.js, Prisma, and PostgreSQL 17.

## Topology

```text
Internet
  → Nginx :80 / :443
  → Next.js app :3000 (Docker network only)
  → PostgreSQL 17 :5432 (internal Docker network only)
```

- PostgreSQL has no host port mapping.
- Next.js has no host port mapping.
- Nginx is the only public container.
- PostgreSQL and upload data use named Docker volumes.
- `migrate` runs `prisma migrate deploy` before app startup.
- `uploads-init` grants the non-root Next.js user write access to the persistent upload volume before app startup.

## Files

- `docker-compose.production.yml` — production topology.
- `.env.production.example` — required runtime values; copy to untracked `.env.production`.
- `deploy/nginx/rrs.http.conf` — IP-first HTTP reverse proxy.
- `deploy/nginx/rrs.https.conf.example` — domain/TLS template.
- `deploy/tencent/bootstrap-ubuntu-24.04.md` — server hardening and deployment procedure.

## Important limitations

This is self-hosted local-volume storage, not S3/COS. Back up **both** PostgreSQL and `rrs_uploads`. It is appropriate for staging and small single-server production only after restore rehearsal, domain/HTTPS, monitoring, legal review, and production payment/email activation.

No command in this repository deploys automatically.
