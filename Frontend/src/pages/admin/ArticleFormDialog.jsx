import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createArticle, updateArticle } from '../../api/articles'
import { useDialog } from '../../components/useDialog'

const MAX_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function ArticleImageEditor({ src, zoom, offsetX, offsetY, onZoomChange, onPositionChange }) {
  const dragRef = useRef(null)

  const stopDrag = (event) => {
    if (!dragRef.current) return
    try { event.currentTarget.releasePointerCapture(dragRef.current.pointerId) } catch {}
    dragRef.current = null
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY }
  }

  const handlePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const dx = event.clientX - dragRef.current.lastX
    const dy = event.clientY - dragRef.current.lastY
    dragRef.current.lastX = event.clientX
    dragRef.current.lastY = event.clientY
    onPositionChange(offsetX + (dx / rect.width) * 100, offsetY + (dy / rect.height) * 100)
  }

  const handleWheel = (event) => {
    // Scroll di area gambar hanya untuk zoom gambar. Jangan sampai modal/page ikut scroll.
    event.preventDefault()
    event.stopPropagation()
    const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12
    const next = zoom * factor
    if (Number.isFinite(next) && next > 0) onZoomChange(next)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-5 sm:grid-cols-[minmax(220px,360px)_1fr]">
        <div>
          <div
            className="relative aspect-[4/3] select-none overflow-hidden rounded-xl border border-gray-200 bg-gray-100 cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onWheel={handleWheel}
            style={{ overscrollBehavior: 'contain' }}
            title="Klik lalu tarik gambar ke segala arah. Scroll di atas gambar untuk zoom."
          >
            <img
              src={src}
              alt="Pratinjau artikel"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ transform: `translate(${offsetX}%, ${offsetY}%) scale(${zoom})`, transformOrigin: 'center center' }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">Klik dan tarik foto bebas ke kiri, kanan, atas, atau bawah • scroll di atas foto untuk zoom</p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Zoom <span className="font-semibold text-gray-900">{zoom < 0.01 ? zoom.toExponential(2) : zoom.toFixed(2)}×</span>
            <p className="mt-1 text-xs text-gray-500">Tidak ada batas zoom maupun batas posisi.</p>
          </div>
          <div className="rounded-lg border border-gray-200 px-4 py-3 text-xs leading-5 text-gray-500">
            Posisi gambar disimpan bersama artikel. Saat gambar sudah pas, tekan <b className="text-gray-700">Simpan</b>.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ArticleFormDialog({ article, placement = 'home', onClose, onSaved }) {
  const isEdit = Boolean(article)
  const ref = useRef(null)
  const objectUrl = useRef(null)
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [publishedAt, setPublishedAt] = useState(article?.published_at ?? new Date().toISOString().slice(0, 10))
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [body, setBody] = useState((article?.body ?? []).join('\n\n'))
  const [sortOrder, setSortOrder] = useState(article ? String(article.sort_order) : '')
  const [isActive, setIsActive] = useState(article?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(article?.image_url ?? null)
  const [zoom, setZoom] = useState(Number(article?.image_zoom) > 0 ? Number(article.image_zoom) : 1)
  const [offsetX, setOffsetX] = useState(Number.isFinite(Number(article?.image_position_x)) ? Number(article.image_position_x) : 0)
  const [offsetY, setOffsetY] = useState(Number.isFinite(Number(article?.image_position_y)) ? Number(article.image_position_y) : 0)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useDialog(ref, () => { if (!saving) onClose() })

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
  }, [])

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
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setErrors((x) => ({ ...x, image: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const next = {}
    if (!title.trim()) next.title = 'Judul artikel wajib diisi.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    const fd = new FormData()
    fd.append('title', title.trim())
    fd.append('slug', slug.trim())
    fd.append('published_at', publishedAt)
    fd.append('excerpt', excerpt.trim())
    fd.append('body', body.trim())
    fd.append('is_active', isActive ? '1' : '0')
    fd.append('image_zoom', String(zoom))
    fd.append('image_position_x', String(offsetX))
    fd.append('image_position_y', String(offsetY))
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)

    setSaving(true)
    try {
      const saved = isEdit ? await updateArticle(article.id, fd, placement) : await createArticle(fd, placement)
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
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 sm:py-10">
      <div ref={ref} role="dialog" aria-modal="true" className="relative my-2 w-full max-w-5xl max-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div><h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Ubah artikel' : 'Tambah artikel'} — {placement === 'home' ? 'Home' : 'Menu Artikel'}</h2><p className="mt-1 text-xs text-gray-500">Kelola artikel, gambar, isi, urutan, dan status tampil.</p></div>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-md p-2 text-gray-600 hover:bg-gray-100"><XMarkIcon className="h-5 w-5" /></button>
        </div>

        <form onSubmit={submit} className="max-h-[calc(100vh-9rem)] overflow-y-auto px-6 py-5" style={{ overscrollBehavior: 'contain' }}>
          {formError && <div className="mb-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 shrink-0" />{formError}</div>}

          <div className="space-y-5">
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
              <label className="flex items-center gap-2 text-sm font-medium"><PhotoIcon className="h-5 w-5" /> Gambar artikel <span className="text-xs font-normal text-gray-500">(opsional)</span></label>
              <p className="mt-1 text-xs text-gray-500">Pilih gambar lalu langsung atur posisi dan zoom dengan mouse. Tidak ada batas posisi/zoom.</p>
              <label className="mt-3 inline-flex cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pickImage} disabled={saving} />
                {preview ? 'Ganti gambar' : 'Pilih gambar'}
              </label>
              {file && <span className="ml-3 text-xs text-gray-500">{file.name}</span>}
              {errors.image && <p className="mt-2 text-xs font-medium text-red-600">{errors.image}</p>}
            </div>

            {preview && <ArticleImageEditor
              src={preview}
              zoom={zoom}
              offsetX={offsetX}
              offsetY={offsetY}
              onZoomChange={setZoom}
              onPositionChange={(x, y) => { setOffsetX(x); setOffsetY(y) }}
            />}

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <div><label className="mb-1.5 block text-sm font-medium">Judul <span className="text-red-500">*</span></label><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={180} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" placeholder="Judul artikel" />{errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-sm font-medium">Slug <span className="text-xs font-normal text-gray-500">(opsional)</span></label><input value={slug} onChange={(e) => setSlug(e.target.value)} maxLength={200} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" placeholder="judul-artikel" /></div>
                  <div><label className="mb-1.5 block text-sm font-medium">Tanggal</label><input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div>
                </div>
                <div><label className="mb-1.5 block text-sm font-medium">Urutan tampil</label><input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" /> Tampilkan di website</label>
              </div>

              <div className="space-y-4">
                <div><label className="mb-1.5 block text-sm font-medium">Ringkasan <span className="text-xs font-normal text-gray-500">(opsional)</span></label><textarea rows={4} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={600} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm" placeholder="Ringkasan singkat yang tampil di kartu." />{errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}</div>
                <div><label className="mb-1.5 block text-sm font-medium">Isi artikel <span className="text-xs font-normal text-gray-500">(opsional)</span></label><textarea rows={9} value={body} onChange={(e) => setBody(e.target.value)} className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm" placeholder="Pisahkan paragraf dengan satu baris kosong." />{errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 pt-4"><button type="button" onClick={onClose} disabled={saving} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold">Batal</button><button type="submit" disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white">{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
        </form>
      </div>
    </div>
  )
}
