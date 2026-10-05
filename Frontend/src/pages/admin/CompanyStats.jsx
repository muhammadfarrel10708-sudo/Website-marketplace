import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, ListBulletIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import { deleteCompanyStat, getAdminCompanyStats } from '../../api/companyStats'
import ConfirmDialog from './ConfirmDialog'
import CompanyStatFormDialog from './CompanyStatFormDialog'

const sortItems = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)

function Badge({ active }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{active ? 'Tampil' : 'Disembunyikan'}</span>
}

export default function CompanyStats() {
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
    getAdminCompanyStats().then((data) => {
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
    setNotice(wasEdit ? 'Perubahan statistik disimpan.' : 'Statistik baru ditambahkan.')
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteCompanyStat(toDelete.id)
      setItems((prev) => prev.filter((x) => x.id !== toDelete.id))
      setToDelete(null)
      setNotice('Statistik dihapus.')
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus. Coba lagi.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitleEditor
        sectionKey="statistik_perusahaan"
        defaultTitle="Statistik Perusahaan Kami"
        helpText="Statistik tetap berada di alur Home setelah “Kenapa Harus Pilih Kami?”. Judul dan item di bawah dikelola dari menu Hero ini."
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daftar statistik perusahaan</h2>
          <p className="mt-1 text-sm text-gray-600">Tambah, ubah, hapus, atur urutan, dan tampilkan/sembunyikan statistik dari Home.</p>
        </div>
        <button type="button" onClick={() => setDialog({ stat: null })} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          <PlusIcon className="h-4 w-4" /> Tambah
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-[2.75rem]">{notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}</div>

      {status === 'loading' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map((i) => <div key={i} className="h-44 animate-pulse rounded-xl border bg-white" />)}</div>}
      {status === 'error' && <div role="alert" className="flex flex-wrap items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5" /><span className="flex-1">{loadError}</span><button type="button" onClick={() => { setStatus('loading'); setReloadKey((k) => k + 1) }} className="rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold">Coba lagi</button></div>}

      {status === 'ready' && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <ListBulletIcon className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-3 font-semibold text-gray-900">Belum ada statistik</p>
          <p className="mt-1 text-sm text-gray-600">Klik Tambah untuk membuat statistik pertama.</p>
        </div>
      )}

      {status === 'ready' && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Statistik {i + 1}</span>
                <Badge active={item.is_active} />
              </div>
              <p className="mt-5 text-3xl font-extrabold text-brand">{item.value}</p>
              <p className="mt-1 font-medium text-gray-800">{item.label}</p>
              <p className="mt-2 text-xs text-gray-500">Urutan {item.sort_order}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setDialog({ stat: item })} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-2 text-sm font-medium hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" /> Ubah</button>
                <button type="button" onClick={() => { setDeleteError(''); setToDelete(item) }} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Hapus</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {dialog && <CompanyStatFormDialog stat={dialog.stat} onClose={() => setDialog(null)} onSaved={onSaved} />}
      {toDelete && <ConfirmDialog title="Hapus statistik ini?" message={`Statistik “${toDelete.value} — ${toDelete.label}” akan dihapus permanen dan tidak bisa dikembalikan.`} busy={deleting} error={deleteError} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
    </div>
  )
}
