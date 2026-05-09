---
name: sitower-workspace-context
description: Workspace context for SPEKTRA — monitoring kerawanan transmisi tower PLN UIW Banten. Use when working on frontend-sitower (Next.js) or backend-sitower (NestJS).
---

# SiTower Workspace Context

Project ini adalah **SPEKTRA** — sistem pemantauan kerawanan transmisi tower PLN UIW Banten.  
**Bukan** bagian dari Sprout. Tidak ada Jira ticket untuk perubahan di repo ini.

## Workspace Map

| Folder | Tech | Port | Description |
|---|---|---|---|
| `backend-sitower/` | NestJS 11 + Prisma + PostgreSQL | 3001 | REST API + Swagger |
| `frontend-sitower/` | Next.js 14 App Router + Tailwind + Leaflet | 3000 | Web dashboard |
| `landing-page/` | — | — | Landing page (terpisah) |

## Backend — `backend-sitower/`

### Stack
- **Framework**: NestJS 11
- **ORM**: Prisma v7 + adapter pg (PostgreSQL)
- **Auth**: JWT + Passport (`JwtAuthGuard` dari `src/auth/`)
- **Validation**: class-validator + class-transformer
- **Docs**: Swagger di `http://localhost:3001/api/docs`
- **File Upload**: multer → disimpan di `uploads/`
- **Excel Import**: xlsx

### Struktur `src/`

| Modul | Path | Fungsi |
|---|---|---|
| auth | `src/auth/` | JWT login, guard |
| pegawai | `src/pegawai/` | Data user/pegawai |
| towers | `src/towers/` | Data tower PLN |
| laporan | `src/laporan/` | Laporan gangguan, cleanup, CUI |
| sertifikat | `src/sertifikat/` | Sertifikat tower |
| as-built-drawing | `src/as-built-drawing/` | Drawing aset |
| import | `src/import/` | Import data dari Excel |
| prisma | `src/prisma/` | PrismaService (global singleton) |

### Conventions Backend
- Setiap modul wajib punya: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`
- DTO pakai class-validator decorator
- `PrismaService` di-inject via `PrismaModule` (global — tidak perlu import ulang per modul)
- Response format konsisten: `{ data, message }`
- Auth: selalu pakai `@UseGuards(JwtAuthGuard)` di controller yang butuh proteksi

### Dev Commands Backend
```bash
npm run start:dev        # Dev server dengan watch mode (port 3001)
npm run build            # Build production
npm run start:prod       # Run production build

# Prisma
npx prisma migrate dev   # Buat dan jalankan migration baru
npx prisma generate      # Generate Prisma client
npx prisma db seed       # Jalankan seed
npx prisma studio        # GUI database browser
```

### Database
- **Engine**: PostgreSQL
- **Schema**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`
- **Seed**: `prisma/seed.ts`

---

## Frontend — `frontend-sitower/`

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (`tailwind.config.ts`)
- **Map**: Leaflet + react-leaflet (client-side only)
- **HTTP**: axios
- **Toast**: react-hot-toast
- **Auth**: js-cookie (Bearer token disimpan di cookie)

### Backend API
- Base URL: `http://localhost:3001/api` (dari `.env.local`)
- Semua request authenticated pakai Bearer token dari cookie

### Struktur Direktori Frontend

| Path | Fungsi |
|---|---|
| `app/dashboard/` | Halaman utama dashboard |
| `app/peta/` | Peta tower interaktif (Leaflet) |
| `app/kerawanan/` | Data kerawanan tower |
| `app/aset/` | Data aset tower |
| `app/laporan/gangguan/` | Laporan gangguan |
| `app/laporan/cleanup/` | Laporan cleanup |
| `app/laporan/cui/` | Laporan CUI |
| `app/history/gangguan/` | History gangguan |
| `app/history/petir/` | History petir |
| `app/history/pergantian/` | History pergantian |
| `app/sertifikat/` | Sertifikat |
| `app/as-built-drawing/` | As-built drawing |
| `app/admin/users/` | Manajemen user |
| `app/login/` | Halaman login |
| `components/ui/` | Komponen UI reusable |
| `components/layout/` | Navbar, sidebar, layout |
| `components/map/` | Komponen peta Leaflet |
| `lib/` | Utilities, API helpers |
| `constants/` | Konstanta aplikasi |

### Design Tokens
- **Primary**: `#076c9e`
- **Danger**: `#d92c20`
- **Success**: `#059669`
- **Text primary**: `#1b1b1b`
- **Text secondary**: `#5f737f`
- **Placeholder**: `#97aab3`
- **Background**: `#f6f9fc`

### Conventions Frontend
- Semua file TypeScript: komponen pakai `.tsx`, utilities pakai `.ts`
- API calls terpusat di `lib/` atau per-feature
- **Leaflet wajib dynamic import** dengan `{ ssr: false }` — tidak boleh di-render server-side
- Auth token diambil dari cookie, dikirim sebagai `Authorization: Bearer <token>`
- CSS classes custom didefinisikan di `app/globals.css` dengan prefix per-page (misal `dash-`, `login-`)

### Dev Commands Frontend
```bash
npm run dev      # Dev server di port 3000
npm run build    # Build production
npm run lint     # Lint
```

---

## Working Assumptions

- Backend dan frontend dianggap satu workspace context dalam proyek SPEKTRA
- Tidak ada design system eksternal — komponen UI dibuat custom di `components/`
- Tidak ada Jira workflow — tidak perlu branching convention khusus
- Untuk perubahan skema database, selalu jalankan `npx prisma migrate dev` setelah edit `schema.prisma`
- Setelah edit Prisma schema, jalankan `npx prisma generate` jika tidak pakai `migrate dev`
