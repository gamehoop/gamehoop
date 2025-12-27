#!/bin/sh
set -euo >/dev/null 2>&1

exec node --import ./.output/server/instrument.server.mjs .output/server/index.mjs
