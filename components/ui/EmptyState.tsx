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
      {/* Illustration — Figma 150:2880 */}
      <img
        src="/empty-state-illustration.svg"
        alt=""
        width={201}
        height={107}
        className="mb-5"
        draggable={false}
      />
      <p className="text-[15px] font-bold text-[#1C1C1C]">{title}</p>
      {description && (
        <p className="text-[13px] text-[#97AAB3] mt-1 max-w-xs">{description}</p>
      )}
    </div>
  )
}
