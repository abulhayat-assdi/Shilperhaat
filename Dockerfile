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

# Stage the Prisma CLI with its full runtime dependency closure so the runner
# can execute `prisma migrate deploy` / `prisma db push` (verified empirically —
# @prisma/config alone pulls in effect, c12, jiti and friends)
RUN mkdir -p /cli-modules && cp -r \
    node_modules/prisma node_modules/@prisma node_modules/postgres \
    node_modules/effect node_modules/fast-check node_modules/pure-rand \
    node_modules/pathe node_modules/proper-lockfile node_modules/graceful-fs \
    node_modules/retry node_modules/std-env node_modules/valibot \
    node_modules/zeptomatch node_modules/graphmatch node_modules/grammex \
    node_modules/get-port-please node_modules/remeda node_modules/c12 \
    node_modules/dotenv node_modules/exsolve node_modules/jiti \
    node_modules/rc9 node_modules/destr node_modules/defu \
    node_modules/pkg-types node_modules/confbox node_modules/perfect-debounce \
    node_modules/deepmerge-ts \
    /cli-modules/

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
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# Prisma CLI (devDep, so standalone doesn't include it) + its dependency closure
COPY --from=builder /cli-modules ./node_modules
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
# sharp uses @img/* vendored binaries — nft tracer misses them, copy explicitly
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /app/node_modules/@img ./node_modules/@img

RUN mkdir -p public/uploads && chown -R nextjs:nodejs /app

# Ensure CMD always runs as root so chown on the volume mount works
USER root

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Fix volume permissions (runs as root), drop to nextjs, then migrate + start.
# If migrate deploy fails (e.g. migration history missing on the DB), fall back to
# `prisma db push`, which additively syncs the schema and refuses destructive changes.
CMD ["sh", "-c", "chown -R nextjs:nodejs /app/public/uploads; exec su-exec nextjs sh -c 'node_modules/.bin/prisma migrate deploy || { echo \"[startup] migrate deploy FAILED — falling back to prisma db push\"; node_modules/.bin/prisma db push; }; node server.js'"]
