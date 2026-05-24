'use client'

import dynamic from 'next/dynamic'
import type { FeaturedTower, JalurKmlItem } from './TowerMapGoogle'

// Pilih renderer map berdasarkan ketersediaan Google Maps API key (dievaluasi
// saat build, karena NEXT_PUBLIC_* di-inline oleh Next.js):
//   - key ada       → Google Maps (perilaku produksi saat ini)
//   - key tidak ada → Leaflet + Esri World Imagery (fallback otomatis tanpa biaya API)
//
// Jadi setelah Google API key dicabut & frontend di-rebuild, dashboard otomatis
// beralih ke Leaflet tanpa perlu ganti kode. Di staging, toggle dengan menambah/
// menghapus NEXT_PUBLIC_GOOGLE_MAPS_API_KEY di .env.local lalu rebuild.
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const hasGoogleKey = !!GOOGLE_KEY && GOOGLE_KEY !== 'YOUR_API_KEY_HERE'

const GoogleMap = dynamic(() => import('./TowerMapGoogle'), { ssr: false })
const LeafletMap = dynamic(() => import('./TowerMap'), { ssr: false })

interface Props {
  towers?: FeaturedTower[]
  onTowerClick?: (tower: FeaturedTower) => void
  jalurKml?: JalurKmlItem[]
}

export default function TowerMapView(props: Props) {
  return hasGoogleKey ? <GoogleMap {...props} /> : <LeafletMap {...props} />
}
