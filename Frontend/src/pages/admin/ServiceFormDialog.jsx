import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createService, updateService } from '../../api/services'
import { useDialog } from '../../components/useDialog'

const MAX_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

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

// service = null -> tambah layanan baru; service = objek -> ubah layanan
export default function ServiceFormDialog({ service, placement = 'page', onClose, onSaved }) {
  const isEdit = Boolean(service)
  const ref = useRef(null)
  const objectUrl = useRef(null)

  const [title, setTitle] = useState(service?.title ?? '')
  const [text, setText] = useState(service?.text ?? '')
  const [sortOrder, setSortOrder] = useState(service ? String(service.sort_order) : '')
  const [isActive, setIsActive] = useState(service?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(service?.image_url ?? null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const requestClose = () => {
    if (!saving) onClose()
  }
  useDialog(ref, requestClose)

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    },
    [],
  )

  const clearError = (key) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const onPick = (e) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) return
    if (!ALLOWED_TYPES.includes(picked.type)) {
      setErrors((prev) => ({ ...prev, image: 'Format gambar harus JPG, PNG, atau WebP.' }))
      return
    }
    if (picked.size > MAX_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `Ukuran gambar maksimal ${MAX_MB} MB.` }))
      return
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    objectUrl.current = URL.createObjectURL(picked)
    setFile(picked)
    setPreview(objectUrl.current)
    clearError('image')
  }

  const validate = () => {
    const next = {}
    if (!title.trim()) next.title = 'Judul layanan wajib diisi.'
    if (!text.trim()) next.text = 'Keterangan wajib diisi.'
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return

    const found = validate()
    setErrors(found)
    setFormError('')
    const firstKey = ['image', 'title', 'text'].find((k) => found[k])
    if (firstKey) {
      document.getElementById(`service-${firstKey}`)?.focus()
      return
    }

    const fd = new FormData()
    fd.append('title', title.trim())
    fd.append('text', text.trim())
    fd.append('is_active', isActive ? '1' : '0')
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)

    setSaving(true)
    try {
      const saved = isEdit ? await updateService(service.id, fd) : await createService(fd, placement)
      onSaved(saved, isEdit)
    } catch (err) {
      if (err.errors) {
        const mapped = {}
        Object.entries(err.errors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(mapped)
        if (mapped.image) document.getElementById('service-image')?.focus()
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
        aria-labelledby="service-dialog-title"
        className="relative my-4 w-full max-w-5xl rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="service-dialog-title" className="text-lg font-bold text-gray-900">
            {isEdit ? 'Ubah layanan' : 'Tambah layanan'}
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

        <form onSubmit={submit} noValidate className="px-6 py-6">
          {formError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <span id="service-image-label" className="mb-1.5 block text-sm font-medium text-gray-800">
              Gambar <span className="ml-1.5 text-xs font-normal text-gray-500">(opsional — kosongkan untuk pakai gambar dummy)</span>
            </span>
            <div className="overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div className="flex aspect-[3/2] items-center justify-center bg-gray-100">
                {preview ? (
                  <img src={preview} alt="Pratinjau gambar layanan" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <PhotoIcon className="h-10 w-10" aria-hidden="true" />
                    <span className="text-sm">Belum ada gambar — akan memakai gambar dummy</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 bg-white px-4 py-3">
                <input
                  id="service-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onPick}
                  aria-labelledby="service-image-label"
                  aria-describedby={errors.image ? 'service-image-error' : 'service-image-hint'}
                  aria-invalid={Boolean(errors.image)}
                  className="peer sr-only"
                />
                <label
                  htmlFor="service-image"
                  className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-brand hover:text-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
                >
                  {preview ? 'Ganti gambar' : 'Pilih gambar'}
                </label>
                <span className="min-w-0 truncate text-xs text-gray-600">{file ? file.name : ''}</span>
              </div>
            </div>
            {errors.image ? (
              <p id="service-image-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.image}</p>
            ) : (
              <p id="service-image-hint" className="mt-1.5 text-xs text-gray-500">JPG, PNG, atau WebP. Maksimal {MAX_MB} MB.</p>
            )}
            </div>

            <div className="space-y-5">
              <Field id="service-title" label="Judul layanan" error={errors.title}>
            <input
              id="service-title"
              data-autofocus
              className={inputClass(errors.title)}
              value={title}
              maxLength={120}
              onChange={(e) => {
                setTitle(e.target.value)
                clearError('title')
              }}
              disabled={saving}
            />
          </Field>

          <Field id="service-text" label="Keterangan" error={errors.text}>
            <textarea
              id="service-text"
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
            <Field id="service-sort_order" label="Urutan tampil" optional hint="Angka kecil tampil lebih dulu. Kosongkan untuk menaruh di akhir.">
              <input
                id="service-sort_order"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
