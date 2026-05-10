export type TowerStatus = "normal" | "waspada" | "gangguan" | "maintenance";
export type KerawananLevel = "aman" | "sedang" | "kritis";

export interface Tower {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  midspan: string;
  tegangan: string;
  tahun: number;
  kondisi: TowerStatus;
  kerawanan: KerawananLevel;
  petir: string;
  lastMaint: string;
  lokasi: string;
  // kepemilikan
  pemilik: string;
  unit: string;
  jalur: string;
  giAsal: string;
  giTujuan: string;
}

export const towers: Tower[] = [
  { id: "T-104", nama: "Tower Serpong", lat: -6.2888, lng: 106.6102, midspan: "-6.2910, 106.5870", tegangan: "150 kV", tahun: 2005, kondisi: "normal", kerawanan: "aman", petir: "5x", lastMaint: "10 Apr 2025", lokasi: "Serpong, Tangerang Selatan", pemilik: "PT PLN (Persero)", unit: "UP3 Tangerang", jalur: "SUTT 150 kV Serpong–Cisauk", giAsal: "GI Serpong", giTujuan: "GI Cisauk" },
  { id: "T-091", nama: "Tower Legok Selatan", lat: -6.2598, lng: 106.5340, midspan: "-6.2610, 106.5090", tegangan: "500 kV", tahun: 2001, kondisi: "waspada", kerawanan: "kritis", petir: "6x", lastMaint: "18 Apr 2025", lokasi: "Legok, Tangerang", pemilik: "PT PLN (Persero)", unit: "UPT Banten", jalur: "SUTET 500 kV Cibinong–Balaraja", giAsal: "GIB Cibinong", giTujuan: "GIB Balaraja" },
  { id: "T-117", nama: "Tower Cikupa–Balaraja", lat: -6.2301, lng: 106.5018, midspan: "-6.2245, 106.4780", tegangan: "500 kV", tahun: 1998, kondisi: "gangguan", kerawanan: "kritis", petir: "8x", lastMaint: "28 Apr 2025", lokasi: "Cikupa, Tangerang", pemilik: "PT PLN (Persero)", unit: "UPT Banten", jalur: "SUTET 500 kV Cikupa–Balaraja", giAsal: "GIB Cikupa", giTujuan: "GIB Balaraja" },
  { id: "T-055", nama: "Tower Balaraja Barat", lat: -6.1820, lng: 106.4520, midspan: "-6.1750, 106.4380", tegangan: "150 kV", tahun: 2009, kondisi: "maintenance", kerawanan: "sedang", petir: "3x", lastMaint: "26 Apr 2025", lokasi: "Balaraja, Tangerang", pemilik: "PT PLN (Persero)", unit: "UP3 Banten", jalur: "SUTT 150 kV Balaraja–Tigaraksa", giAsal: "GI Balaraja", giTujuan: "GI Tigaraksa" },
  { id: "T-208", nama: "Tower Parung", lat: -6.3810, lng: 106.3940, midspan: "-6.3870, 106.3720", tegangan: "500 kV", tahun: 2003, kondisi: "normal", kerawanan: "aman", petir: "1x", lastMaint: "10 Mar 2025", lokasi: "Parung Panjang, Bogor", pemilik: "PT PLN (Persero)", unit: "UPT Banten", jalur: "SUTET 500 kV Parung–Cibinong", giAsal: "GIB Parung", giTujuan: "GIB Cibinong" },
  { id: "T-023", nama: "Tower Tigaraksa A", lat: -6.3120, lng: 106.4677, midspan: "-6.3180, 106.4510", tegangan: "150 kV", tahun: 2007, kondisi: "waspada", kerawanan: "sedang", petir: "2x", lastMaint: "22 Apr 2025", lokasi: "Tigaraksa, Tangerang", pemilik: "PT PLN (Persero)", unit: "UP3 Banten", jalur: "SUTT 150 kV Tigaraksa–Balaraja", giAsal: "GI Tigaraksa", giTujuan: "GI Balaraja" },
  { id: "T-178", nama: "Tower Rajeg Utara", lat: -6.1544, lng: 106.6101, midspan: "-6.1610, 106.5920", tegangan: "150 kV", tahun: 2008, kondisi: "normal", kerawanan: "aman", petir: "3x", lastMaint: "19 Apr 2025", lokasi: "Rajeg, Tangerang", pemilik: "PT PLN (Persero)", unit: "UP3 Tangerang", jalur: "SUTT 150 kV Rajeg–Balaraja", giAsal: "GI Rajeg", giTujuan: "GI Balaraja" },
];

export interface GangguanHistory {
  id: string;
  towerId: string;
  towerNama: string;
  tanggal: string;
  jenis: string;
  durasi: string;
  status: "resolved" | "ongoing" | "investigating";
  petugas: string;
}

