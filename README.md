# SITOWER

Sistem Informasi Tower Transmisi — aplikasi web monitoring dan manajemen aset tower transmisi PLN berbasis Next.js 14.

---

## Fitur

| Halaman | Deskripsi |
|---|---|
| Dashboard | Ringkasan kondisi tower, alert gangguan aktif, peta sebaran, timeline aktivitas, grafik petir per zona |
| Peta Tower | Peta interaktif OpenStreetMap dengan marker berwarna per status — klik marker untuk detail kepemilikan |
| Kerawanan Sosial | Tabel risiko sosial per tower dengan filter level (rendah / sedang / tinggi) |
| History Gangguan | Riwayat insiden dan gangguan operasional beserta status penyelesaian |
| History Petir | Riwayat sambaran petir, data amplitudo (kA), dan distribusi per zona |
| History Pergantian | Log penggantian komponen tower beserta estimasi biaya |
| Sertifikat | Halaman terproteksi — login NIK pegawai atau kode akses, lalu tampilkan grid sertifikat tower |
| Data Aset | Inventaris lengkap tower: spesifikasi teknis, kepemilikan, GI asal/tujuan, koordinat midspan |

### Status Tower

Setiap tower memiliki salah satu dari empat status yang ditampilkan sebagai badge berwarna di seluruh halaman dan sebagai marker di peta:

| Status | Warna | Keterangan |
|---|---|---|
| Normal | Hijau `#16a34a` | Beroperasi normal |
| Waspada | Amber `#d97706` | Pemantauan intensif |
| Gangguan | Merah `#dc2626` | Perlu penanganan segera — badge dan marker **berkedip** |
| Maintenance | Biru `#2563eb` | Sedang dalam perbaikan |

---

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Bahasa** — TypeScript
- **Styling** — Tailwind CSS
- **Peta** — react-leaflet v4 + Leaflet v1 (OpenStreetMap, tanpa API key)
- **Ikon** — lucide-react
- **Utilitas** — clsx, tailwind-merge

---

## Struktur Proyek

```
sitower/
├── app/
│   ├── layout.tsx              # Root layout dengan sidebar
│   ├── page.tsx                # Redirect ke /dashboard
│   ├── dashboard/page.tsx
│   ├── peta/page.tsx
│   ├── kerawanan/page.tsx
│   ├── history/
│   │   ├── gangguan/page.tsx
│   │   ├── petir/page.tsx
│   │   └── pergantian/page.tsx
│   ├── sertifikat/page.tsx
│   └── aset/page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── TowerMap.tsx            # Leaflet map (client-only)
│   ├── TowerMapDynamic.tsx     # dynamic import ssr:false wrapper
│   ├── StatCard.tsx
│   ├── StatusBadge.tsx         # Badge dengan animasi blink untuk gangguan
│   ├── AlertBanner.tsx
│   ├── ActivityTimeline.tsx
│   ├── BarChart.tsx
│   ├── CertCard.tsx
│   └── PageHeader.tsx
└── lib/
    ├── data.ts                 # Semua data dummy (towers, history, sertifikat, pegawai)
    └── utils.ts                # cn(), statusColor(), kerawananColor(), dll
```

---

## Instalasi dan Penggunaan

### Prasyarat

- Node.js >= 18
- npm >= 9

### Langkah

```bash
# Clone repositori
git clone https://github.com/danusprout/sitower.git
cd sitower

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka `http://localhost:3000` di browser.

### Build Produksi

```bash
npm run build
npm start
```

---

## Data

Seluruh data bersifat dummy dan didefinisikan di `lib/data.ts`. Tidak ada koneksi ke database atau API eksternal.

### Tower

Tujuh tower transmisi di area Tangerang–Bogor:

| ID | Nama | Tegangan | Status |
|---|---|---|---|
| T-104 | Tower Serpong | 150 kV | Normal |
| T-091 | Tower Legok Selatan | 500 kV | Waspada |
| T-117 | Tower Cikupa–Balaraja | 500 kV | Gangguan |
| T-055 | Tower Balaraja Barat | 150 kV | Maintenance |
| T-208 | Tower Parung | 500 kV | Normal |
| T-023 | Tower Tigaraksa A | 150 kV | Waspada |
| T-178 | Tower Rajeg Utara | 150 kV | Normal |

### Akun Demo (Halaman Sertifikat)

| NIK | Nama | Jabatan | Unit |
|---|---|---|---|
| 1234567890123456 | Budi Santoso | Supervisor Transmisi | UP3 Banten |
| 9876543210987654 | Siti Rahayu | Teknisi Senior | UP3 Tangerang |
| 1122334455667788 | Ahmad Fauzi | Manajer Aset | UIW Banten |

Kode akses: `PLN2025`, `SITOWER`, `ADMIN123`

---

## Catatan Implementasi

**Leaflet dan SSR** — Leaflet mengakses `window` saat inisialisasi sehingga tidak kompatibel dengan server-side rendering. `TowerMap.tsx` di-wrap oleh `TowerMapDynamic.tsx` menggunakan `dynamic(() => import(...), { ssr: false })` untuk mencegah error `window is not defined`.

**Animasi Gangguan** — Tower dengan status `gangguan` menampilkan efek blink pada badge status (CSS class `badge-blink`) dan pada CircleMarker di peta (Leaflet `pathOptions.className: "marker-gangguan"`). Animasi didefinisikan di `app/globals.css`.

**AuthGate Sertifikat** — Proteksi berbasis React state (`useState`). NIK pada hint tabel ditampilkan dalam bentuk tersamarkan (`1234••••••••3456`) dan disembunyikan di balik toggle collapsible.

---

## Lisensi

Untuk keperluan internal dan demonstrasi. Tidak untuk distribusi publik.
