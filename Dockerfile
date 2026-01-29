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

# Install dependencies (suppress npm update notice)
RUN npm ci --loglevel=error

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

# Build-time arguments with dummy defaults (Railway can override these)
ARG OPENAI_API_KEY="sk-dummy-key-for-build"
ARG DATABASE_URL="file:build.db"

# Make ARGs available as ENV during build
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV DATABASE_URL=$DATABASE_URL

# Create data directory for build
RUN mkdir -p /app/data

# Build the application
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

# Install SQLite runtime
RUN apk add --no-cache sqlite

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy content directory for markdown files
COPY --from=builder /app/content ./content

# Copy database seed script and related files
COPY --from=builder /app/db ./db
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy drizzle migrations if they exist
COPY --from=builder /app/drizzle* ./

# Create entrypoint script
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Debug info' >> /app/entrypoint.sh && \
    echo 'echo "Database URL: $DATABASE_URL"' >> /app/entrypoint.sh && \
    echo 'echo "Current user: $(whoami)"' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Ensure data directory exists and is writable' >> /app/entrypoint.sh && \
    echo 'mkdir -p /app/data' >> /app/entrypoint.sh && \
    echo 'ls -la /app/data' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Run database seed/migration' >> /app/entrypoint.sh && \
    echo 'echo "Running database seed..."' >> /app/entrypoint.sh && \
    echo 'NPM_CONFIG_UPDATE_NOTIFIER=false npx --yes tsx db/seed.ts || echo "Seed failed, continuing anyway..."' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Start the application' >> /app/entrypoint.sh && \
    echo 'echo "Starting application..."' >> /app/entrypoint.sh && \
    echo 'exec node server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Default database path (can be overridden via environment variable)
# Use /app/data for Railway compatibility without requiring a volume
ENV DATABASE_URL="file:/app/data/workshop.db"

# Start the application
CMD ["/app/entrypoint.sh"]
