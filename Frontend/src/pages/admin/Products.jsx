import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import { deleteProduct, getAdminProducts } from '../../api/products'
import ConfirmDialog from './ConfirmDialog'
import ProductFormDialog from './ProductFormDialog'
import DummyImage from '../../components/DummyImage'

const sortItems = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
function Badge({ active }) { return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span> }

export default function Products() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [dialog, setDialog] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')

  const load = () => { setStatus('loading'); setError(''); getAdminProducts().then((data) => { setItems(sortItems(data)); setStatus('ready') }).catch((err) => { setError(err.message || 'Gagal memuat produk.'); setStatus('error') }) }
  useEffect(() => { load() }, [])

  const onSaved = (saved, edit) => { setItems((prev) => sortItems(edit ? prev.map((x) => x.id === saved.id ? saved : x) : [...prev, saved])); setDialog(null); setNotice(edit ? 'Produk diperbarui.' : 'Produk ditambahkan.') }
  const confirmDelete = async () => { if (!toDelete) return; setDeleting(true); setDeleteError(''); try { await deleteProduct(toDelete.id); setItems((x) => x.filter((p) => p.id !== toDelete.id)); setToDelete(null); setNotice('Produk dihapus.') } catch (err) { setDeleteError(err.message || 'Gagal menghapus.') } finally { setDeleting(false) } }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitleEditor sectionKey="produk" defaultTitle="Produk Kami" helpText="Judul ini tampil di atas daftar produk pada landing page." />
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-bold">Daftar produk</h2><p className="mt-1 text-sm text-gray-600">Setiap produk dapat memakai Card 1 atau Card 2.</p></div><button type="button" onClick={() => setDialog({ product: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" /> Tambah</button></div>
      {notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}
      {status === 'loading' && <div className="h-32 animate-pulse rounded-xl border bg-white" />}
      {status === 'error' && <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5" />{error}<button onClick={load} className="ml-auto rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}
      {status === 'ready' && items.length === 0 && <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center"><PhotoIcon className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-3 font-semibold">Belum ada produk</p><p className="mt-1 text-sm text-gray-500">Tambahkan produk pertama untuk mengelola bagian Produk Kami.</p></div>}
      {status === 'ready' && items.length > 0 && <ul className="space-y-3">{items.map((p, index) => <li key={p.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">{p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <DummyImage seed={index} ratio="4 / 3" label="Gambar dummy" />}</div>
        <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-gray-900">{p.title}</h3><Badge active={p.is_active} /><span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium">Card {p.layout_variant === 'card_1' ? '1' : '2'}</span></div>{p.description && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{p.description}</p>}<p className="mt-2 text-xs text-gray-500">{p.items?.length || 0} item · Urutan {p.sort_order}</p></div>
        <div className="flex gap-2 md:flex-col"><button type="button" onClick={() => setDialog({ product: p })} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" /> Ubah</button><button type="button" onClick={() => { setDeleteError(''); setToDelete(p) }} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Hapus</button></div>
      </li>)}</ul>}
      {dialog && <ProductFormDialog product={dialog.product} onClose={() => setDialog(null)} onSaved={onSaved} />}
      {toDelete && <ConfirmDialog title="Hapus produk ini?" message={`Produk “${toDelete.title}” akan dihapus permanen dan tidak bisa dikembalikan.`} busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
    </div>
  )
}
