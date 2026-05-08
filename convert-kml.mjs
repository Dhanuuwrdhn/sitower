import fs from 'fs'

const inputFile = process.argv[2]
const outputFile = process.argv[3] || 'output-geodata.ts'

if (!inputFile) {
  console.error('❌ Harap masukkan nama file KML.\nCara pakai: node convert-kml.mjs <file-kml> [output-file]')
  process.exit(1)
}

const kmlData = fs.readFileSync(inputFile, 'utf-8')

const placemarks = kmlData.split('<Placemark>').slice(1).map(p => p.split('</Placemark>')[0])

const points = []
const lines = []

// Helper untuk mengonversi warna KML (AABBGGRR) ke Hex HTML (#RRGGBB)
function parseKmlColor(kmlColor) {
  if (!kmlColor || kmlColor.length !== 8) return '#94a3b8' // Fallback (abu-abu)
  // KML color format: aabbggrr (alpha, blue, green, red)
  const a = kmlColor.substring(0, 2)
  const b = kmlColor.substring(2, 4)
  const g = kmlColor.substring(4, 6)
  const r = kmlColor.substring(6, 8)
  return `#${r}${g}${b}` // Konversi ke RGB Hex biasa
}

for (const p of placemarks) {
  // Ambil nama
  const nameMatch = p.match(/<name>(.*?)<\/name>/)
  let name = nameMatch ? nameMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : 'Unnamed'

  // Cek apakah ini Point (Titik Tower/Gardu)
  if (p.includes('<Point>')) {
    const styleMatch = p.match(/<styleUrl>(.*?)<\/styleUrl>/)
    const style = styleMatch ? styleMatch[1].trim() : ''

    const coordMatch = p.match(/<coordinates>\s*(.*?)\s*<\/coordinates>/s)
    if (coordMatch) {
      const parts = coordMatch[1].trim().split(',')
      if (parts.length >= 2) {
        points.push({
          name: name.trim(),
          style: style,
          lng: parseFloat(parts[0]),
          lat: parseFloat(parts[1])
        })
      }
    }
  } 
  // Cek apakah ini LineString (Jalur Transmisi)
  else if (p.includes('<LineString>')) {
    // Ambil warna (jika ada)
    const colorMatch = p.match(/<color>(.*?)<\/color>/)
    const color = colorMatch ? parseKmlColor(colorMatch[1]) : '#94a3b8'

    const coordMatch = p.match(/<coordinates>\s*(.*?)\s*<\/coordinates>/s)
    if (coordMatch) {
      // Format coordinate KML garis: "lng,lat,alt lng,lat,alt ..."
      const rawCoords = coordMatch[1].trim().split(/\s+/)
      const path = []
      
      for (const raw of rawCoords) {
        const parts = raw.split(',')
        if (parts.length >= 2) {
          path.push({
            lng: parseFloat(parts[0]),
            lat: parseFloat(parts[1])
          })
        }
      }

      if (path.length > 0) {
        lines.push({
          name: name.trim(),
          type: 'other', // Default type (akan di-detect by name di UI map)
          color: color,
          path: path
        })
      }
    }
  }
}

// Format sebagai file TypeScript (geodata.ts)
const tsContent = `// Hasil auto-convert dari KML
export const newPoints = ${JSON.stringify(points, null, 2)};

export const newJalurTransmisi = ${JSON.stringify(lines, null, 2)};
`

fs.writeFileSync(outputFile, tsContent)
console.log(`✅ Berhasil! File tersimpan di: ${outputFile}`)
console.log(`📊 Ditemukan ${points.length} titik (tower) dan ${lines.length} jalur transmisi.`)
