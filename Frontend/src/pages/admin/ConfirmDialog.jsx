import { useRef } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useDialog } from '../../components/useDialog'

export default function ConfirmDialog({ title, message, confirmLabel = 'Hapus', busy = false, error = '', onConfirm, onCancel }) {
  const ref = useRef(null)
  useDialog(ref, () => {
    if (!busy) onCancel()
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex gap-4">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red-100 text-red-600">
            <ExclamationTriangleIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold text-gray-900">{title}</h2>
            <p id="confirm-message" className="mt-2 break-words text-sm leading-6 text-gray-600">{message}</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            data-autofocus
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Menghapus…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
