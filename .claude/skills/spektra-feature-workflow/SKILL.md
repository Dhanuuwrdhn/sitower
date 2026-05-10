# SPEKTRA — Feature Development & Deploy Workflow

Use this skill when developing a new feature, fixing a bug, or deploying changes in the SPEKTRA project (`/Volumes/project-danu/bornworks`).

## Environments

| Environment | URL | Branch | Frontend Port | Backend Port |
|---|---|---|---|---|
| Production | https://spektra.biz.id | `main` | 3000 | 3001 |
| Staging | https://staging.spektra.biz.id | `staging` | 3002 | 3003 |

API production: `https://api.spektra.biz.id/api`
API staging: `https://staging.spektra.biz.id/api`

## Git Workflow

```
feature/fix branch  →  staging  →  PR to main
```

**Rules:**
- Always branch from `staging`, never from `main`
- Deploy and test on staging.spektra.biz.id first
- Only open PR to `main` after staging is verified
- Never push directly to `main`

```bash
# Start new feature
git checkout staging
git pull origin staging
git checkout -b feature/nama-fitur

# After done, push to staging
git push origin feature/nama-fitur
git checkout staging
git merge feature/nama-fitur
git push origin staging
# → GitHub Actions auto-deploys to staging.spektra.biz.id

# After staging verified → PR to main
# → GitHub Actions auto-deploys to spektra.biz.id
```

## Auto-Deploy (GitHub Actions)

Push to `staging` → auto-deploy to staging.spektra.biz.id
Push/merge to `main` → auto-deploy to spektra.biz.id

Workflows are defined in:
- `frontend-sitower/.github/workflows/deploy-staging.yml`
- `frontend-sitower/.github/workflows/deploy-production.yml`
- `backend-sitower/.github/workflows/deploy-staging.yml`
- `backend-sitower/.github/workflows/deploy-production.yml`

Webhook endpoints (called by GitHub Actions):
- `https://staging.spektra.biz.id/webhook/deploy-staging-frontend`
- `https://staging.spektra.biz.id/webhook/deploy-staging-backend`
- `https://api.spektra.biz.id/webhook/deploy-frontend`
- `https://api.spektra.biz.id/webhook/deploy-backend`

## Feature Development Steps

### 1. Planning
- Identify which platform: Web, PWA, or both
- Identify backend needs: new endpoints, schema changes
- Read Figma design before coding

### 2. Backend Changes
```bash
cd backend-sitower

# Schema change → always create migration
# Edit prisma/schema.prisma
npx prisma generate   # update Prisma client locally

# Create manual migration SQL (production has no local DB)
mkdir -p prisma/migrations/YYYYMMDD_description
# Write migration.sql

# On production server:
# psql "$DATABASE_URL" -f migration.sql
```

### 3. Frontend Changes
- API base: from `lib/api.ts`
- Auth: Bearer token from cookie via `lib/auth.ts`
- Mobile vs Desktop: use `isMobile` from `useSidebar()` context
  - Mobile PWA: full-screen bottom sheet (`translate-y-full` → `translate-y-0`)
  - Desktop: right drawer (`translate-x-full` → `translate-x-0`)
- Leaflet maps: always `dynamic import` with `{ ssr: false }`

### 4. CSS conventions
- Global styles in `app/globals.css`
- Feature-specific classes use prefix (e.g. `sert-` for sertifikat, `laporan-` for laporan)

## Manual Deploy (SSH)

```bash
ssh ubuntu@129.226.95.198

# Production backend
cd /opt/backend-sitower && git pull && npm run build && sudo systemctl restart sitower-backend

# Production frontend
cd /opt/frontend-sitower && git pull && npm run build && sudo systemctl restart sitower-frontend

# Staging backend
cd /opt/backend-staging && git pull origin staging && npm run build && sudo systemctl restart sitower-staging-backend

# Staging frontend
cd /opt/frontend-staging && git pull origin staging && npm run build && sudo systemctl restart sitower-staging-frontend
```

## Server Info

- SSH: `ubuntu@129.226.95.198`
- Services: `sitower-backend`, `sitower-frontend`, `sitower-staging-backend`, `sitower-staging-frontend`, `sitower-webhook`
- Logs: `journalctl -u sitower-backend -f`
- Deploy logs: `/opt/live/logs/`

## Common Fixes

**Permission denied on build:**
```bash
sudo chown -R ubuntu:ubuntu /opt/frontend-sitower
```

**Dubious ownership git error:**
```bash
git config --global --add safe.directory /opt/frontend-sitower
```

**Prisma type errors after schema change:**
```bash
npx prisma generate
```

**Backend dist not found:**
```bash
sudo rm -rf /opt/backend-sitower/dist
cd /opt/backend-sitower && npm run build
```
