import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, PhotoIcon, EyeIcon, XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createProduct, updateProduct } from '../../api/products'
import { useDialog } from '../../components/useDialog'

const MAX_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const emptyItem = () => ({ name: '', text: '' })

function WireImage({ className = '', wide = false }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gray-200 text-xs font-medium tracking-wide text-gray-500 ${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'} ${className}`}
    >
      IMAGE
    </div>
  )
}

function WireTitle({ children = 'TITLE/KALIMAT', className = '' }) {
  return (
    <div className={`flex min-h-8 items-center justify-center rounded-full bg-gray-200 px-3 py-1.5 text-center text-[10px] font-medium leading-tight text-gray-500 ${className}`}>
      <span className="break-words">{children}</span>
    </div>
  )
}

function VariantPreview({ variant, full = false }) {
  if (variant === 'card_2') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white ${full ? 'p-5 sm:p-6' : 'p-3'}`}>
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Layout Card 2</div>
        <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-4 sm:gap-5">
          <div className="min-w-0 space-y-3">
            <WireImage wide className="w-full" />
            <WireTitle>Judul / Kalimat</WireTitle>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <WireTitle key={i}>Title / Kalimat</WireTitle>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-gray-200 bg-white ${full ? 'p-5 sm:p-6' : 'p-3'}`}>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Layout Card 1</div>
      <div className="mx-auto max-w-[420px] space-y-3">
        <WireImage className="w-full" />
        <WireTitle>Judul / Kalimat</WireTitle>
      </div>
    </div>
  )
}

