import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExclamationCircleIcon, ListBulletIcon, PencilSquareIcon, PlusIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import ConfirmDialog from './ConfirmDialog'
import { createAboutPageItem, deleteAboutPageItem, getAdminAboutPageItems, updateAboutPageItem } from '../../api/aboutPage'

const CONFIG = {
  intro: { label: 'Edit Tentang Kami', title: 'Tentang Kami', defaultTitle: 'Tentang Kami', help: 'Mengatur satu blok Tentang Kami yang tampil di halaman /tentang-kami.', singular: true },
  testimonials: { label: 'Pendapat Customer Kami', title: 'Pendapat Customer Kami', defaultTitle: 'Pendapat Customer Kami', help: 'Kelola kartu pendapat customer pada halaman /tentang-kami.' },
  projects: { label: 'Project', title: 'Project', defaultTitle: 'Project', help: 'Kelola daftar project yang ditampilkan pada halaman /tentang-kami.' },
  brands: { label: 'Brand', title: 'Brand', defaultTitle: 'Brand', help: 'Kelola logo brand yang ditampilkan pada halaman /tentang-kami.' },
}

const input = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-2 focus:outline-brand disabled:bg-gray-100'
function parseImageMeta(value, fallbackShape = 'square') {
  const base = { shape: fallbackShape, zoom: 1, offsetX: 0, offsetY: 0, ratio: 4 / 3 }
  if (!value) return base
  if (value === 'circle' || value === 'square') return { ...base, shape: value }
  try {
    const parsed = JSON.parse(value)
    const legacyX = Number.isFinite(Number(parsed.x)) ? Number(parsed.x) : 50
    const legacyY = Number.isFinite(Number(parsed.y)) ? Number(parsed.y) : 50
    return {
      shape: parsed.shape === 'circle' ? 'circle' : (parsed.shape === 'square' ? 'square' : fallbackShape),
      zoom: Number.isFinite(Number(parsed.zoom)) && Number(parsed.zoom) > 0 ? Number(parsed.zoom) : 1,
      offsetX: Number.isFinite(Number(parsed.offsetX)) ? Number(parsed.offsetX) : (-legacyX * 0.2 + 10),
      offsetY: Number.isFinite(Number(parsed.offsetY)) ? Number(parsed.offsetY) : (-legacyY * 0.2 + 10),
      ratio: Number.isFinite(Number(parsed.ratio)) && Number(parsed.ratio) > 0 ? Number(parsed.ratio) : base.ratio,
    }
  } catch { return base }
}

function imageMetaString({ shape, zoom, offsetX, offsetY, ratio }) {
  return JSON.stringify({ shape, zoom: Number(zoom.toFixed(4)), offsetX: Number(offsetX.toFixed(2)), offsetY: Number(offsetY.toFixed(2)), ratio: Number(ratio.toFixed(4)) })
}

function Badge({ active }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span>
}

function ShapePreview({ src, shape = 'circle', zoom = 1, alt = '' }) {
  if (!src) return null
  return (
    <div className={`relative aspect-square overflow-hidden border border-gray-200 bg-white ${shape === 'square' ? 'rounded-lg' : 'rounded-full'}`}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain" style={{ objectPosition: '50% 50%', transform: `scale(${zoom})` }} />
    </div>
  )
}

