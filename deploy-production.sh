#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/rrs-studio"
COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
DOMAIN="rrs-studio.store"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
HEALTH_URL="https://${DOMAIN}/api/health"

cd "$APP_DIR"
COMPOSE=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

on_error() {
  local code=$?
  echo "Deployment failed (exit ${code}). Recent app logs:" >&2
  "${COMPOSE[@]}" logs --tail=100 app >&2 || true
  exit "$code"
}
trap on_error ERR

require_file() {
  [[ -f "$1" ]] || { echo "Required file is missing: $1" >&2; exit 1; }
}

require_file "$ENV_FILE"
require_file "deploy/nginx/rrs.https.conf"
require_file "${CERT_DIR}/fullchain.pem"
require_file "${CERT_DIR}/privkey.pem"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing deployment: working tree is not clean." >&2
  exit 1
fi

git fetch origin main
git pull --ff-only origin main

"${COMPOSE[@]}" config --quiet
"${COMPOSE[@]}" build app

# Start only prerequisites; no compose down, volume removal, database reset, or db recreation.
"${COMPOSE[@]}" up -d db uploads-init
"${COMPOSE[@]}" run --rm migrate
"${COMPOSE[@]}" up -d --remove-orphans

for attempt in $(seq 1 60); do
  app_id=$("${COMPOSE[@]}" ps -q app)
  if [[ -n "$app_id" ]] && [[ "$(docker inspect --format '{{.State.Health.Status}}' "$app_id")" == "healthy" ]]; then
    break
  fi
  sleep 2
  if [[ "$attempt" == "60" ]]; then
    echo "App container did not become healthy." >&2
    exit 1
  fi
done

"${COMPOSE[@]}" ps
"${COMPOSE[@]}" port nginx 80 >/dev/null
"${COMPOSE[@]}" port nginx 443 >/dev/null
curl --fail --silent --show-error --retry 5 --retry-delay 2 "$HEALTH_URL" >/dev/null

echo "Deployment completed successfully: $HEALTH_URL"
