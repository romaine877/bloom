# syntax=docker/dockerfile:1

# =============================================================================
# Stage 1: Install dependencies with Bun
# =============================================================================
FROM oven/bun:1.3-alpine AS deps

WORKDIR /app

# Copy root workspace files first
COPY package.json bun.lock bunfig.toml tsconfig.json ./

# Copy all workspace packages (Bun needs full workspace structure)
COPY packages ./packages

# Copy package.json files for all apps (Bun lockfile references all workspaces)
# We only need package.json, not the full source, for workspace resolution
COPY apps/server/package.json ./apps/server/
COPY apps/native/package.json ./apps/native/
COPY apps/web/package.json ./apps/web/

# Install all dependencies
# Bun needs to see all workspace package.json files to match the lockfile
RUN bun install --frozen-lockfile

# =============================================================================
# Stage 2: Build the server
# =============================================================================
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages ./packages

# Copy source files (packages already copied in deps stage)
COPY package.json bun.lock bunfig.toml tsconfig.json ./
COPY apps/server ./apps/server

# Build the server (tsdown bundles workspace dependencies)
WORKDIR /app/apps/server
RUN bun run build

# =============================================================================
# Stage 3: Production image with Node.js
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

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
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]

