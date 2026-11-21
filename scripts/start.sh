#!/bin/sh
# Container start (runs as the nextjs user via su-exec, see Dockerfile CMD).
# Deliberately no `set -e`: nothing here may stop the server from starting.
# Keep LF line endings (enforced by .gitattributes); CRLF breaks /bin/sh.

# Sync the DB schema (idempotent, never exits non-zero).
node scripts/db-bootstrap.cjs

# One-time random token for the startup cache flush. It only exists inside
# this container's environment.
CACHE_WARM_TOKEN="$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')"
export CACHE_WARM_TOKEN

# Flush + warm the ISR cache once the server is listening (background).
node scripts/warm-cache.cjs &

exec node server.js
