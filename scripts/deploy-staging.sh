#!/bin/bash
# Deploy script for staging — always overwrites .env.local before building
# Usage: bash scripts/deploy-staging.sh
# Run from: /opt/frontend-staging

set -e

STAGING_DIR="/opt/frontend-staging"
API_URL="https://staging.spektra.biz.id/api"
PM2_NAME="frontend-staging"

echo "[1/5] Pulling latest code..."
cd "$STAGING_DIR"
git pull origin main

echo "[2/5] Writing .env.local (staging)..."
cat > "$STAGING_DIR/.env.local" <<EOF
NEXT_PUBLIC_API_URL=$API_URL
EOF
echo "  => NEXT_PUBLIC_API_URL=$API_URL"

echo "[3/5] Installing dependencies..."
npm install --omit=dev

echo "[4/5] Building..."
npm run build

echo "[5/5] Restarting PM2 ($PM2_NAME)..."
pm2 restart "$PM2_NAME" || pm2 start npm --name "$PM2_NAME" -- start

echo ""
echo "Done. Staging deployed at https://staging.spektra.biz.id"
