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
RUN echo "=== Running build ===" && \
    bun run build && \
    echo "=== Build completed ===" && \
    echo "=== Checking dist directory ===" && \
    ls -la dist/ || (echo "ERROR: dist directory not created!" && exit 1) && \
    echo "=== Looking for entry file ===" && \
    (test -f dist/index.js && echo "✓ Found dist/index.js") || \
    (test -f dist/index.mjs && echo "✓ Found dist/index.mjs") || \
    (echo "ERROR: No entry file (index.js or index.mjs) found!" && \
     echo "Contents of dist:" && ls -la dist/ && \
     echo "Contents of current directory:" && ls -la . && \
     exit 1)

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

# Verify files were copied correctly (run as root before switching user)
# tsdown outputs index.mjs for ESM format
RUN ls -la dist/ && \
    (test -f dist/index.js && echo "✓ Found dist/index.js") || \
    (test -f dist/index.mjs && echo "✓ Found dist/index.mjs") || \
    (echo "ERROR: No entry file found after copy" && exit 1)

# Create a startup script that logs errors and finds the correct entry file
RUN echo '#!/bin/sh\n\
set -e\n\
echo "=== Starting server ==="\n\
echo "PORT=${PORT:-8080}"\n\
echo "NODE_ENV=${NODE_ENV:-production}"\n\
echo "=== Files in dist ==="\n\
ls -la dist/ || true\n\
echo "=== Looking for entry file ==="\n\
if [ -f dist/index.js ]; then\n\
  echo "Found dist/index.js, starting..."\n\
  exec node dist/index.js\n\
elif [ -f dist/index.mjs ]; then\n\
  echo "Found dist/index.mjs, starting..."\n\
  exec node dist/index.mjs\n\
else\n\
  echo "ERROR: No entry file found!"\n\
  ls -la dist/ || echo "dist directory does not exist"\n\
  exit 1\n\
fi\n\
' > /app/start.sh && chmod +x /app/start.sh && chown fastify:nodejs /app/start.sh

# Bundle is self-contained, no need to install dependencies

USER fastify

# Cloud Run sets PORT environment variable
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# tsdown outputs index.mjs for ESM format - use it directly
CMD ["node", "dist/index.mjs"]

