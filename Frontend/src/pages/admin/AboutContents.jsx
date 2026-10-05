import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, InformationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { deleteAboutContent, getAdminAboutContents } from '../../api/aboutContents'
import AboutContentFormDialog from './AboutContentFormDialog'
import ConfirmDialog from './ConfirmDialog'

const sortItems = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)

function Badge({ active }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span>
}

export default function AboutContents() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [dialog, setDialog] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getAdminAboutContents().then((data) => { if (!cancelled) { setItems(sortItems(data)); setStatus('ready') } }).catch((err) => { if (!cancelled) { setLoadError(err.message || 'Gagal memuat data.'); setStatus('error') } })
    return () => { cancelled = true }
  }, [reloadKey])

  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 4000); return () => clearTimeout(t) }, [notice])

  const onSaved = (saved, wasEdit) => {
    setItems((prev) => sortItems(wasEdit ? prev.map((item) => item.id === saved.id ? saved : item) : [...prev, saved]))
    setDialog(null)
    setNotice(wasEdit ? 'Konten Tentang Kami diperbarui.' : 'Konten Tentang Kami ditambahkan.')
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true); setDeleteError('')
    try {
      await deleteAboutContent(toDelete.id)
      setItems((prev) => prev.filter((item) => item.id !== toDelete.id))
      setToDelete(null)
      setNotice('Konten Tentang Kami dihapus.')
    } catch (err) { setDeleteError(err.message || 'Gagal menghapus. Coba lagi.') } finally { setDeleting(false) }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <div className="flex gap-2"><InformationCircleIcon className="mt-0.5 h-5 w-5 flex-none" /><p>Bagian ini mengatur blok <b>Tentang Kami</b> khusus di halaman Home. Konten ini terpisah dari halaman <b>Tentang Kami</b> pada website publik. Jika semua data dihapus atau disembunyikan, website kembali memakai konten dummy bawaan.</p></div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-lg font-bold text-gray-900">Tentang Kami (Home)</h2><p className="mt-1 text-sm text-gray-600">Kelola satu konten singkat Tentang Kami yang tampil di Home. Halaman Tentang Kami pada website publik dikelola sebagai halaman terpisah.</p></div>
        {items.length === 0 && <button type="button" onClick={() => setDialog({ content: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"><PlusIcon className="h-4 w-4" />Tambah</button>}
      </div>

      <div role="status" aria-live="polite" className="min-h-[2.75rem]">{notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}</div>

      {status === 'loading' && <ul className="space-y-3">{[0,1].map((i) => <li key={i} className="h-32 animate-pulse rounded-lg border border-gray-200 bg-white" />)}</ul>}
      {status === 'error' && <div role="alert" className="flex flex-wrap items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 flex-none" /><span className="min-w-0 flex-1">{loadError}</span><button type="button" onClick={() => { setStatus('loading'); setLoadError(''); setReloadKey((k) => k + 1) }} className="rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}
      {status === 'ready' && items.length === 0 && <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center"><PhotoIcon className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-3 text-base font-semibold text-gray-900">Belum ada konten Tentang Kami</p><p className="mx-auto mt-1 max-w-md text-sm text-gray-600">Home masih memakai konten bawaan. Klik <b>Tambah</b> untuk membuat konten yang bisa diedit dari admin.</p></div>}
      {status === 'ready' && items.length > 0 && <ul className="space-y-3">{items.slice(0, 1).map((item) => (
        <li key={item.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[240px_minmax(0,1fr)_auto] md:items-center">
          {item.image_url ? <img src={item.image_url} alt="" loading="lazy" className={`aspect-[16/10] w-full rounded-md bg-gray-100 object-cover md:w-[240px] ${item.is_active ? '' : 'opacity-60'}`} /> : <div className="flex aspect-[16/10] w-full items-center justify-center rounded-md bg-gray-100 text-gray-400 md:w-[240px]"><PhotoIcon className="h-9 w-9" /></div>}
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-base font-semibold text-gray-900">{item.title}</h3><Badge active={item.is_active} /></div><p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-gray-600">{item.paragraph_one}</p>{item.paragraph_two && <p className="mt-1 line-clamp-1 break-words text-xs leading-5 text-gray-500">{item.paragraph_two}</p>}<p className="mt-2 text-xs text-gray-500">Urutan {item.sort_order}{!item.image_url && ' · Memakai gambar dummy'}</p></div>
          <div className="flex items-start gap-2 md:flex-col"><button type="button" onClick={() => setDialog({ content: item })} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" />Ubah</button><button type="button" onClick={() => { setDeleteError(''); setToDelete(item) }} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-red-700 hover:border-red-400 hover:bg-red-50"><TrashIcon className="h-4 w-4" />Hapus</button></div>
        </li>
      ))}</ul>}

      {dialog && <AboutContentFormDialog content={dialog.content} onClose={() => setDialog(null)} onSaved={onSaved} />}
      {toDelete && <ConfirmDialog title="Hapus konten Tentang Kami (Home)?" message={`Konten “${toDelete.title}” beserta gambarnya akan dihapus permanen.`} busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
    </div>
  )
}
