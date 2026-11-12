# syntax=docker/dockerfile:1

# Built for the shared Coolify server, which is aarch64 (Ampere ARM). CI builds
# this on `ubuntu-24.04-arm` with `platforms: linux/arm64`; an amd64 image fails
# at pull time with "no matching manifest for linux/arm64/v8".

FROM infisical/cli:0.43.69 AS infisical

# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Public build-time values only. Next inlines NEXT_PUBLIC_* into the client
# bundle, so they are never secrets: the defaults below and the literal project
# id in the workflows are the same values the live site already ships. The
# Sanity dataset is publicly readable, so the build needs no token.
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET=production
ARG NEXT_PUBLIC_SANITY_API_VERSION=2023-07-03
ARG NEXT_PUBLIC_SANITY_PROJECT_TITLE=Parkbad-GT
ARG NEXT_PUBLIC_BASE_URL=https://www.parkbad-gt.de
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION \
    NEXT_PUBLIC_SANITY_PROJECT_TITLE=$NEXT_PUBLIC_SANITY_PROJECT_TITLE \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# DOCKER_BUILD switches next.config.js to `output: "standalone"`.
ENV DOCKER_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

COPY --from=infisical /bin/infisical /usr/local/bin/infisical

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# The commit this image was built from, surfaced by /api/health. Runner stage
# only, so it does not invalidate the dependency layers on every commit.
ARG GIT_COMMIT=unknown
ENV GIT_COMMIT=$GIT_COMMIT

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Image optimiser and ISR cache. Mount a NAMED volume here in Coolify: it
# inherits this directory's owner (uid 1001); a host bind mount would be
# root-owned and unwritable for the runner user.
RUN mkdir -p .next/cache && chown nextjs:nodejs .next/cache

COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh

USER nextjs
EXPOSE 3000

# 127.0.0.1, never "localhost" (resolves to ::1 first inside the container);
# a short start period, because a long one outlasts Coolify's rolling-update
# wait (opuntia-website, 2026-09-11).
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=6 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/api/health', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["./entrypoint.sh"]
