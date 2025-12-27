#!/bin/bash
set -euo pipefail

# Export the environment variables
set -a
[ -f .env ] && source .env
[ -f .env.local ] && source .env.local
set +a

# Build the image
docker build \
    --build-arg SOURCE_COMMIT="$(git rev-parse HEAD)" \
    --build-arg VITE_APP_NAME="${VITE_APP_NAME}" \
    --build-arg VITE_BASE_URL="${VITE_BASE_URL}" \
    --build-arg VITE_SENTRY_DSN="${VITE_SENTRY_DSN}" \
    -t gamehoop:latest .
