import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createHero, updateHero } from '../../api/heroes'
import { useDialog } from '../../components/useDialog'

const MAX_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const inputBase =
  'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-2 focus:outline-brand disabled:bg-gray-100'
const inputClass = (invalid) => `${inputBase} ${invalid ? 'border-red-400' : 'border-gray-300'}`

const isValidLink = (v) => (v.startsWith('/') && !v.startsWith('//')) || /^https?:\/\/\S+$/i.test(v)

function Field({ id, label, optional = false, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-800">
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-gray-500">(opsional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  )
}

// hero = null -> tambah slide baru; hero = objek -> ubah slide
export default function HeroFormDialog({ hero, onClose, onSaved }) {
  const isEdit = Boolean(hero)
  const ref = useRef(null)
  const objectUrl = useRef(null)

  const [title, setTitle] = useState(hero?.title ?? '')
  const [subtitle, setSubtitle] = useState(hero?.subtitle ?? '')
  const [ctaLabel, setCtaLabel] = useState(hero?.cta_label ?? '')
  const [ctaUrl, setCtaUrl] = useState(hero?.cta_url ?? '')
  const [sortOrder, setSortOrder] = useState(hero ? String(hero.sort_order) : '')
  const [isActive, setIsActive] = useState(hero?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(hero?.image_url ?? null)
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
    e.target.value = '' // agar file yang sama bisa dipilih ulang
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
    if (!title.trim()) next.title = 'Judul wajib diisi.'
    if (!isEdit && !file) next.image = 'Gambar wajib diunggah.'
    const label = ctaLabel.trim()
    const url = ctaUrl.trim()
    if (label && !url) next.cta_url = 'Link tombol wajib diisi jika teks tombol diisi.'
    if (url && !label) next.cta_label = 'Teks tombol wajib diisi jika link tombol diisi.'
    if (url && !isValidLink(url)) next.cta_url = 'Link harus diawali "/" (halaman di website ini) atau "https://".'
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return

    const found = validate()
    setErrors(found)
    setFormError('')
    const firstKey = ['image', 'title', 'cta_label', 'cta_url'].find((k) => found[k])
    if (firstKey) {
      document.getElementById(`hero-${firstKey}`)?.focus()
      return
    }

    const fd = new FormData()
    fd.append('title', title.trim())
    fd.append('subtitle', subtitle.trim())
    fd.append('cta_label', ctaLabel.trim())
    fd.append('cta_url', ctaUrl.trim())
    fd.append('is_active', isActive ? '1' : '0')
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)

    setSaving(true)
    try {
      const saved = isEdit ? await updateHero(hero.id, fd) : await createHero(fd)
      onSaved(saved, isEdit)
    } catch (err) {
      if (err.errors) {
        const mapped = {}
        Object.entries(err.errors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(mapped)
        if (mapped.image) document.getElementById('hero-image')?.focus()
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
        aria-labelledby="hero-dialog-title"
        className="relative my-4 w-full max-w-5xl rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="hero-dialog-title" className="text-lg font-bold text-gray-900">
            {isEdit ? 'Ubah slide hero' : 'Tambah slide hero'}
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
            {/* Gambar */}
            <div>
            <span id="hero-image-label" className="mb-1.5 block text-sm font-medium text-gray-800">
              Gambar
              {isEdit && <span className="ml-1.5 text-xs font-normal text-gray-500">(kosongkan jika tidak diganti)</span>}
            </span>
            <div className="overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <div className="flex aspect-video items-center justify-center bg-gray-100">
                {preview ? (
                  <img src={preview} alt="Pratinjau gambar slide" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <PhotoIcon className="h-10 w-10" aria-hidden="true" />
                    <span className="text-sm">Belum ada gambar dipilih</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 bg-white px-4 py-3">
                <input
                  id="hero-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onPick}
                  aria-labelledby="hero-image-label"
                  aria-describedby={errors.image ? 'hero-image-error' : 'hero-image-hint'}
                  aria-invalid={Boolean(errors.image)}
                  className="peer sr-only"
                />
                <label
                  htmlFor="hero-image"
                  className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-brand hover:text-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
                >
                  {preview ? 'Ganti gambar' : 'Pilih gambar'}
                </label>
                <span className="min-w-0 truncate text-xs text-gray-600">{file ? file.name : isEdit ? 'Memakai gambar saat ini' : ''}</span>
              </div>
            </div>
            {errors.image ? (
              <p id="hero-image-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.image}</p>
            ) : (
              <p id="hero-image-hint" className="mt-1.5 text-xs text-gray-500">
                JPG, PNG, atau WebP. Maksimal {MAX_MB} MB. Disarankan lebar, misalnya 1600 × 900 px.
              </p>
            )}
            </div>

            <div className="space-y-5">
              <Field id="hero-title" label="Judul" error={errors.title}>
            <input
              id="hero-title"
              data-autofocus
              className={inputClass(errors.title)}
              value={title}
              maxLength={120}
              onChange={(e) => {
                setTitle(e.target.value)
                clearError('title')
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'hero-title-error' : undefined}
              disabled={saving}
            />
          </Field>

          <Field id="hero-subtitle" label="Subjudul" optional error={errors.subtitle}>
            <textarea
              id="hero-subtitle"
              rows={3}
              className={inputClass(errors.subtitle)}
              value={subtitle}
              maxLength={400}
              onChange={(e) => {
                setSubtitle(e.target.value)
                clearError('subtitle')
              }}
              aria-invalid={Boolean(errors.subtitle)}
              aria-describedby={errors.subtitle ? 'hero-subtitle-error' : undefined}
              disabled={saving}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="hero-cta_label" label="Teks tombol" optional error={errors.cta_label} hint="Contoh: Pesan Sekarang">
              <input
                id="hero-cta_label"
                className={inputClass(errors.cta_label)}
                value={ctaLabel}
                maxLength={40}
                onChange={(e) => {
                  setCtaLabel(e.target.value)
                  clearError('cta_label')
                  clearError('cta_url')
                }}
                aria-invalid={Boolean(errors.cta_label)}
                aria-describedby={errors.cta_label ? 'hero-cta_label-error' : 'hero-cta_label-hint'}
                disabled={saving}
              />
            </Field>
            <Field id="hero-cta_url" label="Link tombol" optional error={errors.cta_url} hint="Contoh: /pesan-sekarang atau https://…">
              <input
                id="hero-cta_url"
                className={inputClass(errors.cta_url)}
                value={ctaUrl}
                maxLength={255}
                onChange={(e) => {
                  setCtaUrl(e.target.value)
                  clearError('cta_url')
                  clearError('cta_label')
                }}
                aria-invalid={Boolean(errors.cta_url)}
                aria-describedby={errors.cta_url ? 'hero-cta_url-error' : 'hero-cta_url-hint'}
                disabled={saving}
              />
            </Field>
          </div>

          <div className="grid items-end gap-5 sm:grid-cols-2">
            <Field
              id="hero-sort_order"
              label="Urutan tampil"
              optional
              error={errors.sort_order}
              hint="Angka kecil tampil lebih dulu. Kosongkan untuk menaruh di akhir."
            >
              <input
                id="hero-sort_order"
                type="number"
                min="0"
                max="65535"
                inputMode="numeric"
                className={inputClass(errors.sort_order)}
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value)
                  clearError('sort_order')
                }}
                aria-invalid={Boolean(errors.sort_order)}
                aria-describedby={errors.sort_order ? 'hero-sort_order-error' : 'hero-sort_order-hint'}
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