export const gangguanHistory: GangguanHistory[] = [
  { id: "GNG-001", towerId: "T-117", towerNama: "Tower Cikupa–Balaraja", tanggal: "28 Apr 2025 07:42", jenis: "Sambaran Petir", durasi: "Ongoing", status: "ongoing", petugas: "Tim PLN Cikupa" },
  { id: "GNG-002", towerId: "T-091", towerNama: "Tower Legok Selatan", tanggal: "25 Apr 2025 14:18", jenis: "Overheating Konduktor", durasi: "3j 22m", status: "resolved", petugas: "Budi Santoso" },
  { id: "GNG-003", towerId: "T-055", towerNama: "Tower Balaraja Barat", tanggal: "22 Apr 2025 09:05", jenis: "Maintenance Preventif", durasi: "8j 00m", status: "resolved", petugas: "Ahmad Fauzi" },
  { id: "GNG-004", towerId: "T-104", towerNama: "Tower Serpong", tanggal: "15 Apr 2025 11:30", jenis: "Getaran Angin", durasi: "1j 45m", status: "resolved", petugas: "Siti Rahayu" },
  { id: "GNG-005", towerId: "T-023", towerNama: "Tower Tigaraksa A", tanggal: "10 Apr 2025 16:00", jenis: "Gangguan Isolator", durasi: "Investigasi", status: "investigating", petugas: "Tim PLN Tigaraksa" },
  { id: "GNG-006", towerId: "T-208", towerNama: "Tower Parung", tanggal: "02 Mar 2025 08:15", jenis: "Inspeksi Rutin", durasi: "4j 00m", status: "resolved", petugas: "Ahmad Fauzi" },
];

export interface PetirHistory {
  id: string;
  towerId: string;
  towerNama: string;
  tanggal: string;
  intensitas: "aman" | "sedang" | "kritis";
  amplitudo: string;
  zona: string;
}

export const petirHistory: PetirHistory[] = [
  { id: "PTR-001", towerId: "T-117", towerNama: "Tower Cikupa–Balaraja", tanggal: "28 Apr 2025 07:40", intensitas: "kritis", amplitudo: "82 kA", zona: "Zona Barat" },
  { id: "PTR-002", towerId: "T-117", towerNama: "Tower Cikupa–Balaraja", tanggal: "20 Apr 2025 15:22", intensitas: "kritis", amplitudo: "74 kA", zona: "Zona Barat" },
  { id: "PTR-003", towerId: "T-091", towerNama: "Tower Legok Selatan", tanggal: "18 Apr 2025 13:05", intensitas: "sedang", amplitudo: "51 kA", zona: "Zona Tengah" },
  { id: "PTR-004", towerId: "T-104", towerNama: "Tower Serpong", tanggal: "15 Apr 2025 11:00", intensitas: "aman", amplitudo: "28 kA", zona: "Zona Timur" },
  { id: "PTR-005", towerId: "T-023", towerNama: "Tower Tigaraksa A", tanggal: "12 Apr 2025 09:30", intensitas: "aman", amplitudo: "19 kA", zona: "Zona Tengah" },
  { id: "PTR-006", towerId: "T-178", towerNama: "Tower Rajeg Utara", tanggal: "10 Apr 2025 17:45", intensitas: "aman", amplitudo: "22 kA", zona: "Zona Timur" },
  { id: "PTR-007", towerId: "T-055", towerNama: "Tower Balaraja Barat", tanggal: "05 Apr 2025 14:20", intensitas: "sedang", amplitudo: "43 kA", zona: "Zona Barat" },
  { id: "PTR-008", towerId: "T-208", towerNama: "Tower Parung", tanggal: "01 Mar 2025 10:10", intensitas: "aman", amplitudo: "15 kA", zona: "Zona Selatan" },
];

export const petirPerZona = [
  { zona: "Zona Barat", count: 11 },
  { zona: "Zona Tengah", count: 8 },
  { zona: "Zona Timur", count: 8 },
  { zona: "Zona Selatan", count: 1 },
];

export interface PergantianKomponen {
  id: string;
  towerId: string;
  towerNama: string;
  tanggal: string;
  komponen: string;
  alasan: string;
  petugas: string;
  biaya: string;
}

export const pergantianKomponen: PergantianKomponen[] = [
  { id: "PRG-001", towerId: "T-117", towerNama: "Tower Cikupa–Balaraja", tanggal: "28 Apr 2025", komponen: "Arrester Petir", alasan: "Kerusakan akibat sambaran", petugas: "Tim PLN Cikupa", biaya: "Rp 4.500.000" },
  { id: "PRG-002", towerId: "T-055", towerNama: "Tower Balaraja Barat", tanggal: "26 Apr 2025", komponen: "Isolator String", alasan: "Maintenance preventif", petugas: "Ahmad Fauzi", biaya: "Rp 2.100.000" },
  { id: "PRG-003", towerId: "T-091", towerNama: "Tower Legok Selatan", tanggal: "18 Apr 2025", komponen: "Konduktor Kawat", alasan: "Overheat", petugas: "Budi Santoso", biaya: "Rp 8.750.000" },
  { id: "PRG-004", towerId: "T-104", towerNama: "Tower Serpong", tanggal: "10 Apr 2025", komponen: "Grounding Rod", alasan: "Korosi", petugas: "Siti Rahayu", biaya: "Rp 950.000" },
  { id: "PRG-005", towerId: "T-023", towerNama: "Tower Tigaraksa A", tanggal: "22 Apr 2025", komponen: "Isolator Suspension", alasan: "Crack terdeteksi", petugas: "Tim PLN Tigaraksa", biaya: "Rp 1.800.000" },
  { id: "PRG-006", towerId: "T-208", towerNama: "Tower Parung", tanggal: "10 Mar 2025", komponen: "Baut Pondasi", alasan: "Inspeksi rutin", petugas: "Ahmad Fauzi", biaya: "Rp 320.000" },
];

