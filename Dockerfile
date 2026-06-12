FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl su-exec

# ── Stage 1: install dependencies ──────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: build ──────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client + build Next.js (no DB connection needed here)
RUN npx prisma generate && npx next build

# ── Stage 3: production runner ──────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what standalone output needs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Migration SQL + the bootstrap script that applies it at startup (uses pg,
# which the standalone bundle already includes — no fragile Prisma CLI needed)
COPY --from=builder /app/prisma/migrations ./prisma/migrations
COPY --from=builder /app/scripts ./scripts
# sharp uses @img/* vendored binaries — nft tracer misses them, copy explicitly
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /app/node_modules/@img ./node_modules/@img

RUN mkdir -p public/uploads && chown -R nextjs:nodejs /app

# Ensure CMD always runs as root so chown on the volume mount works
USER root

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Fix volume permissions (runs as root), drop to nextjs, sync the DB schema
# (idempotent — safe on every boot), then start the server. The bootstrap never
# exits non-zero, so the site stays up even if the DB is briefly unreachable.
CMD ["sh", "-c", "chown -R nextjs:nodejs /app/public/uploads; exec su-exec nextjs sh -c 'node scripts/db-bootstrap.mjs; node server.js'"]
