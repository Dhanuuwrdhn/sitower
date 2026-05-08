# frontend-sitower

Next.js 14 App Router frontend untuk SPEKTRA — sistem pemantauan kerawanan transmisi tower PLN UIW Banten.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Map**: Leaflet + react-leaflet
- **HTTP**: axios
- **Toast**: react-hot-toast
- **Auth**: js-cookie (token stored in cookie)

## Backend API

- Base URL: `http://localhost:3001/api` (lihat `.env.local`)
- Semua request authenticated pakai Bearer token dari cookie

## Struktur Direktori

```
app/                   # Next.js App Router pages
  dashboard/           # Halaman utama dashboard
  peta/                # Peta tower (Leaflet)
  kerawanan/           # Data kerawanan tower
  aset/                # Data aset tower
  laporan/
    gangguan/          # Laporan gangguan
    cleanup/           # Laporan cleanup
    cui/               # Laporan CUI
  history/
    gangguan/          # History gangguan
    petir/             # History petir
    pergantian/        # History pergantian
  sertifikat/          # Sertifikat
  as-built-drawing/    # As-built drawing
  admin/
    users/             # Manajemen user
  login/               # Halaman login

components/
  ui/                  # Komponen UI reusable
  layout/              # Layout komponen (navbar, sidebar, dll)
  map/                 # Komponen peta Leaflet

lib/                   # Utilities, API helpers
constants/             # Konstanta aplikasi
```

## Dev Commands

```bash
npm run dev      # Start dev server di port 3000
npm run build    # Build production
npm run lint     # Lint
```

## Conventions

- Semua file TypeScript
- Komponen pakai `.tsx`, utilities pakai `.ts`
- API calls terpusat di `lib/` atau per-feature
- Leaflet hanya di-render client-side (gunakan dynamic import dengan `{ ssr: false }`)

## Catatan

- Project ini bagian dari SPEKTRA / bornworks, **bukan** Sprout
- Tidak ada Jira ticket untuk perubahan di repo ini
- Backend berjalan di port 3001, frontend di port 3000
