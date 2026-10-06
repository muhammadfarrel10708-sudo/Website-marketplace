import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createMarketplaceProduct, deleteMarketplaceProduct, getAdminMarketplace, updateMarketplaceProduct } from '../../api/marketplace'
import ConfirmDialog from './ConfirmDialog'
import DummyImage from '../../components/DummyImage'

const sortItems = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
function Badge({ active }) { return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span> }

function FormDialog({ item, onClose, onSaved }) {
  const edit = Boolean(item)
  const [name, setName] = useState(item?.name || '')
  const [description, setDescription] = useState(item?.description || '')
  const [price, setPrice] = useState(item?.price ?? 0)
  const [category, setCategory] = useState(item?.category || '')
  const [sold, setSold] = useState(item?.sold ?? 0)
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0)
  const [isActive, setIsActive] = useState(item?.is_active ?? true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(item?.image_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => preview?.startsWith('blob:') && URL.revokeObjectURL(preview), [preview])

  const pick = (e) => {
    const next = e.target.files?.[0]
    if (!next) return
    setFile(next)
    const url = URL.createObjectURL(next)
    setPreview(url)
  }

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    const fd = new FormData()
    fd.append('name', name)
    fd.append('description', description)
    fd.append('price', price === '' ? 0 : price)
    fd.append('category', category)
    fd.append('sold', sold === '' ? 0 : sold)
    fd.append('sort_order', sortOrder)
    fd.append('is_active', isActive ? '1' : '0')
    if (file) fd.append('image', file)
    try {
      const saved = edit ? await updateMarketplaceProduct(item.id, fd) : await createMarketplaceProduct(fd)
      onSaved(saved, edit)
    } catch (err) { setError(err.message || 'Gagal menyimpan produk.') }
    finally { setSaving(false) }
  }

  return <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4"><div><h2 className="text-lg font-bold">{edit ? 'Ubah produk marketplace' : 'Tambah produk marketplace'}</h2><p className="mt-1 text-xs text-gray-500">Kelola foto, nama, harga, dan deskripsi produk Nusatron.</p></div><button type="button" onClick={onClose} disabled={saving} className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100">Tutup</button></div>
      <form onSubmit={submit} className="space-y-5 p-6">
        {error && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 shrink-0" />{error}</div>}
        <div className="grid gap-5 md:grid-cols-[260px_1fr]">
          <div><div className="aspect-square overflow-hidden rounded-xl bg-gray-100">{preview ? <img src={preview} alt="Preview" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-gray-400"><PhotoIcon className="h-10 w-10" /><span className="mt-2 text-xs">Belum ada foto</span></div>}</div><input id="market-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} className="sr-only" /><label htmlFor="market-image" className="mt-3 inline-flex cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">{preview ? 'Ganti foto' : 'Pilih foto'}</label></div>
          <div className="space-y-4"><div><label className="mb-1.5 block text-sm font-medium">Nama produk *</label><input required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-sm font-medium">Harga (Rp)</label><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div><div><label className="mb-1.5 block text-sm font-medium">Kategori</label><input maxLength={80} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="mis. Modul LED" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div></div><div><label className="mb-1.5 block text-sm font-medium">Deskripsi</label><textarea rows={7} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-sm font-medium">Terjual</label><input type="number" min="0" value={sold} onChange={(e) => setSold(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div><div><label className="mb-1.5 block text-sm font-medium">Urutan</label><input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" /></div><label className="col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" /> Tampilkan</label></div></div>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4"><button type="button" onClick={onClose} disabled={saving} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold">Batal</button><button type="submit" disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white">{saving ? 'Menyimpan…' : 'Simpan'}</button></div>
      </form>
    </div>
  </div>
}

export default function MarketplaceAdmin() {
  const [items, setItems] = useState([]); const [status, setStatus] = useState('loading'); const [error, setError] = useState(''); const [dialog, setDialog] = useState(null); const [toDelete, setToDelete] = useState(null); const [deleting, setDeleting] = useState(false); const [notice, setNotice] = useState('')
  const load = () => { setStatus('loading'); getAdminMarketplace().then((data) => { setItems(sortItems(data)); setStatus('ready') }).catch((err) => { setError(err.message || 'Gagal memuat marketplace.'); setStatus('error') }) }
  useEffect(() => { load() }, [])
  const saved = (row, edit) => { setItems((prev) => sortItems(edit ? prev.map((x) => x.id === row.id ? row : x) : [...prev, row])); setDialog(null); setNotice(edit ? 'Produk diperbarui.' : 'Produk ditambahkan.') }
  const confirmDelete = async () => { if (!toDelete) return; setDeleting(true); try { await deleteMarketplaceProduct(toDelete.id); setItems((prev) => prev.filter((x) => x.id !== toDelete.id)); setToDelete(null); setNotice('Produk dihapus.') } catch (err) { setError(err.message || 'Gagal menghapus.') } finally { setDeleting(false) } }
  return <div className="mx-auto max-w-7xl space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">Marketplace</h1><p className="mt-1 text-sm text-gray-600">Kelola foto, nama, dan deskripsi produk yang dijual Nusatron.</p></div><button type="button" onClick={() => setDialog({ item: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" /> Tambah produk</button></div>{notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}{status === 'loading' && <div className="h-32 animate-pulse rounded-xl border bg-white" />}{status === 'error' && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">{error}<button onClick={load} className="ml-4 rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}{status === 'ready' && items.length === 0 && <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center"><PhotoIcon className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-3 font-semibold">Belum ada produk</p></div>}{status === 'ready' && items.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((p, i) => <article key={p.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="aspect-[4/3] bg-gray-100">{p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <DummyImage seed={i} ratio="4 / 3" label="Gambar dummy" className="h-full w-full" />}</div><div className="p-4"><div className="flex items-start justify-between gap-2"><h2 className="font-bold text-gray-900">{p.name}</h2><Badge active={p.is_active} /></div><p className="mt-1 text-sm font-bold text-brand">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price || 0)}{p.category ? <span className="ml-2 text-xs font-normal text-gray-500">{p.category}</span> : null}</p><p className="mt-1 text-xs text-gray-500">{p.rating != null ? `★ ${p.rating} (${p.reviews_count} ulasan)` : 'Belum ada ulasan'} · Terjual {p.sold || 0}</p>{p.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{p.description}</p>}<div className="mt-4 flex gap-2"><button type="button" onClick={() => setDialog({ item: p })} className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm font-semibold"><PencilSquareIcon className="mr-1 inline h-4 w-4" />Ubah</button><button type="button" onClick={() => setToDelete(p)} className="rounded-full border border-gray-300 px-3 py-2 text-sm font-semibold text-red-700"><TrashIcon className="mr-1 inline h-4 w-4" />Hapus</button></div></div></article>)}</div>}{dialog && <FormDialog item={dialog.item} onClose={() => setDialog(null)} onSaved={saved} />}{toDelete && <ConfirmDialog title="Hapus produk ini?" message={`Produk “${toDelete.name}” akan dihapus permanen.`} busy={deleting} error={error} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}</div>
}