function AdjustedPreview({ src, ratio = '4 / 3', zoom = 1, offsetX = 0, offsetY = 0, shape = 'square', alt = '' }) {
  if (!src) return null
  return (
    <div className={`relative overflow-hidden border border-gray-200 bg-white ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain" style={{ transform: `translate(${offsetX}%, ${offsetY}%) scale(${zoom})`, transformOrigin: 'center center' }} />
    </div>
  )
}

function CropEditor({ src, zoom, onZoomChange, offsetX, offsetY, onPositionChange, shape, onShapeChange, allowShape = false }) {
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
      <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
        <div>
          <div
            className={`relative aspect-square select-none overflow-hidden border border-gray-200 bg-white ${shape === 'square' ? 'rounded-xl' : 'rounded-full'} cursor-grab touch-none active:cursor-grabbing`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onWheel={handleWheel}
            title="Klik lalu tarik gambar untuk menggeser ke segala arah. Scroll untuk zoom."
          >
            <img
              src={src}
              alt="Pratinjau gambar"
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-h-full max-w-full object-contain"
              style={{ transform: `translate(-50%, -50%) translate(${offsetX}%, ${offsetY}%) scale(${zoom})`, transformOrigin: 'center center' }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">Klik dan tarik foto bebas ke mana saja • scroll di atas foto untuk zoom</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">Zoom <span className="font-semibold text-gray-900">{zoom < 0.01 ? zoom.toExponential(2) : zoom.toFixed(2)}×</span><span className="ml-2 text-xs text-gray-500">Scroll di atas gambar untuk zoom bebas</span></div>
          {allowShape && (
            <div>
              <label className="mb-2 block text-sm font-medium">Bentuk gambar di website</label>
              <div className="grid grid-cols-2 gap-3">
                {[['circle', 'Lingkaran'], ['square', 'Persegi / Kotak']].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => onShapeChange(value)} className={`rounded-xl border p-3 text-sm font-semibold transition ${shape === value ? 'border-brand bg-brand/5 text-brand ring-2 ring-brand/20' : 'border-gray-300 text-gray-700 hover:border-brand'}`}>
                    <span className={`mx-auto mb-2 block h-10 w-10 border border-gray-300 bg-white ${value === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500">Tidak ada batas kiri/kanan/atas/bawah. Klik dan tarik foto langsung ke arah mana pun yang kamu mau.</p>
        </div>
      </div>
    </div>
  )
}

function ItemDialog({ section, item, onClose, onSaved }) {
  const isEdit = Boolean(item)
  const needsIntro = section === 'intro'
  const needsTestimonial = section === 'testimonials'
  const needsProject = section === 'projects'
  const needsBrand = section === 'brands'
  const initial = parseImageMeta(item?.meta_two, needsBrand ? 'circle' : 'square')
  const [title, setTitle] = useState(needsBrand ? '' : (item?.title ?? ''))
  const [subtitle, setSubtitle] = useState(needsBrand ? '' : (item?.subtitle ?? ''))
  const [contentOne, setContentOne] = useState(item?.content_one ?? '')
  const [contentTwo, setContentTwo] = useState(item?.content_two ?? '')
  const [metaOne, setMetaOne] = useState(item?.meta_one ?? '')
  const [shape, setShape] = useState(initial.shape)
  const [zoom, setZoom] = useState(initial.zoom)
  const [offsetX, setOffsetX] = useState(initial.offsetX)
  const [offsetY, setOffsetY] = useState(initial.offsetY)
  const cropRatio = needsBrand ? 1 : initial.ratio
  const [sortOrder, setSortOrder] = useState(item ? String(item.sort_order) : '')
  const [isActive, setIsActive] = useState(item?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(item?.image_url ?? null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => () => { if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview) }, [preview])

  const pickImage = (e) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(picked.type)) return setErrors((p) => ({ ...p, image: 'Format gambar harus JPG, PNG, atau WebP.' }))
    if (picked.size > 5 * 1024 * 1024) return setErrors((p) => ({ ...p, image: 'Ukuran gambar maksimal 5 MB.' }))
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setFile(picked)
    setPreview(URL.createObjectURL(picked))
    setErrors((p) => ({ ...p, image: undefined }))
    if (needsBrand) setShape(shape || 'circle')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const next = {}
    if (!needsBrand && !title.trim()) next.title = needsIntro ? 'Judul wajib diisi.' : 'Nama/judul wajib diisi.'
    if (needsIntro && !contentOne.trim()) next.content_one = 'Isi utama wajib diisi.'
    if (needsTestimonial && !contentOne.trim()) next.content_one = 'Pendapat customer wajib diisi.'
    if (needsTestimonial && !subtitle.trim()) next.subtitle = 'Perusahaan/instansi wajib diisi.'
    if (needsProject && !subtitle.trim()) next.subtitle = 'Kota wajib diisi.'
    if ((needsBrand || needsTestimonial || needsProject) && !preview) next.image = needsBrand ? 'Gambar brand wajib dipilih.' : 'Silakan pilih gambar terlebih dahulu.'
    setErrors(next); setFormError('')
    if (Object.keys(next).length) return

    const fd = new FormData()
    fd.append('section_key', section)
    fd.append('title', needsBrand ? '' : title.trim())
    fd.append('subtitle', needsBrand ? '' : subtitle.trim())
    fd.append('content_one', contentOne.trim())
    fd.append('content_two', contentTwo.trim())
    fd.append('meta_one', needsBrand ? '' : metaOne.trim())
    fd.append('meta_two', imageMetaString({ shape, zoom, offsetX, offsetY, ratio: cropRatio }))
    fd.append('is_active', isActive ? '1' : '0')
    if (sortOrder !== '') fd.append('sort_order', sortOrder)
    if (file) fd.append('image', file)

    setSaving(true)
    try {
      const saved = isEdit ? await updateAboutPageItem(item.id, fd) : await createAboutPageItem(fd)
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

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  const hasImageEditor = Boolean(preview) && (needsBrand || needsTestimonial || needsProject)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 sm:py-10">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-4xl max-h-[calc(100vh-5rem)] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? `Ubah ${CONFIG[section].label}` : `Tambah ${CONFIG[section].label}`}</h2>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">Tutup</button>
        </div>
        <form onSubmit={submit} className="max-h-[calc(100vh-9rem)] space-y-5 overflow-y-auto px-6 py-6" noValidate>
          {formError && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 flex-none" />{formError}</div>}

          {needsBrand ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <label className="flex items-center gap-2 text-sm font-medium"><PhotoIcon className="h-5 w-5" /> Gambar / logo brand</label>
                <p className="mt-1 text-xs text-gray-500">Setelah memilih gambar, langsung atur posisi, zoom, dan bentuknya di bawah.</p>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="mt-3 block w-full text-sm" disabled={saving} />
                {errors.image && <p className="mt-1 text-xs font-medium text-red-600">{errors.image}</p>}
              </div>
              {hasImageEditor && <CropEditor src={preview} zoom={zoom} onZoomChange={setZoom} offsetX={offsetX} offsetY={offsetY} onPositionChange={(nx, ny) => { setOffsetX(nx); setOffsetY(ny) }} shape={shape} onShapeChange={setShape} allowShape />}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium">{needsIntro ? 'Judul' : 'Nama'}</label><input className={input} value={title} onChange={(e) => setTitle(e.target.value)} disabled={saving} />{errors.title && <p className="mt-1 text-xs font-medium text-red-600">{errors.title}</p>}</div>
                {!needsIntro && <div><label className="mb-1.5 block text-sm font-medium">{needsTestimonial ? 'Perusahaan / instansi' : 'Kota'}</label><input className={input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} disabled={saving} />{errors.subtitle && <p className="mt-1 text-xs font-medium text-red-600">{errors.subtitle}</p>}</div>}
              </div>
              {needsIntro && <><div><label className="mb-1.5 block text-sm font-medium">Paragraf utama</label><textarea rows={4} className={input} value={contentOne} onChange={(e) => setContentOne(e.target.value)} disabled={saving} />{errors.content_one && <p className="mt-1 text-xs font-medium text-red-600">{errors.content_one}</p>}</div><div><label className="mb-1.5 block text-sm font-medium">Paragraf kedua</label><textarea rows={4} className={input} value={contentTwo} onChange={(e) => setContentTwo(e.target.value)} disabled={saving} /></div></>}
              {needsTestimonial && <><div><label className="mb-1.5 block text-sm font-medium">Pendapat customer</label><textarea rows={5} className={input} value={contentOne} onChange={(e) => setContentOne(e.target.value)} disabled={saving} />{errors.content_one && <p className="mt-1 text-xs font-medium text-red-600">{errors.content_one}</p>}</div><div><label className="mb-1.5 block text-sm font-medium">Type LED</label><input className={input} value={metaOne} onChange={(e) => setMetaOne(e.target.value)} placeholder="Contoh: P2.5" disabled={saving} /></div></>}
              {needsProject && <div><label className="mb-1.5 block text-sm font-medium">Type LED</label><input className={input} value={metaOne} onChange={(e) => setMetaOne(e.target.value)} placeholder="Contoh: P2.5" disabled={saving} /></div>}
              {(needsTestimonial || needsProject) && <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4"><label className="flex items-center gap-2 text-sm font-medium"><PhotoIcon className="h-5 w-5" /> Gambar (opsional)</label><p className="mt-1 text-xs text-gray-500">Pilih gambar lalu langsung masuk ke editor seperti galeri: geser foto dan zoom dengan mouse/touch.</p><input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="mt-3 block w-full text-sm" disabled={saving} />{errors.image && <p className="mt-1 text-xs font-medium text-red-600">{errors.image}</p>}{hasImageEditor && <div className="mt-4"><CropEditor src={preview} zoom={zoom} onZoomChange={setZoom} offsetX={offsetX} offsetY={offsetY} onPositionChange={(nx, ny) => { setOffsetX(nx); setOffsetY(ny) }} shape={shape} onShapeChange={setShape} /></div>}</div>}
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2 sm:items-end"><div><label className="mb-1.5 block text-sm font-medium">Urutan tampil</label><input type="number" min="0" max="65535" className={input} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} disabled={saving} /></div><label className="flex items-center gap-2.5 pb-2.5 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={saving} className="h-4 w-4 accent-[#2f42d6]" />Tampilkan di website</label></div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5"><button type="button" onClick={onClose} disabled={saving} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold">Batal</button><button type="submit" disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
        </form>
      </div>
    </div>
  )
}

export default function AboutPageEditor({ section }) {
  const [, setSearchParams] = useSearchParams()
  const cfg = CONFIG[section]
  const tabs = Object.entries(CONFIG).map(([key, value]) => ({ key, label: value.label }))
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  function selectTab(key) { if (key !== section) setSearchParams(key === 'intro' ? {} : { section: key }) }
  const load = () => { setStatus('loading'); setError(''); getAdminAboutPageItems(section).then((data) => { setItems(data.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)); setStatus('ready') }).catch((err) => { setError(err.message || 'Gagal memuat data.'); setStatus('error') }) }
  useEffect(load, [section])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(t) }, [notice])
  const onSaved = (saved, wasEdit) => { setItems((prev) => { const next = wasEdit ? prev.map((x) => x.id === saved.id ? saved : x) : [...prev, saved]; return next.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id) }); setDialog(null); setNotice(wasEdit ? 'Perubahan disimpan.' : 'Data berhasil ditambahkan.') }
  const confirmDelete = async () => { if (!toDelete) return; setDeleting(true); setDeleteError(''); try { await deleteAboutPageItem(toDelete.id); setItems((p) => p.filter((x) => x.id !== toDelete.id)); setToDelete(null); setNotice('Data berhasil dihapus.') } catch (err) { setDeleteError(err.message || 'Gagal menghapus.') } finally { setDeleting(false) } }
  const addDisabled = cfg.singular && items.length > 0

  return (
    <div className="mx-auto max-w-7xl px-1 pt-8">
      <div role="tablist" aria-label="Bagian halaman Tentang Kami" className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => <button key={tab.key} type="button" role="tab" aria-selected={section === tab.key} onClick={() => selectTab(tab.key)} className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${section === tab.key ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab.label}</button>)}
      </div>
      <div className="space-y-6 pt-6">
        <SectionTitleEditor sectionKey={`tentang_kami_${section}`} defaultTitle={cfg.defaultTitle} helpText={cfg.help} />
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-bold text-gray-900">{cfg.title}</h2><p className="mt-1 text-sm text-gray-600">Kelola data, urutan, dan status tampil dari halaman Tentang Kami.</p></div><button type="button" disabled={addDisabled} onClick={() => setDialog({ item: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"><PlusIcon className="h-4 w-4" /> Tambah</button></div>
        {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}
        {status === 'loading' && <div className="h-40 animate-pulse rounded-xl border bg-white" />}
        {status === 'error' && <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5" />{error}<button type="button" onClick={load} className="ml-auto rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}
        {status === 'ready' && items.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center"><ListBulletIcon className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-3 font-semibold">Belum ada data</p><p className="mt-1 text-sm text-gray-600">Klik Tambah untuk membuat data pertama.</p></div>}
        {status === 'ready' && items.length > 0 && <div className={section === 'brands' || section === 'projects' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-4'}>{items.map((item, i) => <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{cfg.label} {i + 1}</span><Badge active={item.is_active} /></div>{section === 'brands' ? <div className="mt-4">{item.image_url ? (() => { const meta = parseImageMeta(item.meta_two, 'circle'); return <ShapePreview src={item.image_url} shape={meta.shape} zoom={meta.zoom} alt={`Logo brand ${i + 1}`} /> })() : <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">Belum ada gambar</div>}<p className="mt-3 text-xs text-gray-500">{parseImageMeta(item.meta_two, 'circle').shape === 'square' ? 'Persegi / Kotak' : 'Lingkaran'} · Urutan {item.sort_order}</p></div> : <><h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>{item.subtitle && <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>}{item.content_one && <p className="mt-3 text-sm leading-6 text-gray-700">{item.content_one}</p>}{item.meta_one && <span className="mt-3 inline-flex rounded-md bg-brand px-2.5 py-1 text-xs font-bold text-white">{item.meta_one}</span>}{item.image_url && (() => { const meta = parseImageMeta(item.meta_two, 'square'); return <div className="mt-4"><AdjustedPreview src={item.image_url} ratio={section === 'testimonials' ? '16 / 10' : '4 / 3'} zoom={meta.zoom} offsetX={meta.offsetX} offsetY={meta.offsetY} shape="square" /></div> })()}<p className="mt-3 text-xs text-gray-500">Urutan {item.sort_order}</p></>}<div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4"><button type="button" onClick={() => setDialog({ item })} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-2 text-sm font-medium hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" /> Ubah</button><button type="button" onClick={() => { setDeleteError(''); setToDelete(item) }} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Hapus</button></div></article>)}</div>}
        {dialog && <ItemDialog section={section} item={dialog.item} onClose={() => setDialog(null)} onSaved={onSaved} />}
        {toDelete && <ConfirmDialog title={`Hapus ${cfg.label}?`} message={section === 'brands' ? 'Logo brand ini akan dihapus permanen dan tidak bisa dikembalikan.' : `“${toDelete.title}” akan dihapus permanen dan tidak bisa dikembalikan.`} busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
      </div>
    </div>
  )
}
