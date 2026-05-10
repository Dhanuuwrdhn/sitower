'use client'

interface Props {
  /** Full-page overlay mode (default false — inline/centered in container) */
  fullPage?: boolean
  /** Optional label below spinner */
  label?: string
}

export default function B2WLoader({ fullPage = false, label }: Props) {
  const inner = (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20,
    }}>
      {/* Logo + spinner ring */}
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        {/* Outer spinning ring */}
        <svg
          width="72" height="72"
          viewBox="0 0 72 72"
          style={{ position: 'absolute', inset: 0, animation: 'b2w-spin 1.1s linear infinite' }}
        >
          <circle
            cx="36" cy="36" r="31"
            fill="none"
            stroke="#E1E8EC"
            strokeWidth="4"
          />
          <circle
            cx="36" cy="36" r="31"
            fill="none"
            stroke="#076c9e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="48 148"
          />
        </svg>

        {/* Center: ⚡ icon */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, userSelect: 'none',
          animation: 'b2w-pulse 1.6s ease-in-out infinite',
        }}>
          ⚡
        </div>
      </div>

      {/* SPEKTRA wordmark */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 800, fontSize: 15,
          color: '#076c9e', letterSpacing: '0.1em',
          userSelect: 'none',
        }}>
          SPEKTRA
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500, fontSize: 11,
          color: '#97AAB3', marginTop: 2,
          letterSpacing: '0.05em',
          userSelect: 'none',
        }}>
          {label ?? 'Memuat data...'}
        </p>
      </div>

      {/* B2W badge */}
      <div style={{
        padding: '3px 10px', borderRadius: 99,
        background: 'rgba(7,108,158,0.07)',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700, fontSize: 10,
        color: '#076c9e', letterSpacing: '0.08em',
        userSelect: 'none',
      }}>
        Born2Works
      </div>

      <style>{`
        @keyframes b2w-spin  { to { transform: rotate(360deg); } }
        @keyframes b2w-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.88); } }
      `}</style>
    </div>
  )

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(246,249,252,0.92)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {inner}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', minHeight: 320,
    }}>
      {inner}
    </div>
  )
}
