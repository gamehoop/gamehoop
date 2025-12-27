#!/bin/sh
set -euo >/dev/null 2>&1

# Run the database migrations
./node_modules/.bin/kysely migrate latest

# Start the web server
exec node --import ./.output/server/instrument.server.mjs .output/server/index.mjs