export interface Sertifikat {
  id: string;
  towerId: string;
  towerNama: string;
  jenis: string;
  tanggalTerbit: string;
  tanggalExpiry: string;
  status: "valid" | "expiring" | "expired";
  penerbit: string;
}

export const sertifikat: Sertifikat[] = [
  { id: "SRT-2025-001", towerId: "T-104", towerNama: "Tower Serpong", jenis: "Sertifikat Laik Operasi", tanggalTerbit: "10 Jan 2025", tanggalExpiry: "10 Jan 2026", status: "valid", penerbit: "PLN UIW Banten" },
  { id: "SRT-2025-002", towerId: "T-091", towerNama: "Tower Legok Selatan", jenis: "Sertifikat Inspeksi K3", tanggalTerbit: "18 Feb 2025", tanggalExpiry: "18 Aug 2025", status: "expiring", penerbit: "PLN UP3 Tangerang" },
  { id: "SRT-2025-003", towerId: "T-117", towerNama: "Tower Cikupa–Balaraja", jenis: "Sertifikat Laik Operasi", tanggalTerbit: "05 Mar 2024", tanggalExpiry: "05 Mar 2025", status: "expired", penerbit: "PLN UIW Banten" },
  { id: "SRT-2025-004", towerId: "T-055", towerNama: "Tower Balaraja Barat", jenis: "Sertifikat Grounding", tanggalTerbit: "26 Apr 2025", tanggalExpiry: "26 Apr 2026", status: "valid", penerbit: "PLN UP3 Banten" },
  { id: "SRT-2025-005", towerId: "T-208", towerNama: "Tower Parung", jenis: "Sertifikat Laik Operasi", tanggalTerbit: "10 Mar 2025", tanggalExpiry: "10 Mar 2026", status: "valid", penerbit: "PLN UP3 Bogor" },
  { id: "SRT-2025-006", towerId: "T-023", towerNama: "Tower Tigaraksa A", jenis: "Sertifikat Inspeksi K3", tanggalTerbit: "22 Apr 2025", tanggalExpiry: "22 Oct 2025", status: "expiring", penerbit: "PLN UP3 Tangerang" },
  { id: "SRT-2025-007", towerId: "T-178", towerNama: "Tower Rajeg Utara", jenis: "Sertifikat Laik Operasi", tanggalTerbit: "19 Apr 2025", tanggalExpiry: "19 Apr 2026", status: "valid", penerbit: "PLN UP3 Tangerang" },
];

export interface Pegawai {
  nik: string;
  nama: string;
  jabatan: string;
  unit: string;
}

export const pegawaiList: Pegawai[] = [
  { nik: "1234567890123456", nama: "Budi Santoso", jabatan: "Supervisor Transmisi", unit: "UP3 Banten" },
  { nik: "9876543210987654", nama: "Siti Rahayu", jabatan: "Teknisi Senior", unit: "UP3 Tangerang" },
  { nik: "1122334455667788", nama: "Ahmad Fauzi", jabatan: "Manajer Aset", unit: "UIW Banten" },
];

export const kodeAkses = ["PLN2025", "SITOWER", "ADMIN123"];

export interface ActivityItem {
  id: string;
  waktu: string;
  tipe: "gangguan" | "petir" | "maintenance" | "update";
  deskripsi: string;
  tower: string;
}

export const recentActivity: ActivityItem[] = [
  { id: "1", waktu: "07:42", tipe: "gangguan", deskripsi: "Gangguan sambaran petir terdeteksi", tower: "T-117" },
  { id: "2", waktu: "06:15", tipe: "petir", deskripsi: "Sambaran petir 82 kA tercatat", tower: "T-117" },
  { id: "3", waktu: "Kemarin 18:30", tipe: "maintenance", deskripsi: "Maintenance selesai, tower kembali normal", tower: "T-055" },
  { id: "4", waktu: "Kemarin 14:18", tipe: "gangguan", deskripsi: "Overheating konduktor terselesaikan", tower: "T-091" },
  { id: "5", waktu: "25 Apr 09:00", tipe: "update", deskripsi: "Data inspeksi diperbarui", tower: "T-104" },
];
