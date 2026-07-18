# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
COPY . .
# Build-time placeholders only. Runtime secrets are never baked into the image.
RUN mkdir -p public uploads \
  && export DATABASE_URL="postgresql://build:build@db:5432/rrs?schema=public" \
  && export NEXT_PUBLIC_APP_URL="http://localhost" \
  && export AUTH_SECRET="build-only-secret-that-is-never-used-at-runtime" \
  && export OWNER_EMAIL="owner@example.com" \
  && export OWNER_PASSWORD="build-only-owner-password" \
  && export OWNER_WHATSAPP_NUMBER="6280000000000" \
  && export STORAGE_DRIVER="local" LOCAL_UPLOAD_DIR="/app/uploads" MAX_UPLOAD_SIZE_MB="10" \
  && export EMAIL_DRIVER="console" EMAIL_FROM="RRS Studio <noreply@example.com>" \
  && npx prisma generate \
  && npm run build

FROM deps AS migration
COPY prisma ./prisma
COPY prisma.config.ts ./
CMD ["npx", "prisma", "migrate", "deploy"]

FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
