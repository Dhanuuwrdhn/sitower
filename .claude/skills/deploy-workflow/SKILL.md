---
name: deploy-workflow
description: Cara deploy SPEKTRA ke production (spektra.biz.id), SSH access, webhook, dan troubleshooting umum.
---

# Deploy Workflow — SPEKTRA

## Production Server

| Item | Value |
|---|---|
| URL | https://spektra.biz.id |
| Server | `ubuntu@129.226.95.198` |
| Frontend dir | `/opt/frontend-sitower/` |
| Deploy script | `/opt/live/deploy-frontend.sh` |
| Service | `sitower-frontend` (systemd) |
| Backend port | `3001` |
| Frontend port | `3000` |

## SSH Access

Minta Dhanu untuk tambah SSH public key kamu ke server:
```bash
# Di lokal — generate key jika belum ada
ssh-keygen -t ed25519

# Kirim public key ke Dhanu untuk di-copy ke server
cat ~/.ssh/id_ed25519.pub
```

Dhanu jalankan di server:
```bash
echo "<public_key_kamu>" >> ~/.ssh/authorized_keys
```

Test akses:
```bash
ssh ubuntu@129.226.95.198
```

## Deploy Manual (via SSH)

```bash
ssh ubuntu@129.226.95.198

cd /opt/frontend-sitower
git config --global --add safe.directory /opt/frontend-sitower
git pull origin main
sudo rm -rf .next
npm install
npm run build
sudo systemctl restart sitower-frontend
```

## Deploy via Webhook (otomatis)

Webhook di-trigger otomatis saat `git push` ke `origin main` melalui GitHub Actions atau manual:

```bash
curl -X POST https://api.spektra.biz.id/webhook/deploy-frontend
```

Cek log deploy:
```bash
ssh ubuntu@129.226.95.198 "tail -50 /opt/live/logs/deploy-frontend.log"
```

## Cek Status Service

```bash
ssh ubuntu@129.226.95.198 "sudo systemctl is-active sitower-frontend"
# Output: active

# Restart manual jika perlu
ssh ubuntu@129.226.95.198 "sudo systemctl restart sitower-frontend"
```

## Troubleshooting Umum

### Build gagal karena `.next` permission denied
```bash
ssh ubuntu@129.226.95.198 "sudo rm -rf /opt/frontend-sitower/.next && sudo chown -R ubuntu:ubuntu /opt/frontend-sitower"
```

### Git error: `dubious ownership`
```bash
ssh ubuntu@129.226.95.198 "git config --global --add safe.directory /opt/frontend-sitower"
```

### CSS tidak update di browser setelah deploy
Hard refresh di browser: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac).  
Di mobile Chrome: tahan tombol reload.

### Deploy webhook tidak response
Pastikan URL benar: `https://api.spektra.biz.id/webhook/deploy-frontend`  
Bukan `spektra.biz.id/webhook/` — webhook ada di subdomain `api`.

---

## PWA Mobile vs Desktop

Frontend SPEKTRA punya dua layout terpisah:

| | Mobile PWA (`< 768px`) | Desktop Web |
|---|---|---|
| Topbar | Blue `#076c9e`, logo + hamburger | Floating rounded card, dropdown user |
| Sidebar | Full-screen overlay, user avatar | Collapsible panel, no avatar |
| Login | Bg image full + white card float | Split panel kiri-kanan |

Deteksi mobile via `isMobile` di `SidebarContext` (cek `window.innerWidth < 768`).  
Komponen Topbar dan Sidebar render branch berbeda berdasarkan `isMobile`.

CSS mobile ditulis dengan `@media (max-width: 767px)` di `app/globals.css`.

---

## Design System

Semua CSS custom ada di `app/globals.css` dengan prefix per-section:
- `login-` → halaman login
- `dash-` → halaman dashboard
- `pwa-` → komponen PWA (topbar mobile)
- `nav-item` → sidebar desktop

Design dari Figma file: `SPEKTRA` (tanya Dhanu untuk akses).  
Color tokens utama:
- Primary: `#076c9e`
- Danger: `#d92c20`
- Background: `#f6f9fc`
- Text: `#1b1b1b`
- Subtle: `#5f737f`

---

## Dev Lokal

```bash
# Frontend
cd frontend-sitower
npm install
cp .env.local.example .env.local   # minta dari Dhanu
npm run dev   # → http://localhost:3000

# Backend
cd backend-sitower
npm install
# Setup .env dengan DATABASE_URL dan JWT_SECRET (minta dari Dhanu)
npx prisma generate
npm run start:dev   # → http://localhost:3001
```

`.env.local` frontend minimal:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```
