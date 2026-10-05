import { useEffect, useRef, useState } from 'react'
import { ExclamationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'react-router-dom'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import ConfirmDialog from './ConfirmDialog'
import {
  createPortfolioBrand, createPortfolioItem, deletePortfolioBrand, deletePortfolioItem,
  getAdminPortfolioBrands, getAdminPortfolioItems, updatePortfolioBrand, updatePortfolioItem,
} from '../../api/portfolio'

const input = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand'
const tabs = [
  { key: 'items', label: 'Edit Portofolio' },
  { key: 'project', label: 'Project' },
  { key: 'brands', label: 'Brand' },
]

function Badge({ active }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span>
}

function PortfolioItemDialog({ item, onClose, onSaved }) {
  const isEdit = Boolean(item)
  const [title, setTitle] = useState(item?.title ?? '')
  const [city, setCity] = useState(item?.city ?? '')
  const [type, setType] = useState(item?.type ?? '')
  const [sortOrder, setSortOrder] = useState(item ? String(item.sort_order) : '')
  const [isActive, setIsActive] = useState(item?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(item?.image_url ?? null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const pick = (e) => {
    const next = e.target.files?.[0]
    e.target.value = ''
    if (!next) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type)) { setErrors((x) => ({ ...x, image: 'Format gambar harus JPG, PNG, atau WebP.' })); return }
    if (next.size > 5 * 1024 * 1024) { setErrors((x) => ({ ...x, image: 'Ukuran gambar maksimal 5 MB.' })); return }
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setErrors((x) => ({ ...x, image: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!title.trim()) next.title = 'Nama project wajib diisi.'
    if (!city.trim()) next.city = 'Kota wajib diisi.'
    if (!type.trim()) next.type = 'Tipe LED wajib diisi.'
    setErrors(next); setFormError('')
    if (Object.keys(next).length) return

    const fd = new FormData()
    fd.append('title', title.trim()); fd.append('city', city.trim()); fd.append('type', type.trim())
    fd.append('is_active', isActive ? '1' : '0')
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)
    setSaving(true)
    try {
      const saved = isEdit ? await updatePortfolioItem(item.id, fd) : await createPortfolioItem(fd)
      onSaved(saved, isEdit)
    } catch (err) {
      if (err.errors) setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])))
      else setFormError(err.message || 'Gagal menyimpan project.')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => !saving && onClose()} aria-hidden="true" />
      <form onSubmit={submit} className="relative my-4 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4"><h2 className="text-lg font-bold">{isEdit ? 'Ubah project' : 'Tambah project'}</h2><button type="button" onClick={() => !saving && onClose()} className="text-gray-500 hover:text-gray-900">✕</button></div>
        <div className="grid gap-6 p-6 md:grid-cols-[280px_1fr]">
          <div>
            <label className="text-sm font-medium">Foto project <span className="text-xs font-normal text-gray-500">(opsional)</span></label>
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex aspect-[4/3] items-center justify-center bg-gray-100">{preview ? <img src={preview} alt="Pratinjau" className="h-full w-full object-cover" /> : <PhotoIcon className="h-10 w-10 text-gray-400" />}</div>
              <div className="border-t border-gray-200 bg-white p-3"><label className="inline-flex cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand"><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} />{preview ? 'Ganti foto' : 'Pilih foto'}</label>{errors.image && <p className="mt-2 text-xs text-red-600">{errors.image}</p>}<p className="mt-2 text-xs text-gray-500">JPG, PNG, WebP · maksimal 5 MB.</p></div>
            </div>
          </div>
          <div className="space-y-4">
            {formError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
            <label className="block text-sm font-medium">Nama project<input className={`${input} mt-1`} value={title} maxLength={180} onChange={(e) => setTitle(e.target.value)} />{errors.title && <span className="text-xs text-red-600">{errors.title}</span>}</label>
            <label className="block text-sm font-medium">Kota / lokasi<input className={`${input} mt-1`} value={city} maxLength={120} onChange={(e) => setCity(e.target.value)} />{errors.city && <span className="text-xs text-red-600">{errors.city}</span>}</label>
            <label className="block text-sm font-medium">Tipe LED<input className={`${input} mt-1`} value={type} maxLength={40} placeholder="Contoh: P2.5" onChange={(e) => setType(e.target.value)} />{errors.type && <span className="text-xs text-red-600">{errors.type}</span>}</label>
            <label className="block text-sm font-medium">Urutan tampil<input className={`${input} mt-1`} type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} /><span className="mt-1 block text-xs text-gray-500">Kosongkan untuk menaruh di paling akhir.</span></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[#2f42d6]" /> Tampilkan di website</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold">Batal</button><button disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
      </form>
    </div>
  )
}

