import { useEffect, useState } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { MAX_QTY, clampQty } from '../data/cartStore'

// Pengatur jumlah: tombol - dan +, atau ketik angka langsung (mis. 5).
export default function QtyStepper({ value, onChange, label = 'Jumlah', compact = false }) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => { setDraft(String(value)) }, [value])

  const commit = () => {
    const next = draft === '' ? value : clampQty(draft)
    setDraft(String(next))
    if (next !== value) onChange(next)
  }
  const btn = `flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand ${compact ? 'h-8 w-8' : 'h-10 w-10'}`

  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-full border border-gray-300 bg-white">
      <button type="button" aria-label="Kurangi jumlah" className={btn} disabled={value <= 1} onClick={() => onChange(clampQty(value - 1))}>
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        aria-label={label}
        inputMode="numeric"
        value={draft}
        maxLength={String(MAX_QTY).length}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); e.currentTarget.blur() } }}
        className={`border-x border-gray-200 text-center text-sm font-semibold text-gray-900 focus:outline-none ${compact ? 'h-8 w-10' : 'h-10 w-14'}`}
      />
      <button type="button" aria-label="Tambah jumlah" className={btn} disabled={value >= MAX_QTY} onClick={() => onChange(clampQty(value + 1))}>
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
