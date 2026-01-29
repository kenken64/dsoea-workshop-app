# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies for node-gyp and SQLite
RUN apk add --no-cache libc6-compat python3 make g++ sqlite

# ---- Dependencies ----
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# ---- Builder ----
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Dummy values for build-time (not used at runtime)
ENV OPENAI_API_KEY="sk-dummy-key-for-build"
ENV DATABASE_URL="file:build.db"

# Build the application
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

# Install SQLite runtime
RUN apk add --no-cache sqlite

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create data directory for SQLite database
RUN mkdir -p /data && chown nextjs:nodejs /data

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy content directory for markdown files
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

# Copy database seed script and related files
COPY --from=builder --chown=nextjs:nodejs /app/db ./db
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Copy drizzle migrations if they exist
COPY --from=builder --chown=nextjs:nodejs /app/drizzle* ./

# Create entrypoint script
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Run database seed/migration' >> /app/entrypoint.sh && \
    echo 'echo "Running database seed..."' >> /app/entrypoint.sh && \
    echo 'npx tsx db/seed.ts' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Start the application' >> /app/entrypoint.sh && \
    echo 'echo "Starting application..."' >> /app/entrypoint.sh && \
    echo 'exec node server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Default database path (can be overridden via environment variable)
ENV DATABASE_URL="file:/data/workshop.db"

# Start the application
CMD ["/app/entrypoint.sh"]