function VariantOption({ variant, selected, onSelect, onPreview }) {
  const label = variant === 'card_1' ? 'Card 1' : 'Card 2'
  return (
    <div className={`rounded-xl border bg-white p-3 transition ${selected ? 'border-brand ring-2 ring-brand/10' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between gap-3">
        <label className="flex min-w-0 cursor-pointer items-center gap-2 text-sm font-semibold text-gray-900">
          <input
            type="radio"
            name="product-layout"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 shrink-0 accent-[var(--color-brand)]"
          />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
        >
          <EyeIcon className="h-4 w-4" />
          Preview {variant === 'card_1' ? 'card 1' : 'card 2'}
        </button>
      </div>
    </div>
  )
}

export default function ProductFormDialog({ product, onClose, onSaved }) {
  const isEdit = Boolean(product)
  const ref = useRef(null)
  const objectUrl = useRef(null)
  const [title, setTitle] = useState(product?.title ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [variant, setVariant] = useState(product?.layout_variant ?? 'card_1')
  const [items, setItems] = useState(product?.items?.length ? product.items : [emptyItem()])
  const [sortOrder, setSortOrder] = useState(product ? String(product.sort_order) : '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(product?.image_url ?? null)
  const [previewVariant, setPreviewVariant] = useState(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useDialog(ref, () => { if (!saving) onClose() })
  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current) }, [])

  const pickImage = (e) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) return
    if (!ALLOWED_TYPES.includes(picked.type)) return setErrors((x) => ({ ...x, image: 'Format gambar harus JPG, PNG, atau WebP.' }))
    if (picked.size > MAX_MB * 1024 * 1024) return setErrors((x) => ({ ...x, image: `Ukuran gambar maksimal ${MAX_MB} MB.` }))
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    objectUrl.current = URL.createObjectURL(picked)
    setFile(picked)
    setPreview(objectUrl.current)
    setErrors((x) => ({ ...x, image: undefined }))
  }

  const setItem = (index, key, value) => setItems((current) => current.map((item, i) => i === index ? { ...item, [key]: value } : item))
  const addItem = () => setItems((current) => [...current, emptyItem()])
  const removeItem = (index) => setItems((current) => current.length === 1 ? current : current.filter((_, i) => i !== index))

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const next = {}
    if (!title.trim()) next.title = 'Nama produk wajib diisi.'
    if (items.some((item) => !item.name.trim())) next.items = 'Setiap item harus memiliki judul.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    const fd = new FormData()
    fd.append('title', title.trim())
    fd.append('description', description.trim())
    fd.append('layout_variant', variant)
    fd.append('items', JSON.stringify(items.map((x) => ({ name: x.name.trim(), text: x.text.trim() })).filter((x) => x.name || x.text)))
    fd.append('is_active', isActive ? '1' : '0')
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)

    setSaving(true)
    try {
      const saved = isEdit ? await updateProduct(product.id, fd) : await createProduct(fd)
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
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
      <div ref={ref} role="dialog" aria-modal="true" className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Ubah produk' : 'Tambah produk'}</h2>
            <p className="mt-1 text-xs text-gray-500">Pilih salah satu dari dua versi card untuk tampilan Produk Kami.</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-md p-2 text-gray-600 hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="max-h-[calc(100vh-8rem)] overflow-y-auto px-6 py-5">
          {formError && <div className="mb-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 shrink-0" />{formError}</div>}

          <div className="grid gap-5 lg:grid-cols-[minmax(250px,0.85fr)_minmax(0,1.15fr)]">
            <div className="space-y-4">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-gray-800">Gambar <span className="text-xs font-normal text-gray-500">(opsional — kosongkan untuk gambar dummy)</span></span>
                <div className="overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  <div className="flex aspect-video max-h-[260px] items-center justify-center bg-gray-100">
                    {preview ? <img src={preview} alt="Preview produk" className="h-full w-full object-cover" /> : <div className="flex flex-col items-center gap-2 text-gray-500"><PhotoIcon className="h-9 w-9" /><span className="text-sm">Belum ada gambar</span></div>}
                  </div>
                  <div className="border-t border-gray-200 bg-white px-4 py-3">
                    <input id="product-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="sr-only" />
                    <label htmlFor="product-image" className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">{preview ? 'Ganti gambar' : 'Pilih gambar'}</label>
                    {file && <span className="ml-3 text-xs text-gray-500">{file.name}</span>}
                  </div>
                </div>
                {errors.image && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.image}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">Urutan tampil</label><input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div>
                <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" /> Tampilkan di website</label>
              </div>
            </div>

            <div className="space-y-5">
              <div><label className="mb-1.5 block text-sm font-medium">Nama produk <span className="text-red-500">*</span></label><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" placeholder="Videotron Indoor" />{errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}</div>
              <div><label className="mb-1.5 block text-sm font-medium">Deskripsi <span className="text-xs font-normal text-gray-500">(opsional)</span></label><textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div>

              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-gray-900">Pilih versi card</h3>
                  <p className="mt-1 text-xs text-gray-500">Di form hanya tampil pilihan dan tombol preview. Layout lengkap dibuka lewat popup.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <VariantOption variant="card_1" selected={variant === 'card_1'} onSelect={() => setVariant('card_1')} onPreview={() => setPreviewVariant('card_1')} />
                  <VariantOption variant="card_2" selected={variant === 'card_2'} onSelect={() => setVariant('card_2')} onPreview={() => setPreviewVariant('card_2')} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-bold text-gray-900">Isi produk</h3><p className="mt-1 text-xs text-gray-500">Judul + keterangan yang tampil di dalam card.</p></div><button type="button" onClick={addItem} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"><PlusIcon className="h-4 w-4" /> Tambah item</button></div>
                <div className="mt-3 max-h-60 space-y-3 overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="grid gap-3 md:grid-cols-[0.7fr_1.3fr_auto] md:items-start"><input value={item.name} onChange={(e) => setItem(index, 'name', e.target.value)} placeholder="Judul / P1.25 Indoor" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" /><textarea rows={2} value={item.text} onChange={(e) => setItem(index, 'text', e.target.value)} placeholder="Keterangan singkat" className="resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" /><button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-30"><TrashIcon className="h-5 w-5" /></button></div>
                    </div>
                  ))}
                </div>
                {errors.items && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.items}</p>}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 pt-4"><button type="button" onClick={onClose} disabled={saving} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold">Batal</button><button type="submit" disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white">{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
        </form>

        {previewVariant && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Preview Card {previewVariant === 'card_1' ? '1' : '2'}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Wireframe sederhana untuk melihat susunan layout.</p>
                </div>
                <button type="button" onClick={() => setPreviewVariant(null)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><XMarkIcon className="h-5 w-5" /></button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto bg-gray-50 p-4 sm:p-6">
                <VariantPreview variant={previewVariant} full />
              </div>
              <div className="flex justify-end border-t border-gray-200 px-5 py-4">
                <button type="button" onClick={() => setPreviewVariant(null)} className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
