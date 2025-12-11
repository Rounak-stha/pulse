#!/bin/sh

# The location of the dashboard build.
DASHBOARD_BUILD_DIR="/app/packages/dashboard/build"

# Check if the required environment variable is set by Cloud Run
if [ -z "$VITE_GOOGLE_CLIENT_ID" ]; then
  echo "Error: VITE_GOOGLE_CLIENT_ID is not set!"
  exit 1
fi

echo "Injecting VITE_GOOGLE_CLIENT_ID into frontend env..."

# Perform the substitution on the placeholder file (env-config.js).
envsubst '$$VITE_GOOGLE_CLIENT_ID' < $DASHBOARD_BUILD_DIR/env-config.js > $DASHBOARD_BUILD_DIR/env-config.tmp.js
mv $DASHBOARD_BUILD_DIR/env-config.tmp.js $DASHBOARD_BUILD_DIR/env-config.js

echo "Substitution complete. Starting Vendure Server..."

# Execute the original command to start the server
exec "$@"