function BrandImageEditor({ src, zoom, offsetX, offsetY, onZoomChange, onPositionChange, shape, onShapeChange }) {
  const dragRef = useRef(null)

  const stopDrag = (event) => {
    if (dragRef.current) {
      try { event.currentTarget.releasePointerCapture(dragRef.current.pointerId) } catch {}
      dragRef.current = null
    }
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
    event.preventDefault()
    event.stopPropagation()
    const factor = event.deltaY < 0 ? 1.12 : (1 / 1.12)
    const next = zoom * factor
    if (Number.isFinite(next) && next > 0) onZoomChange(next)
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <div>
          <div
            className={`relative aspect-square select-none overflow-hidden border border-gray-200 bg-white ${shape === 'square' ? 'rounded-xl' : 'rounded-full'} cursor-grab touch-none active:cursor-grabbing`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onWheel={handleWheel}
            title="Klik lalu tarik gambar ke segala arah. Scroll di atas gambar untuk zoom."
          >
            <img
              src={src}
              alt="Pratinjau logo"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              style={{ transform: `translate(${offsetX}%, ${offsetY}%) scale(${zoom})`, transformOrigin: 'center center' }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">Klik dan tarik foto bebas ke mana saja • scroll di atas foto untuk zoom</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Zoom <span className="font-semibold text-gray-900">{zoom < 0.01 ? zoom.toExponential(2) : zoom.toFixed(2)}×</span>
            <span className="ml-2 text-xs text-gray-500">Scroll di atas gambar untuk zoom bebas</span>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Bentuk logo di website</label>
            <div className="grid grid-cols-2 gap-3">
              {[['circle', 'Lingkaran'], ['square', 'Persegi / Kotak']].map(([value, label]) => (
                <button key={value} type="button" onClick={() => onShapeChange(value)} className={`rounded-xl border p-3 text-sm font-semibold transition ${shape === value ? 'border-brand bg-brand/5 text-brand ring-2 ring-brand/20' : 'border-gray-300 text-gray-700 hover:border-brand'}`}>
                  <span className={`mx-auto mb-2 block h-10 w-10 border border-gray-300 bg-white ${value === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500">Tidak ada batas kiri/kanan/atas/bawah. Klik dan tarik foto langsung ke arah mana pun yang kamu mau.</p>
        </div>
      </div>
    </div>
  )
}

function BrandDialog({ brand, onClose, onSaved }) {
  const isEdit = Boolean(brand)
  const [shape, setShape] = useState(brand?.shape ?? 'circle')
  const [zoom, setZoom] = useState(Number(brand?.zoom) > 0 ? Number(brand.zoom) : 1)
  const [offsetX, setOffsetX] = useState(Number.isFinite(Number(brand?.position_x)) ? Number(brand.position_x) - 50 : 0)
  const [offsetY, setOffsetY] = useState(Number.isFinite(Number(brand?.position_y)) ? Number(brand.position_y) - 50 : 0)
  const [sortOrder, setSortOrder] = useState(brand ? String(brand.sort_order) : '')
  const [isActive, setIsActive] = useState(brand?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(brand?.image_url ?? null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
  }, [preview])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  const pick = (e) => {
    const next = e.target.files?.[0]
    e.target.value = ''
    if (!next) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type)) { setError('Format gambar harus JPG, PNG, atau WebP.'); return }
    if (next.size > 5 * 1024 * 1024) { setError('Ukuran gambar maksimal 5 MB.'); return }
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!preview) { setError('Logo brand wajib dipilih.'); return }
    const fd = new FormData()
    fd.append('shape', shape)
    fd.append('zoom', String(zoom))
    fd.append('position_x', String(offsetX + 50))
    fd.append('position_y', String(offsetY + 50))
    fd.append('is_active', isActive ? '1' : '0')
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)
    setSaving(true)
    try {
      const saved = isEdit ? await updatePortfolioBrand(brand.id, fd) : await createPortfolioBrand(fd)
      onSaved(saved, isEdit)
    } catch (err) {
      if (err.errors) {
        const messages = Object.values(err.errors).flat()
        setError(messages[0] || err.message || 'Gagal menyimpan brand.')
      } else setError(err.message || 'Gagal menyimpan brand.')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 sm:py-10">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-4xl max-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Ubah brand' : 'Tambah brand'}</h2>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">Tutup</button>
        </div>

        <form onSubmit={submit} className="max-h-[calc(100vh-9rem)] space-y-5 overflow-y-auto px-6 py-6" noValidate>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
            <label className="flex items-center gap-2 text-sm font-medium"><PhotoIcon className="h-5 w-5" /> Gambar / logo brand</label>
            <p className="mt-1 text-xs text-gray-500">Pilih gambar lalu langsung atur posisi dan zoom dengan mouse.</p>
            <label className="mt-3 inline-flex cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} disabled={saving} />
              {preview ? 'Ganti logo' : 'Pilih logo'}
            </label>
          </div>

          {preview && <BrandImageEditor
            src={preview}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
            onZoomChange={setZoom}
            onPositionChange={(x, y) => { setOffsetX(x); setOffsetY(y) }}
            shape={shape}
            onShapeChange={setShape}
          />}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">Urutan tampil<input className={`${input} mt-1`} type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} /></label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[#2f42d6]" /> Tampilkan di website</label>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button type="button" disabled={saving} onClick={onClose} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold">Batal</button>
            <button disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Menyimpan…' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ItemsTab() {
  const [items, setItems] = useState([]); const [status, setStatus] = useState('loading'); const [error, setError] = useState(''); const [dialog, setDialog] = useState(null); const [toDelete, setToDelete] = useState(null); const [deleting, setDeleting] = useState(false)
  const load = () => { setStatus('loading'); getAdminPortfolioItems().then((x) => { setItems(x); setStatus('ready') }).catch((e) => { setError(e.message || 'Gagal memuat project.'); setStatus('error') }) }
  useEffect(load, [])
  const saved = (item, edit) => { setItems((prev) => edit ? prev.map((x) => x.id === item.id ? item : x) : [...prev, item].sort((a,b) => a.sort_order-b.sort_order || a.id-b.id)); setDialog(null) }
  const remove = async () => { if (!toDelete) return; setDeleting(true); try { await deletePortfolioItem(toDelete.id); setItems((x) => x.filter((i) => i.id !== toDelete.id)); setToDelete(null) } catch (e) { setError(e.message || 'Gagal menghapus.') } finally { setDeleting(false) } }
  return <div className="space-y-5"><SectionTitleEditor sectionKey="portofolio" defaultTitle="Portofolio Kami" helpText="Judul besar halaman Portofolio." /><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-bold">Daftar portofolio</h2><p className="mt-1 text-sm text-gray-600">Kelola project, foto, lokasi, tipe LED, urutan, dan status tampil.</p></div><button type="button" onClick={() => setDialog({})} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" />Tambah</button></div>
    {status === 'error' && <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5" />{error}<button type="button" onClick={load} className="ml-auto font-semibold">Coba lagi</button></div>}
    {status === 'loading' && <div className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white" />}
    {status === 'ready' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item, i) => <article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="relative aspect-[4/3] bg-gray-100">{item.image_url ? <img src={item.image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><PhotoIcon className="h-9 w-9" /></div>}<span className="absolute right-2 top-2"><Badge active={item.is_active} /></span></div><div className="p-4"><h3 className="font-bold text-gray-900">{item.title}</h3><p className="mt-1 text-xs text-gray-500">{item.city} · {item.type}</p><p className="mt-2 text-xs text-gray-400">Urutan {item.sort_order}</p><div className="mt-4 flex gap-2 border-t border-gray-100 pt-3"><button type="button" onClick={() => setDialog({ item })} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-2 text-sm font-medium"><PencilSquareIcon className="h-4 w-4" />Ubah</button><button type="button" onClick={() => setToDelete(item)} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-red-700"><TrashIcon className="h-4 w-4" />Hapus</button></div></div></article>)}</div>}
    {dialog && <PortfolioItemDialog item={dialog.item} onClose={() => setDialog(null)} onSaved={saved} />}
    {toDelete && <ConfirmDialog title="Hapus project?" message={`“${toDelete.title}” akan dihapus permanen.`} busy={deleting} error={error} onConfirm={remove} onCancel={() => setToDelete(null)} />}
  </div>
}

function ProjectTab() { return <SectionTitleEditor sectionKey="portfolio_project" defaultTitle="120+ Project" helpText="Atur judul dan subjudul bagian Project yang tampil setelah daftar portofolio. Contoh judul: 120+ Project." /> }

function BrandsTab() {
  const [brands, setBrands] = useState([]); const [status, setStatus] = useState('loading'); const [error, setError] = useState(''); const [dialog, setDialog] = useState(null); const [toDelete, setToDelete] = useState(null); const [deleting, setDeleting] = useState(false)
  const load = () => { setStatus('loading'); getAdminPortfolioBrands().then((x) => { setBrands(x); setStatus('ready') }).catch((e) => { setError(e.message || 'Gagal memuat brand.'); setStatus('error') }) }
  useEffect(load, [])
  const saved = (brand, edit) => { setBrands((prev) => edit ? prev.map((x) => x.id === brand.id ? brand : x) : [...prev, brand].sort((a,b) => a.sort_order-b.sort_order || a.id-b.id)); setDialog(null) }
  const remove = async () => { if (!toDelete) return; setDeleting(true); try { await deletePortfolioBrand(toDelete.id); setBrands((x) => x.filter((i) => i.id !== toDelete.id)); setToDelete(null) } catch (e) { setError(e.message || 'Gagal menghapus.') } finally { setDeleting(false) } }
  return <div className="space-y-5"><SectionTitleEditor sectionKey="portfolio_brand" defaultTitle="80+ Brand" helpText="Atur judul dan subjudul bagian Brand khusus halaman Portofolio. Brand ini terpisah dari Brand di Home maupun Tentang Kami." /><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-bold">Brand Portofolio</h2><p className="mt-1 text-sm text-gray-600">Logo di sini berdiri sendiri dari Brand Home.</p></div><button type="button" onClick={() => setDialog({})} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" />Tambah</button></div>
    {status === 'error' && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {status === 'loading' && <div className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white" />}
    {status === 'ready' && <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{brands.map((brand) => <article key={brand.id} className="rounded-xl border border-gray-200 bg-white p-3"><div className={`relative aspect-square overflow-hidden bg-white ${brand.shape === 'square' ? 'rounded-lg' : 'rounded-full'}`}>{brand.image_url ? <img src={brand.image_url} alt="" className="absolute inset-0 h-full w-full object-contain" style={{ transform: `translate(${(Number(brand.position_x ?? 50) - 50)}%, ${(Number(brand.position_y ?? 50) - 50)}%) scale(${Number(brand.zoom ?? 1)})`, transformOrigin: 'center center' }} /> : <div className="flex h-full items-center justify-center text-xs text-gray-400">Belum ada logo</div>}</div><div className="mt-3 flex items-center justify-between gap-2"><Badge active={brand.is_active} /><span className="text-[11px] text-gray-400">#{brand.sort_order}</span></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => setDialog({ brand })} className="flex-1 rounded-full border border-gray-300 px-2 py-1.5 text-xs font-semibold">Ubah</button><button type="button" onClick={() => setToDelete(brand)} className="rounded-full border border-gray-300 px-2 py-1.5 text-xs font-semibold text-red-700">Hapus</button></div></article>)}</div>}
    {dialog && <BrandDialog brand={dialog.brand} onClose={() => setDialog(null)} onSaved={saved} />}
    {toDelete && <ConfirmDialog title="Hapus brand?" message="Logo brand ini akan dihapus permanen." busy={deleting} error={error} onConfirm={remove} onCancel={() => setToDelete(null)} />}
  </div>
}

export default function PortfolioEditor() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('section') || 'items'
  const active = tabs.some((t) => t.key === requested) ? requested : 'items'
  return <div className="mx-auto max-w-7xl"><div role="tablist" aria-label="Bagian Portofolio" className="flex gap-1 overflow-x-auto border-b border-gray-200">{tabs.map((tab) => <button key={tab.key} type="button" onClick={() => setSearchParams({ section: tab.key })} className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${active === tab.key ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab.label}</button>)}</div><div className="pt-6">{active === 'items' && <ItemsTab />}{active === 'project' && <ProjectTab />}{active === 'brands' && <BrandsTab />}</div></div>
}
