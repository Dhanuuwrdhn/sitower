interface Props {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Belum ada data.',
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
      {/* Illustration — matches Figma 150:2853 */}
      <svg width="160" height="110" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5">
        {/* Cloud base / ellipse background */}
        <ellipse cx="80" cy="82" rx="68" ry="22" fill="#E8EDF2" />

        {/* Left cloud puff */}
        <ellipse cx="28" cy="62" rx="14" ry="10" fill="#DDE4EC" />
        <ellipse cx="18" cy="66" rx="10" ry="8" fill="#DDE4EC" />
        <ellipse cx="38" cy="66" rx="10" ry="8" fill="#DDE4EC" />

        {/* Right cloud puff */}
        <ellipse cx="132" cy="62" rx="14" ry="10" fill="#DDE4EC" />
        <ellipse cx="122" cy="66" rx="10" ry="8" fill="#DDE4EC" />
        <ellipse cx="142" cy="66" rx="10" ry="8" fill="#DDE4EC" />

        {/* Center cloud puff (behind folder) */}
        <ellipse cx="80" cy="58" rx="30" ry="18" fill="#E8EDF2" />

        {/* Folder body */}
        <rect x="52" y="46" width="56" height="40" rx="4" fill="#8896A7" />
        {/* Folder tab */}
        <path d="M52 46 Q52 42 56 42 L72 42 L76 46 Z" fill="#9DAAB8" />
        {/* Folder inner highlight stripe */}
        <rect x="60" y="68" width="32" height="4" rx="2" fill="#6B7A8D" opacity="0.5" />
        <rect x="60" y="76" width="20" height="4" rx="2" fill="#6B7A8D" opacity="0.5" />

        {/* Left search magnifier */}
        <circle cx="36" cy="56" r="9" stroke="#8896A7" strokeWidth="2.5" fill="white" fillOpacity="0.8" />
        <line x1="43" y1="63" x2="48" y2="68" stroke="#8896A7" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right search magnifier */}
        <circle cx="122" cy="56" r="9" stroke="#8896A7" strokeWidth="2.5" fill="white" fillOpacity="0.8" />
        <line x1="129" y1="63" x2="134" y2="68" stroke="#8896A7" strokeWidth="2.5" strokeLinecap="round" />

        {/* Question mark bubble */}
        <circle cx="92" cy="30" r="12" fill="white" stroke="#DDE4EC" strokeWidth="1.5" />
        <text x="92" y="35" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8896A7" fontFamily="Inter, sans-serif">?</text>

        {/* Small cloud top-left */}
        <ellipse cx="50" cy="36" rx="8" ry="5.5" fill="#DDE4EC" />
        <ellipse cx="44" cy="39" rx="6" ry="4.5" fill="#DDE4EC" />
        <ellipse cx="56" cy="39" rx="6" ry="4.5" fill="#DDE4EC" />
      </svg>

      <p className="text-[15px] font-bold text-[#1C1C1C]">{title}</p>
      {description && (
        <p className="text-[13px] text-[#97AAB3] mt-1 max-w-xs">{description}</p>
      )}
    </div>
  )
}
