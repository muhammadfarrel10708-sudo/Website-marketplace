import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createAdvantage, updateAdvantage } from '../../api/advantages'
import { useDialog } from '../../components/useDialog'

const icons = [
  ['shield', 'Perisai / kualitas'],
  ['money', 'Harga / pembayaran'],
  ['wrench', 'Garansi / perawatan'],
  ['clock', 'Waktu / ketepatan'],
]

const input = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand disabled:bg-gray-100'

export default function AdvantageFormDialog({ advantage, onClose, onSaved }) {
  const isEdit = Boolean(advantage)
  const ref = useRef(null)
  const [icon, setIcon] = useState(advantage?.icon ?? 'shield')
  const [title, setTitle] = useState(advantage?.title ?? '')
  const [description, setDescription] = useState(advantage?.description ?? '')
  const [sortOrder, setSortOrder] = useState(advantage ? String(advantage.sort_order) : '')
  const [isActive, setIsActive] = useState(advantage?.is_active ?? true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const close = () => { if (!saving) onClose() }
  useDialog(ref, close)

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const next = {}
    if (!title.trim()) next.title = 'Title wajib diisi.'
    if (!description.trim()) next.description = 'Deskripsi wajib diisi.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      const payload = {
        icon,
        title: title.trim(),
        description: description.trim(),
        is_active: isActive,
        ...(sortOrder === '' ? {} : { sort_order: Number(sortOrder) }),
      }
      const saved = isEdit ? await updateAdvantage(advantage.id, payload) : await createAdvantage(payload)
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
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="advantage-dialog-title" className="relative my-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="advantage-dialog-title" className="text-lg font-bold text-gray-900">{isEdit ? 'Ubah alasan memilih kami' : 'Tambah alasan memilih kami'}</h2>
          <button type="button" aria-label="Tutup" onClick={close} disabled={saving} className="rounded-md p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"><XMarkIcon className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} noValidate className="space-y-5 px-6 py-6">
          {formError && <div role="alert" className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 flex-none" />{formError}</div>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Icon</label>
            <select value={icon} onChange={(e) => setIcon(e.target.value)} disabled={saving} className={input}>
              {icons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="adv-title" className="mb-1.5 block text-sm font-medium text-gray-800">Title</label>
            <input id="adv-title" className={input} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} disabled={saving} />
            {errors.title && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="adv-description" className="mb-1.5 block text-sm font-medium text-gray-800">Deskripsi</label>
            <textarea id="adv-description" rows={4} className={input} value={description} maxLength={500} onChange={(e) => setDescription(e.target.value)} disabled={saving} />
            {errors.description && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.description}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 sm:items-end">
            <div>
              <label htmlFor="adv-sort" className="mb-1.5 block text-sm font-medium text-gray-800">Urutan tampil <span className="text-xs font-normal text-gray-500">(opsional)</span></label>
              <input id="adv-sort" type="number" min="0" max="65535" className={input} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} disabled={saving} />
              <p className="mt-1.5 text-xs text-gray-500">Kosongkan untuk menaruh di akhir.</p>
            </div>
            <label className="flex items-center gap-2.5 pb-2.5 text-sm text-gray-800">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={saving} className="h-4 w-4 rounded border-gray-300 accent-[var(--color-brand)]" />
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
