'use client'

import { useEffect } from 'react'
import { ServerCrash, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[GlobalError]', error)
    }
  }, [error])

  const isStaging =
    typeof window !== 'undefined' &&
    window.location.hostname === 'staging.spektra.biz.id'

  return (
    <html lang="id">
      <body className="antialiased">
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-2xl bg-white px-7 py-8 shadow-2xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
              <ServerCrash size={28} className="text-indigo-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-slate-900">
              {isStaging ? 'Staging API offline' : 'Something went wrong'}
            </h1>
            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              {isStaging ? (
                <>
                  Staging API is currently unreachable. This is usually a manual
                  pause outside the scheduled 02:00 – 05:00 WIB maintenance window.
                  Please wait a moment, or contact the dev team if it persists.
                </>
              ) : (
                <>
                  The app hit an unexpected error. Try reloading the page; if the
                  problem keeps happening, contact the dev team.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
