#!/bin/bash
# Deploy script for staging — always overwrites .env.local before building
# Usage: bash scripts/deploy-staging.sh
# Run from anywhere on the staging server

set -e

# Load secrets from /etc/spektra/staging.env if present (must define GMAPS_KEY)
[ -f /etc/spektra/staging.env ] && set -a && . /etc/spektra/staging.env && set +a

STAGING_DIR="/opt/frontend-staging"
API_URL="${API_URL:-https://staging.spektra.biz.id/api}"
GMAPS_KEY="${GMAPS_KEY:?GMAPS_KEY required (export it or put in /etc/spektra/staging.env)}"
SERVICE="sitower-staging-frontend"

echo "[1/5] Pulling latest code..."
cd "$STAGING_DIR"
git pull origin main

echo "[2/5] Writing .env.local (staging)..."
printf "NEXT_PUBLIC_API_URL=%s\nNEXT_PUBLIC_GOOGLE_MAPS_API_KEY=%s\nNEXT_PUBLIC_SHOW_ALL_MENU=true\n" \
  "$API_URL" "$GMAPS_KEY" > "$STAGING_DIR/.env.local"
echo "  => NEXT_PUBLIC_API_URL=$API_URL"

echo "[3/5] Installing dependencies..."
npm install

echo "[4/5] Building..."
npm run build

echo "[5/5] Restarting service ($SERVICE)..."
sudo systemctl restart "$SERVICE"
sleep 2
sudo systemctl status "$SERVICE" --no-pager

echo ""
echo "Done. Staging deployed at https://staging.spektra.biz.id"
