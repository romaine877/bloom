# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy workspace files for monorepo resolution
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/server ./apps/server
COPY packages ./packages

# Build the server
WORKDIR /app/apps/server
RUN bun run build

# Production stage
FROM oven/bun:1-slim
WORKDIR /app

# Copy built output and dependencies
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json .
COPY --from=builder /app/node_modules ./node_modules

# Cloud Run sets PORT automatically
ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]

