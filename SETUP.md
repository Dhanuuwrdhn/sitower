# Frontend SPEKTRA — Setup Guide

Next.js 14 App Router client untuk sistem pemantauan tower transmisi PLN UIW Banten.

---

## Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 + design tokens SPEKTRA |
| Map | Leaflet + react-leaflet (dynamic import, SSR disabled) |
| HTTP | Axios (dengan interceptor JWT auto-attach + 401 redirect) |
| Auth | JWT disimpan di cookie (`js-cookie`) |
| Toast | react-hot-toast |
| Icons | lucide-react |
| Font | Inter (next/font/google) |

---

## Prasyarat

- Node.js >= 18
- Backend SPEKTRA berjalan di port `3001`

---

## Instalasi

```bash
cd frontend-sitower
npm install
```

---

## Environment

Buat file `.env.local` di root `frontend-sitower/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Menjalankan

```bash
# Development
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm run start
```

---

## Struktur Direktori

```
frontend-sitower/
├── app/
│   ├── layout.tsx              # Root layout: Inter font + ClientLayout
│   ├── page.tsx                # Redirect → /dashboard
│   ├── globals.css             # Tailwind + SPEKTRA component classes
│   ├── login/                  # Halaman login
│   ├── dashboard/              # Dashboard utama (map + stat cards + tabel)
│   ├── aset/                   # Data aset tower transmisi
│   ├── sertifikat/             # Sertifikat kelayakan tower
│   ├── as-built-drawing/       # Dokumen as built drawing
│   ├── laporan/
│   │   ├── gangguan/           # Riwayat & form laporan gangguan
│   │   ├── cui/                # Climb Up Inspection
│   │   └── cleanup/            # Clean Up Isolator
│   └── admin/
│       └── users/              # User management (admin only)
│
├── components/
│   ├── layout/
│   │   ├── ClientLayout.tsx    # Routing: public vs protected layout
│   │   ├── Sidebar.tsx         # Nav sidebar 220px (gradient biru)
│   │   └── Topbar.tsx          # Header 64px sticky + user info
│   ├── map/
│   │   └── TowerMap.tsx        # Peta Leaflet (Gardu Induk + Tower + Jalur)
│   └── ui/                     # Komponen reusable
│       ├── ActionMenu.tsx      # "..." dropdown dengan items[]
│       ├── ConfirmModal.tsx    # Modal konfirmasi hapus
│       ├── EmptyState.tsx      # Empty state tabel/grid
│       ├── Pagination.tsx      # Pagination lengkap (limit + info + nav)
│       ├── SearchInput.tsx     # Input search dengan icon
│       ├── SkeletonRow.tsx     # Loading skeleton rows
│       └── StatusBadge.tsx     # Badge status laporan & kondisi tower
│
├── lib/
│   ├── api.ts                  # Axios instance + semua endpoint API
│   ├── auth.ts                 # Cookie helpers: getUser, isAdmin, saveAuth, logout
│   ├── geodata.ts              # Data KML: 35 GI, 427 SUTET, 562 SUTT, 174 SKTT, 52 jalur
│   └── utils.ts                # cn(), formatDate(), formatDateTime(), getInitials()
│
├── constants/
│   └── kategori.ts             # KATEGORI_LABEL, KATEGORI_ICON, KATEGORI_COLOR, STATUS_LABEL
│
└── middleware.ts               # Auth guard: redirect ke /login jika belum login
```

---

## Design System SPEKTRA

### Warna (tailwind.config.ts)

| Token | Hex | Penggunaan |
|---|---|---|
| `app-bg` | `#f4f7fb` | Background halaman |
| `app-text` | `#1a202c` | Teks utama |
| `app-muted` | `#64748b` | Teks sekunder |
| `app-subtle` | `#94a3b8` | Placeholder |
| `app-border` | `#e8edf2` | Border card/input |
| `sidebar` | gradient `#1a3a5c → #0d2137` | Background sidebar |
| `brand` | `#2563eb` | Biru utama |

### CSS Classes (globals.css)

