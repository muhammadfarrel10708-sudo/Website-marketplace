import { useRef, useState } from 'react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createCompanyStat, updateCompanyStat } from '../../api/companyStats'
import { useDialog } from '../../components/useDialog'

const input = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand disabled:bg-gray-100'

export default function CompanyStatFormDialog({ stat, onClose, onSaved }) {
  const isEdit = Boolean(stat)
  const ref = useRef(null)
  const [value, setValue] = useState(stat?.value ?? '')
  const [label, setLabel] = useState(stat?.label ?? '')
  const [sortOrder, setSortOrder] = useState(stat ? String(stat.sort_order) : '')
  const [isActive, setIsActive] = useState(stat?.is_active ?? true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const close = () => { if (!saving) onClose() }
  useDialog(ref, close)

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const next = {}
    if (!value.trim()) next.value = 'Nilai wajib diisi.'
    if (!label.trim()) next.label = 'Label wajib diisi.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      const payload = {
        value: value.trim(),
        label: label.trim(),
        is_active: isActive,
        ...(sortOrder === '' ? {} : { sort_order: Number(sortOrder) }),
      }
      const saved = isEdit ? await updateCompanyStat(stat.id, payload) : await createCompanyStat(payload)
      onSaved(saved, isEdit)
    } catch (err) {
      if (err.errors) {
        const mapped = {}
        Object.entries(err.errors).forEach(([key, msgs]) => { mapped[key] = Array.isArray(msgs) ? msgs[0] : String(msgs) })
        setErrors(mapped)
      } else setFormError(err.message || 'Gagal menyimpan. Coba lagi.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="stat-dialog-title" className="relative my-4 w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="stat-dialog-title" className="text-lg font-bold text-gray-900">{isEdit ? 'Ubah statistik' : 'Tambah statistik'}</h2>
          <button type="button" aria-label="Tutup" onClick={close} disabled={saving} className="rounded-md p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"><XMarkIcon className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} noValidate className="space-y-5 px-6 py-6">
          {formError && <div role="alert" className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 flex-none" />{formError}</div>}
          <div>
            <label htmlFor="stat-value" className="mb-1.5 block text-sm font-medium text-gray-800">Nilai</label>
            <input id="stat-value" className={input} value={value} maxLength={80} onChange={(e) => setValue(e.target.value)} disabled={saving} />
            {errors.value && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.value}</p>}
          </div>
          <div>
            <label htmlFor="stat-label" className="mb-1.5 block text-sm font-medium text-gray-800">Label</label>
            <input id="stat-label" className={input} value={label} maxLength={120} onChange={(e) => setLabel(e.target.value)} disabled={saving} />
            {errors.label && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.label}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 sm:items-end">
            <div>
              <label htmlFor="stat-sort" className="mb-1.5 block text-sm font-medium text-gray-800">Urutan tampil <span className="text-xs font-normal text-gray-500">(opsional)</span></label>
              <input id="stat-sort" type="number" min="0" max="65535" className={input} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} disabled={saving} />
              <p className="mt-1.5 text-xs text-gray-500">Kosongkan untuk menaruh di akhir.</p>
            </div>
            <label className="flex items-center gap-2.5 pb-2.5 text-sm text-gray-800">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={saving} className="h-4 w-4 rounded border-gray-300 accent-[#2f42d6]" />
              Tampilkan di website
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button type="button" onClick={close} disabled={saving} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-800">Batal</button>
            <button type="submit" disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Menyimpan…' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
