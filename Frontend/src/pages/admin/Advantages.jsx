import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, ListBulletIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import { deleteAdvantage, getAdminAdvantages } from '../../api/advantages'
import ConfirmDialog from './ConfirmDialog'
import AdvantageFormDialog from './AdvantageFormDialog'

const sortItems = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)

function Badge({ active }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span>
}

const iconLabel = { shield: 'Perisai', money: 'Harga', wrench: 'Garansi', clock: 'Waktu' }

export default function Advantages() {
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
    getAdminAdvantages().then((data) => {
      if (cancelled) return
      setItems(sortItems(data))
      setStatus('ready')
    }).catch((err) => {
      if (cancelled) return
      setLoadError(err.message || 'Gagal memuat data.')
      setStatus('error')
    })
    return () => { cancelled = true }
  }, [reloadKey])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(t)
  }, [notice])

  const onSaved = (saved, wasEdit) => {
    setItems((prev) => sortItems(wasEdit ? prev.map((x) => x.id === saved.id ? saved : x) : [...prev, saved]))
    setDialog(null)
    setNotice(wasEdit ? 'Perubahan alasan memilih kami disimpan.' : 'Alasan baru ditambahkan.')
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteAdvantage(toDelete.id)
      setItems((prev) => prev.filter((x) => x.id !== toDelete.id))
      setToDelete(null)
      setNotice('Card dihapus.')
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus. Coba lagi.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitleEditor
        sectionKey="kenapa_pilih_kami"
        defaultTitle="Kenapa Harus Pilih Kami?"
        helpText="Judul dan subjudul ini tampil di Home tepat di atas card. Card di bawah adalah data CRUD yang benar-benar tersimpan."
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daftar card Kenapa Harus Pilih Kami?</h2>
          <p className="mt-1 text-sm text-gray-600">Tambah, ubah, hapus, atur urutan, dan tampilkan/sembunyikan card dari Home.</p>
        </div>
        <button type="button" onClick={() => setDialog({ advantage: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          <PlusIcon className="h-4 w-4" /> Tambah
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-[2.75rem]">{notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}</div>

      {status === 'loading' && <div className="grid gap-4 md:grid-cols-2"><div className="h-48 animate-pulse rounded-xl border bg-white" /><div className="h-48 animate-pulse rounded-xl border bg-white" /></div>}
      {status === 'error' && <div role="alert" className="flex flex-wrap items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5" /><span className="flex-1">{loadError}</span><button type="button" onClick={() => { setStatus('loading'); setReloadKey((k) => k + 1) }} className="rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}

      {status === 'ready' && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <ListBulletIcon className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-3 font-semibold text-gray-900">Belum ada card</p>
          <p className="mt-1 text-sm text-gray-600">Klik Tambah untuk membuat card pertama.</p>
        </div>
      )}

      {status === 'ready' && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Card {i + 1}</span>
                    <Badge active={item.is_active} />
                  </div>
                  <h3 className="mt-1 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">Icon: {iconLabel[item.icon] || item.icon} · Urutan {item.sort_order}</p>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setDialog({ advantage: item })} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" /> Ubah</button>
                <button type="button" onClick={() => { setDeleteError(''); setToDelete(item) }} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Hapus</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {dialog && <AdvantageFormDialog advantage={dialog.advantage} onClose={() => setDialog(null)} onSaved={onSaved} />}
      {toDelete && <ConfirmDialog title="Hapus card ini?" message={`Card “${toDelete.title}” akan dihapus permanen dan tidak bisa dikembalikan.`} busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
    </div>
  )
}