```css
/* Layout */
.sidebar         /* Fixed 220px left nav */
.nav-item        /* Nav link item */
.nav-item.active /* Active state (bg-blue-600) */

/* Cards */
.card            /* White card: rounded-xl border shadow */
.card-body       /* Padding p-5 */

/* Status badges */
.badge-berlangsung   /* Merah */
.badge-ditangani     /* Amber */
.badge-selesai       /* Hijau */
.badge-pemantauan    /* Biru */
.badge-eskalasi      /* Ungu */
.badge-menunggu      /* Abu */
.badge-blink         /* Animasi blink untuk berlangsung/gangguan */

/* Table */
.data-table      /* Full-width table dengan border */

/* Buttons */
.btn-primary     /* Biru pill */
.btn-outline     /* Outline biru pill */
.btn-outline-red /* Outline merah pill */

/* Form */
.form-input      /* Input/select/textarea standar */
```

---

## Auth Flow

1. User login di `/login` → POST `/api/auth/login` → dapat `token` + `user`
2. Token disimpan di cookie `sitower_token`, user di `sitower_user`
3. `middleware.ts` membaca cookie di setiap request:
   - Belum login + akses halaman protected → redirect `/login`
   - Sudah login + akses `/login` → redirect `/dashboard`
4. `api.ts` interceptor otomatis attach `Authorization: Bearer <token>` ke semua request
5. Response 401 → auto logout + redirect `/login`

### Akun Demo

| Role | NIK | Password |
|---|---|---|
| Admin | `000001` | `admin123` |
| Teknisi | `100001` | `teknisi123` |

---

## Peta (TowerMap)

Komponen `TowerMap` di-load dengan dynamic import (`ssr: false`) karena Leaflet butuh `window`.

```typescript
const TowerMap = dynamic(() => import('@/components/map/TowerMap'), { ssr: false })
```

Data geodata dari `lib/geodata.ts` (418KB, auto-generated dari KML):
- **35 Gardu Induk** — DivIcon hitam dengan badge kerawanan
- **427 Tower SUTET 500kV** — CircleMarker oranye (tampil di zoom ≥ 10)
- **562 Tower SUTT 150kV** — CircleMarker biru (zoom ≥ 11)
- **174 Tower SKTT 150kV** — CircleMarker ungu (zoom ≥ 12)
- **52 Jalur Transmisi** — Polyline dengan warna per tipe

---

## API Client (`lib/api.ts`)

```typescript
import { towersApi, laporanApi, sertifikatApi, asBuiltApi, pegawaiApi, importApi } from '@/lib/api'

// Contoh pemakaian
const res = await laporanApi.getAll({ page: 1, limit: 10, jenisGangguan: 'cui' })
const stats = await laporanApi.getStats()
const dropdown = await towersApi.getDropdown()
```

### Response pattern

API bisa mengembalikan dua format — tangani keduanya:

```typescript
const p = res.data
const rows  = Array.isArray(p) ? p : (p.data ?? [])
const total = Array.isArray(p) ? p.length : (p.total ?? 0)
```

---

## Halaman & Akses

| Path | Role | Keterangan |
|---|---|---|
| `/dashboard` | Semua | Peta + stat + tabel gangguan terbaru |
| `/aset` | Semua | Data tower, import Excel (admin) |
| `/sertifikat` | Semua | Grid kartu sertifikat |
| `/as-built-drawing` | Semua | Tabel dokumen drawing |
| `/laporan/gangguan` | Semua | Riwayat gangguan + form tambah |
| `/laporan/cui` | Semua | Laporan CUI |
| `/laporan/cleanup` | Semua | Laporan cleanup isolator |
| `/admin/users` | Admin | Manajemen user, redirect jika bukan admin |

---

## Troubleshooting

**Leaflet icon tidak muncul**
Pastikan dynamic import tanpa SSR digunakan. Jangan import Leaflet di server component.

**API 401 loop**
Bersihkan cookie browser: `sitower_token` dan `sitower_user`.

**Build gagal: "window is not defined"**
Ada komponen Leaflet yang di-render di server. Pindahkan ke dynamic import dengan `ssr: false`.

**Port sudah dipakai**
Next.js otomatis mencari port berikutnya (3001, 3002, dst).
Atau set manual: `next dev -p 3003`.
