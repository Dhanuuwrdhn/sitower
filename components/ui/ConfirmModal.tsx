'use client'

import { AlertTriangle } from 'lucide-react'

interface Props {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  loading?: boolean
  confirmLabel?: string
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  danger = true,
  loading = false,
  confirmLabel = 'Konfirmasi',
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[380px]">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-50' : 'bg-blue-50'}`}>
          <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-blue-500'} />
        </div>
        <h3 className="text-[15px] font-bold text-app-text text-center">{title}</h3>
        <p className="text-[13px] text-app-muted text-center mt-2 mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1 justify-center">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer border-none ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-60`}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
