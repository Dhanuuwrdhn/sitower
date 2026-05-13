// Maps both laporan status and tower kondisi to CSS badge classes
const MAP: Record<string, string> = {
  // Laporan status
  berlangsung: 'badge-berlangsung badge-blink',
  ditangani:   'badge-ditangani',
  selesai:     'badge-selesai',
  pemantauan:  'badge-pemantauan',
  eskalasi:    'badge-eskalasi',
  menunggu:    'badge-menunggu',
  // Tower kondisi
  normal:      'badge-selesai',
  waspada:     'badge-ditangani',
  gangguan:    'badge-berlangsung badge-blink',
  maintenance: 'badge-pemantauan',
  // Kerawanan level
  kritis:      'badge-berlangsung badge-blink',
  aman:        'badge-selesai',
  // Sertifikat
  valid:       'badge-selesai',
  expired:     'badge-berlangsung',
  // User
  aktif:       'badge-selesai',
  nonaktif:    'badge-menunggu',
}

export function StatusBadge({ status, text }: { status: string; text?: string }) {
  const key = status?.toLowerCase?.() ?? ''
  const cls = MAP[key] ?? 'badge-menunggu'
  const displayText = text ?? (status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '')
  return <span className={cls}>{displayText}</span>
}
