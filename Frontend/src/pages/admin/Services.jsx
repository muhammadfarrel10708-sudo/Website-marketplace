import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import SectionTitleEditor from '../../components/admin/SectionTitleEditor'
import { deleteService, getAdminServices } from '../../api/services'
import ConfirmDialog from './ConfirmDialog'
import ServiceFormDialog from './ServiceFormDialog'

const sortItems = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)

function Badge({ active }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
      {active ? 'Tampil' : 'Disembunyikan'}
    </span>
  )
}

export default function Services({ placement = 'page' }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [dialog, setDialog] = useState(null) // null | { service: null | objek }
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getAdminServices(placement)
      .then((data) => {
        if (cancelled) return
        setItems(sortItems(data))
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(err.message || 'Gagal memuat data.')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey, placement])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(t)
  }, [notice])

  const retry = () => {
    setStatus('loading')
    setLoadError('')
    setReloadKey((k) => k + 1)
  }

  const onSaved = (saved, wasEdit) => {
    setItems((prev) => sortItems(wasEdit ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved]))
    setDialog(null)
    setNotice(wasEdit ? 'Perubahan layanan disimpan.' : 'Layanan baru ditambahkan.')
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteService(toDelete.id)
      setItems((prev) => prev.filter((s) => s.id !== toDelete.id))
      setToDelete(null)
      setNotice('Layanan dihapus.')
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus. Coba lagi.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitleEditor
        sectionKey={placement === "home" ? "layanan_home" : "layanan"}
        defaultTitle="Layanan Kami"
        helpText={placement === "home" ? "Tampil sebagai judul besar dan daftar layanan khusus halaman utama." : "Tampil sebagai judul besar dan daftar layanan khusus halaman Layanan."}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{placement === "home" ? "Daftar layanan di Home" : "Daftar layanan di halaman Layanan"}</h2>
          <p className="mt-1 text-sm text-gray-600">{placement === "home" ? "Hanya ditampilkan di halaman utama." : "Hanya ditampilkan di halaman Layanan."}</p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ service: null })}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Tambah
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-[2.75rem]">
        {notice && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>}
      </div>

      {status === 'loading' && (
        <ul className="space-y-3" aria-busy="true" aria-label="Memuat layanan">
          {[0, 1].map((i) => (
            <li key={i} className="h-28 animate-pulse rounded-lg border border-gray-200 bg-white" />
          ))}
        </ul>
      )}

      {status === 'error' && (
        <div role="alert" className="flex flex-wrap items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <ExclamationCircleIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <span className="min-w-0 flex-1">{loadError}</span>
          <button type="button" onClick={retry} className="rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-600">
            Coba lagi
          </button>
        </div>
      )}

      {status === 'ready' && items.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
          <p className="mt-3 text-base font-semibold text-gray-900">Belum ada layanan</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
            Tambahkan layanan untuk bagian ini. Data layanan pada bagian lain tetap terpisah dan tidak ikut berubah.
          </p>
        </div>
      )}

      {status === 'ready' && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((s) => (
            <li key={s.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center">
              {s.image_url ? (
                <img src={s.image_url} alt="" loading="lazy" className={`aspect-[3/2] w-full rounded-md bg-gray-100 object-cover md:w-[220px] ${s.is_active ? '' : 'opacity-60'}`} />
              ) : (
                <div className="flex aspect-[3/2] w-full items-center justify-center rounded-md bg-gray-100 text-gray-400 md:w-[220px]">
                  <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words text-base font-semibold text-gray-900">{s.title}</h3>
                  <Badge active={s.is_active} />
                </div>
                <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-gray-600">{s.text}</p>
                <p className="mt-2 text-xs text-gray-500">Urutan {s.sort_order}{!s.image_url && ' · Memakai gambar dummy'}</p>
              </div>
              <div className="flex items-start gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={() => setDialog({ service: s })}
                  aria-label={`Ubah layanan ${s.title}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError('')
                    setToDelete(s)
                  }}
                  aria-label={`Hapus layanan ${s.title}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-red-700 hover:border-red-400 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dialog && <ServiceFormDialog service={dialog.service} placement={placement} onClose={() => setDialog(null)} onSaved={onSaved} />}

      {toDelete && (
        <ConfirmDialog
          title="Hapus layanan ini?"
          message={`Layanan “${toDelete.title}” akan dihapus permanen dan tidak bisa dikembalikan.`}
          busy={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
