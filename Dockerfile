FROM node:24.12.0-alpine AS base

WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Ensure -deps stage is skipped if we only change source files
COPY package.json pnpm-lock.yaml ./

# Stage 1 - Install production dependencies
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Stage 2 - Install build dependencies
FROM base AS build-deps
RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage 3 - Build the application
FROM build-deps AS build


# ARG and ENV vars are leaked into the final image
# Make sure these are not secrets!
ARG SOURCE_COMMIT
ARG VITE_SENTRY_DSN

ENV NODE_ENV=production \
    SENTRY_RELEASE=${SOURCE_COMMIT} \
    VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    VITE_SENTRY_RELEASE=${SOURCE_COMMIT} \
    VITE_SOURCE_COMMIT=${SOURCE_COMMIT}

COPY . .
RUN --mount=type=secret,id=SENTRY_URL,env=SENTRY_URL \
    --mount=type=secret,id=SENTRY_ORG,env=SENTRY_ORG \
    --mount=type=secret,id=SENTRY_PROJECT,env=SENTRY_PROJECT \
    --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
    pnpm build

# Stage 4 - Run the application
FROM base AS runtime

# Copy the files we need at runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output
COPY --from=build /app/scripts/entrypoint.sh .

# Create a non-root user to run as
RUN chmod +x entrypoint.sh && \
    addgroup -S apps && \
    adduser -S -G apps app

USER app

ENV HOST=0.0.0.0

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
