import { useEffect, useState } from 'react'
import { ExclamationCircleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { deleteHero, getAdminHeroes } from '../../api/heroes'
import ConfirmDialog from './ConfirmDialog'
import HeroFormDialog from './HeroFormDialog'

const sortHeroes = (list) => [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)

function Badge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {active ? 'Tampil' : 'Disembunyikan'}
    </span>
  )
}

export default function Heroes({ embedded = false } = {}) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [loadError, setLoadError] = useState('')
  const [dialog, setDialog] = useState(null) // null | { hero: null | objek }
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notice, setNotice] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getAdminHeroes()
      .then((data) => {
        if (cancelled) return
        setItems(sortHeroes(data))
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
  }, [reloadKey])

  const retry = () => {
    setStatus('loading')
    setLoadError('')
    setReloadKey((k) => k + 1)
  }

  // Pesan sukses hilang sendiri
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(t)
  }, [notice])

  const onSaved = (saved, wasEdit) => {
    setItems((prev) => sortHeroes(wasEdit ? prev.map((h) => (h.id === saved.id ? saved : h)) : [...prev, saved]))
    setDialog(null)
    setNotice(wasEdit ? 'Perubahan slide disimpan.' : 'Slide baru ditambahkan.')
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteHero(toDelete.id)
      setItems((prev) => prev.filter((h) => h.id !== toDelete.id))
      setToDelete(null)
      setNotice('Slide dihapus.')
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus. Coba lagi.')
    } finally {
      setDeleting(false)
    }
  }

  const activeCount = items.filter((h) => h.is_active).length

  return (
    <div className={embedded ? undefined : 'mx-auto max-w-5xl'}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero slider</h1>
          <p className="mt-1 text-sm text-gray-600">Gambar dan teks yang tampil di slider halaman utama.</p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ hero: null })}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Tambah
        </button>
      </div>

      <div role="status" aria-live="polite" className="mb-2 mt-4 min-h-[2.75rem]">
        {notice && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{notice}</p>
        )}
      </div>

      {status === 'loading' && (
        <ul className="mt-2 space-y-3" aria-busy="true" aria-label="Memuat slide">
          {[0, 1].map((i) => (
            <li key={i} className="h-28 animate-pulse rounded-lg border border-gray-200 bg-white" />
          ))}
        </ul>
      )}

      {status === 'error' && (
        <div role="alert" className="mt-2 flex flex-wrap items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <ExclamationCircleIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <span className="min-w-0 flex-1">{loadError}</span>
          <button
            type="button"
            onClick={retry}
            className="rounded-full border border-red-300 bg-white px-4 py-1.5 font-semibold text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-600"
          >
            Coba lagi
          </button>
        </div>
      )}

      {status === 'ready' && items.length === 0 && (
        <div className="mt-2 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
          <p className="mt-3 text-base font-semibold text-gray-900">Belum ada slide</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
            Selama belum ada slide, website menampilkan slide contoh bawaan. Klik <b>Tambah</b> untuk membuat slide pertama.
          </p>
        </div>
      )}

      {status === 'ready' && items.length > 0 && (
        <>
          <p className="text-xs text-gray-500">
            {items.length} slide, {activeCount} tampil di website. Slide ditampilkan berurutan sesuai nomor urutan.
            {activeCount === 0 && ' Karena tidak ada yang tampil, website memakai slide contoh bawaan.'}
          </p>
          <ul className="mt-3 space-y-3">
            {items.map((hero) => (
              <li key={hero.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[240px_minmax(0,1fr)_auto] md:items-center">
                <img
                  src={hero.image_url}
                  alt=""
                  loading="lazy"
                  className={`aspect-video w-full rounded-md bg-gray-100 object-cover md:w-[240px] ${hero.is_active ? '' : 'opacity-60'}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-base font-semibold text-gray-900">{hero.title}</h2>
                    <Badge active={hero.is_active} />
                  </div>
                  {hero.subtitle && <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-gray-600">{hero.subtitle}</p>}
                  <p className="mt-2 break-words text-xs text-gray-500">
                    Urutan {hero.sort_order}
                    {' · '}
                    {hero.cta_label && hero.cta_url ? `Tombol “${hero.cta_label}” menuju ${hero.cta_url}` : 'Tanpa tombol'}
                  </p>
                </div>
                <div className="flex items-start gap-2 md:flex-col">
                  <button
                    type="button"
                    onClick={() => setDialog({ hero })}
                    aria-label={`Ubah slide ${hero.title}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError('')
                      setToDelete(hero)
                    }}
                    aria-label={`Hapus slide ${hero.title}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-red-700 hover:border-red-400 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {dialog && <HeroFormDialog hero={dialog.hero} onClose={() => setDialog(null)} onSaved={onSaved} />}

      {toDelete && (
        <ConfirmDialog
          title="Hapus slide ini?"
          message={`Slide “${toDelete.title}” beserta gambarnya akan dihapus permanen dan tidak bisa dikembalikan.`}
          busy={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
