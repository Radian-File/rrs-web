# Continuous Deployment

[`deploy-production.yml`](../.github/workflows/deploy-production.yml) deploys RRS Studio only after the **CI** workflow succeeds for a **push to `main`**. Pull-request CI never triggers deployment. Manual deployment is available only when run from `main`.

## Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `VPS_HOST` | Tencent Cloud VPS hostname or IP. |
| `VPS_USER` | Non-root deployment user. |
| `VPS_PORT` | SSH port, usually `22`. |
| `VPS_SSH_KEY` | Private key for that deployment user. |

Configure these as production environment secrets. They are never committed to the repository or printed intentionally by the workflow.

## Safe host deployment behavior

`/opt/rrs-studio/deploy-production.sh`:

1. requires `.env.production`, tracked HTTPS Nginx config, and mounted certificate files;
2. refuses to run if the Git working tree is dirty;
3. fetches and uses `git pull --ff-only origin main`;
4. validates Compose, builds only `app`, and runs `prisma migrate deploy` through the `migrate` service;
5. runs `docker compose up -d --remove-orphans` without `down`, volume deletion, reset, `db push`, or forced database recreation;
6. waits for the app health check, verifies Nginx ports 80/443, then verifies the public HTTPS health endpoint.

`git pull --ff-only` is safer than `git reset --hard origin/main` because it refuses divergent history and never discards server-only files such as `.env.production` or untracked TLS configuration. The script additionally rejects a dirty tracked working tree before updating.

## Install/update the deployment script on the VPS

After the repository version containing this script is already present:

```bash
cd /opt/rrs-studio
chmod 750 deploy-production.sh
bash -n deploy-production.sh
./deploy-production.sh
```

The first manual run should be performed only after backups and restore verification. It does not replace certificate files or database/upload volumes.

## Safe manual checks

```bash
cd /opt/rrs-studio
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker compose --env-file .env.production -f docker-compose.production.yml ps
curl -fSs https://rrs-studio.store/api/health
```

## Repository validation and release

```bash
npm ci
npx prisma generate
npm run lint
npm run typecheck
npm run build
git diff --check

git add docker-compose.production.yml deploy/nginx/rrs.https.conf deploy-production.sh .github/workflows/deploy-production.yml docs/cd.md
git commit -m "ci: add safe production deployment workflow"
git push origin main
```

Do not push until GitHub production environment secrets and the VPS prerequisites are configured.
