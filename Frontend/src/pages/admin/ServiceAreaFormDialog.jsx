import { useRef, useState } from 'react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createServiceArea, updateServiceArea } from '../../api/serviceAreas'
import { useDialog } from '../../components/useDialog'

const inputBase =
  'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-2 focus:outline-brand disabled:bg-gray-100'
const inputClass = (invalid) => `${inputBase} ${invalid ? 'border-red-400' : 'border-gray-300'}`

function Field({ id, label, optional = false, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-800">
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-gray-500">(opsional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      {error && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

// area = null -> tambah area baru; area = objek -> ubah area
export default function ServiceAreaFormDialog({ area, onClose, onSaved }) {
  const isEdit = Boolean(area)
  const ref = useRef(null)

  const [title, setTitle] = useState(area?.title ?? '')
  const [text, setText] = useState(area?.text ?? '')
  const [sortOrder, setSortOrder] = useState(area ? String(area.sort_order) : '')
  const [isActive, setIsActive] = useState(area?.is_active ?? true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const requestClose = () => {
    if (!saving) onClose()
  }
  useDialog(ref, requestClose)

  const clearError = (key) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const validate = () => {
    const next = {}
    if (!title.trim()) next.title = 'Judul area layanan wajib diisi.'
    if (!text.trim()) next.text = 'Keterangan wajib diisi.'
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return

    const found = validate()
    setErrors(found)
    setFormError('')
    const firstKey = ['title', 'text'].find((k) => found[k])
    if (firstKey) {
      document.getElementById(`area-${firstKey}`)?.focus()
      return
    }

    const payload = { title: title.trim(), text: text.trim(), is_active: isActive }
    if (sortOrder !== '') payload.sort_order = Number(sortOrder)

    setSaving(true)
    try {
      const saved = isEdit ? await updateServiceArea(area.id, payload) : await createServiceArea(payload)
      onSaved(saved, isEdit)
    } catch (err) {
      if (err.errors) {
        const mapped = {}
        Object.entries(err.errors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(mapped)
      } else {
        setFormError(err.message || 'Gagal menyimpan. Coba lagi.')
      }
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="area-dialog-title"
        className="relative my-4 w-full max-w-lg rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="area-dialog-title" className="text-lg font-bold text-gray-900">
            {isEdit ? 'Ubah area layanan' : 'Tambah area layanan'}
          </h2>
          <button
            type="button"
            aria-label="Tutup"
            onClick={requestClose}
            disabled={saving}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submit} noValidate className="space-y-5 px-6 py-6">
          {formError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}

          <Field id="area-title" label="Judul" error={errors.title}>
            <input
              id="area-title"
              data-autofocus
              className={inputClass(errors.title)}
              value={title}
              maxLength={120}
              onChange={(e) => {
                setTitle(e.target.value)
                clearError('title')
              }}
              placeholder="Contoh: Videotron Gereja"
              disabled={saving}
            />
          </Field>

          <Field id="area-text" label="Keterangan" error={errors.text}>
            <textarea
              id="area-text"
              rows={3}
              className={inputClass(errors.text)}
              value={text}
              maxLength={400}
              onChange={(e) => {
                setText(e.target.value)
                clearError('text')
              }}
              disabled={saving}
            />
          </Field>

          <div className="grid items-end gap-5 sm:grid-cols-2">
            <Field id="area-sort_order" label="Urutan tampil" optional hint="Angka kecil tampil lebih dulu. Kosongkan untuk menaruh di akhir.">
              <input
                id="area-sort_order"
                type="number"
                min="0"
                max="65535"
                inputMode="numeric"
                className={inputClass(false)}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                disabled={saving}
              />
            </Field>
            <label className="flex items-center gap-2.5 pb-2.5 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={saving}
                className="h-4 w-4 rounded border-gray-300 accent-[#2f42d6]"
              />
              Tampilkan di website
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={requestClose}
              disabled={saving}
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
