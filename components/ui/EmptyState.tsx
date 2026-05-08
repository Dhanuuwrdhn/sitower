import { Inbox } from 'lucide-react'

interface Props {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Tidak ada data',
  description = 'Belum ada data yang sesuai dengan filter yang dipilih.',
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-app-bg flex items-center justify-center mb-4">
        <Inbox size={24} className="text-app-muted" />
      </div>
      <p className="text-[14px] font-semibold text-app-text mb-1">{title}</p>
      <p className="text-[12px] text-app-muted max-w-xs">{description}</p>
    </div>
  )
}
