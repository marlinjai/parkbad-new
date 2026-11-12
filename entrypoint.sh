#!/bin/sh
# Fetches runtime secrets from Infisical and starts the standalone Next.js
# server (the pattern opuntia-website runs on the same Coolify server).
#
# Required container environment (set on the Coolify application):
#   INFISICAL_UNIVERSAL_AUTH_CLIENT_ID
#   INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET
#   INFISICAL_PROJECT_ID
# Optional:
#   INFISICAL_ENV   defaults to "prod"
#
# Injected at process start by `infisical run` and never written to disk:
# APP_ENV, RESEND_API_KEY, RESEND_AUDIENCE_ID, SANITY_API_READ_TOKEN,
# SANITY_API_WRITE_TOKEN, SANITY_REVALIDATE_SECRET, REVALIDATION_TOKEN,
# GOOGLE_MAPS_API_KEY.
set -e

INFISICAL_DOMAIN="https://infisical.lumitra.co"
INFISICAL_ENV="${INFISICAL_ENV:-prod}"

# Fail loudly, naming the missing variable, rather than start a server whose
# contact form and newsletter silently fail while the healthcheck stays green.
for required in INFISICAL_UNIVERSAL_AUTH_CLIENT_ID INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET INFISICAL_PROJECT_ID; do
  eval "value=\$$required"
  if [ -z "$value" ]; then
    echo "FATAL: $required is not set on this container." >&2
    exit 1
  fi
done

# Next binds to $HOSTNAME, which the container runtime sets to the container
# id; without this the loopback healthcheck can never pass.
export HOSTNAME=0.0.0.0
# This image only ever runs as the live site (or its staging twin, which reads
# the same published content), so the Sanity CDN is on unless a container sets
# APP_ENV explicitly. Vercel never runs this file; it keeps using VERCEL_ENV.
export APP_ENV="${APP_ENV:-production}"

INFISICAL_TOKEN=$(infisical login \
  --method=universal-auth \
  --client-id="$INFISICAL_UNIVERSAL_AUTH_CLIENT_ID" \
  --client-secret="$INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET" \
  --domain="$INFISICAL_DOMAIN" \
  --plain --silent)
export INFISICAL_TOKEN

exec infisical run \
  --projectId "$INFISICAL_PROJECT_ID" \
  --env "$INFISICAL_ENV" \
  --path / \
  --domain "$INFISICAL_DOMAIN" \
  -- env PORT=3000 node server.js
