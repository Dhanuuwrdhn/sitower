import fs from 'fs'

const outputFile = 'lib/geodata.ts'
// Membaca file TS mentah yang di-generate sebelumnya dan mengekstrak array-nya
const raw = fs.readFileSync('output_geodata.ts', 'utf-8')
const pointsStr = raw.match(/export const newPoints = (\[.*?\]);/s)[1]
const jalurStr = raw.match(/export const newJalurTransmisi = (\[.*?\]);/s)[1]

const points = JSON.parse(pointsStr)
const lines = JSON.parse(jalurStr)

const garduInduk = []
const towerSUTET = []
const towerSUTT = []
const towerSKTT = []

for (const pt of points) {
  const name = pt.name.toUpperCase()
  // Di Google My Maps, icon "1548" (rumah/bangunan kotak) digunakan untuk Gardu Induk
  if ((pt.style && pt.style.includes('1548')) || name.includes('GI ') || name.includes('GIS ') || name.includes('GISTET ')) {
    garduInduk.push({ ...pt, type: 'gardu', style: '#icon-1548-000000' })
  } else if (name.includes('SUTET') || name.includes('500KV') || name.includes('500 KV')) {
    towerSUTET.push({ ...pt, type: 'SUTET_500kV', style: '#icon-1899-0288D1' })
  } else if (name.includes('SKTT') || name.includes('JOINT')) {
    towerSKTT.push({ ...pt, type: 'SKTT_150kV', style: '#icon-1899-0288D1' })
  } else {
    // Default to SUTT jika tower biasa
    towerSUTT.push({ ...pt, type: 'SUTT_150kV', style: '#icon-1899-0288D1' })
  }
}

const header = `// AUTO-GENERATED dari KML Jalur Transmisi UPT Durikosambi
// Total: ${garduInduk.length} Gardu Induk, ${towerSUTET.length} Tower SUTET 500kV, ${towerSUTT.length} Tower SUTT 150kV, ${towerSKTT.length} Tower SKTT, ${lines.length} Jalur

export interface GeoPoint {
  lat: number
  lng: number
}

export interface GarduInduk {
  name: string
  lat: number
  lng: number
  style?: string
  type: 'gardu'
}

export interface TowerPoint {
  name: string
  lat: number
  lng: number
  style?: string
  type: 'SUTET_500kV' | 'SUTT_150kV' | 'SKTT_150kV'
}

export interface JalurTransmisi {
  name: string
  type: 'SUTET_500kV' | 'SUTT_150kV' | 'SKTT_150kV' | 'other'
  color: string
  path: GeoPoint[]
}

// Warna per tipe jalur
export const JALUR_COLORS = {
  SUTET_500kV: '#e65100',  // oranye gelap
  SUTT_150kV:  '#0288d1',  // biru
  SKTT_150kV:  '#7c3aed',  // ungu
  other:       '#94a3b8',  // abu
}

// ${garduInduk.length} Gardu Induk
export const garduInduk: GarduInduk[] = ${JSON.stringify(garduInduk, null, 2)};

// ${towerSUTET.length} Tower SUTET
export const towerSUTET: TowerPoint[] = ${JSON.stringify(towerSUTET, null, 2)};

// ${towerSUTT.length} Tower SUTT
export const towerSUTT: TowerPoint[] = ${JSON.stringify(towerSUTT, null, 2)};

// ${towerSKTT.length} Tower SKTT
export const towerSKTT: TowerPoint[] = ${JSON.stringify(towerSKTT, null, 2)};

// ${lines.length} Jalur Transmisi
export const jalurTransmisi: JalurTransmisi[] = ${JSON.stringify(lines, null, 2)};
`

fs.writeFileSync(outputFile, header)
console.log('✅ File lib/geodata.ts berhasil diperbarui secara otomatis!')
