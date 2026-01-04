# syntax=docker/dockerfile:1

# =============================================================================
# Stage 1: Install dependencies with Bun
# =============================================================================
FROM oven/bun:1.1-alpine AS deps

WORKDIR /app

# Copy root workspace files
COPY package.json bun.lock bunfig.toml ./

# Copy workspace package.json files for dependency resolution
COPY apps/server/package.json ./apps/server/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/

# Install all dependencies
RUN bun install --frozen-lockfile

# =============================================================================
# Stage 2: Build the server
# =============================================================================
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/env/node_modules ./packages/env/node_modules

# Copy source files
COPY package.json bun.lock bunfig.toml tsconfig.json ./
COPY apps/server ./apps/server
COPY packages/config ./packages/config
COPY packages/db ./packages/db
COPY packages/env ./packages/env

# Build the server (tsdown bundles workspace dependencies)
WORKDIR /app/apps/server
RUN bun run build

# =============================================================================
# Stage 3: Production image with Node.js
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify

# Copy built output
COPY --from=builder --chown=fastify:nodejs /app/apps/server/dist ./dist
COPY --from=builder --chown=fastify:nodejs /app/apps/server/package.json ./

# Install only production dependencies needed for runtime
# The bundle is self-contained, but we may need native modules
RUN npm install --omit=dev --ignore-scripts 2>/dev/null || true

USER fastify

# Cloud Run sets PORT environment variable
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:8080/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "dist/index.js"]

