import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import DummyImage from '../../components/DummyImage'
import { deleteArticle, getAdminArticles } from '../../api/articles'
import ConfirmDialog from './ConfirmDialog'
import ArticleFormDialog from './ArticleFormDialog'

function Badge({ active }) { return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span> }

export default function Articles({ placement = 'home' }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [dialog, setDialog] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')

  const load = () => {
    setStatus('loading'); setError('')
    getAdminArticles(placement).then((data) => { setItems(data); setStatus('ready') }).catch((err) => { setError(err.message || 'Gagal memuat info terbaru.'); setStatus('error') })
  }
  useEffect(() => { load() }, [placement])

  const onSaved = (saved, edit) => {
    setItems((prev) => edit ? prev.map((x) => x.id === saved.id ? saved : x) : [...prev, saved])
    setDialog(null); setNotice(edit ? 'Info terbaru diperbarui.' : 'Info terbaru ditambahkan.')
  }
  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true); setDeleteError('')
    try { await deleteArticle(toDelete.id); setItems((x) => x.filter((p) => p.id !== toDelete.id)); setToDelete(null); setNotice('Info terbaru dihapus.') }
    catch (err) { setDeleteError(err.message || 'Gagal menghapus.') }
    finally { setDeleting(false) }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {placement === 'home' && <SectionTitleEditor sectionKey="info_terbaru" defaultTitle="Info Terbaru" helpText="Judul ini tampil di atas daftar artikel terbaru pada Home." />}
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-bold">{placement === 'home' ? 'Artikel di Home' : 'Artikel Menu'}</h2><p className="mt-1 text-sm text-gray-600">{placement === 'home' ? 'Artikel ini khusus untuk bagian Info Terbaru di Home.' : 'Artikel ini khusus untuk halaman Artikel pada menu utama.'}</p></div><button type="button" onClick={() => setDialog({ article: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" /> Tambah</button></div>
      {notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}
      {status === 'loading' && <div className="h-32 animate-pulse rounded-xl border bg-white" />}
      {status === 'error' && <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5" />{error}<button onClick={load} className="ml-auto rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}
      {status === 'ready' && items.length === 0 && <div className="rounded-xl border border-dashed bg-white px-6 py-14 text-center"><PhotoIcon className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-3 font-semibold">Belum ada artikel</p><p className="mt-1 text-sm text-gray-500">Tambahkan artikel pertama untuk bagian ini.</p></div>}
      {status === 'ready' && items.length > 0 && <ul className="space-y-3">{items.map((a, index) => <li key={a.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">{a.image_url ? <img src={a.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: `translate(${Number(a.image_position_x ?? 0)}%, ${Number(a.image_position_y ?? 0)}%) scale(${Number(a.image_zoom ?? 1)})`, transformOrigin: 'center center' }} /> : <DummyImage seed={index} ratio="4 / 3" label="Gambar dummy" />}</div>
        <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-gray-900">{a.title}</h3><Badge active={a.is_active} /></div>{a.date && <p className="mt-1 text-xs text-gray-500">{a.date}</p>}{a.excerpt && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{a.excerpt}</p>}<p className="mt-2 text-xs text-gray-500">Urutan {a.sort_order} · /artikel/{a.slug}</p></div>
        <div className="flex gap-2 md:flex-col"><button type="button" onClick={() => setDialog({ article: a })} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" /> Ubah</button><button type="button" onClick={() => { setDeleteError(''); setToDelete(a) }} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Hapus</button></div>
      </li>)}</ul>}
      {dialog && <ArticleFormDialog article={dialog.article} placement={placement} onClose={() => setDialog(null)} onSaved={onSaved} />}
      {toDelete && <ConfirmDialog title="Hapus info terbaru ini?" message={`Artikel “${toDelete.title}” akan dihapus permanen dan tidak bisa dikembalikan.`} busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
    </div>
  )
}
