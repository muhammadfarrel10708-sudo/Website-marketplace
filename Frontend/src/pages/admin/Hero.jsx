import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { createHero, deleteHero, getHeroImageUrl, getHeroes, updateHero } from '../../api/heroApi'

const emptyForm = { title: '', subtitle: '', cta: '', sort_order: 0, is_active: true, image: null }

function Status({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
      <CheckCircleIcon className="h-3.5 w-3.5" /> Aktif
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
      Nonaktif
    </span>
  )
}

export default function HeroAdmin() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState('')
  const fileRef = useRef(null)

  const sortedHeroes = useMemo(
    () => [...heroes].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0) || Number(a.id) - Number(b.id)),
    [heroes],
  )

  async function load() {
    setLoading(true)
    setError('')
    try {
      setHeroes(await getHeroes())
    } catch (err) {
      setError(err.message || 'Gagal mengambil data hero.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    return () => { if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview) }
  }, [preview])

  function openCreate() {
    setForm(emptyForm)
    setPreview('')
    setError('')
    setModal('create')
  }

  function openEdit(hero) {
    setForm({
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      cta: hero.cta || '',
      sort_order: hero.sort_order ?? 0,
      is_active: Boolean(hero.is_active),
      image: null,
    })
    setPreview(getHeroImageUrl(hero))
    setError('')
    setModal(hero)
  }

  function closeModal() {
    if (saving) return
    setModal(null)
    setPreview('')
    setForm(emptyForm)
  }

  function chooseImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Format gambar harus JPG, JPEG, PNG, atau WEBP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5 MB.')
      return
    }

    setError('')
    setForm((current) => ({ ...current, image: file }))
    const url = URL.createObjectURL(file)
    setPreview((old) => {
      if (old?.startsWith('blob:')) URL.revokeObjectURL(old)
      return url
    })
  }

  async function submit(event) {
    event.preventDefault()
    if (saving) return
    setError('')
    setNotice('')

    if (!form.title.trim()) {
      setError('Title wajib diisi.')
      return
    }
    if (modal === 'create' && !form.image) {
      setError('Gambar wajib dipilih.')
      return
    }

    const data = new FormData()
    data.append('title', form.title.trim())
    data.append('subtitle', form.subtitle.trim())
    data.append('cta', form.cta.trim())
    data.append('sort_order', String(Number(form.sort_order) || 0))
    data.append('is_active', form.is_active ? '1' : '0')
    if (form.image) data.append('image', form.image)

    setSaving(true)
    try {
      if (modal === 'create') {
        await createHero(data)
        setNotice('Hero berhasil ditambahkan.')
      } else {
        await updateHero(modal.id, data)
        setNotice('Hero berhasil diperbarui.')
      }
      closeModal()
      await load()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan hero.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(hero) {
    if (!window.confirm(`Hapus hero "${hero.title}"?`)) return
    setError('')
    setNotice('')
    try {
      await deleteHero(hero.id)
      setNotice('Hero berhasil dihapus.')
      await load()
    } catch (err) {
      setError(err.message || 'Gagal menghapus hero.')
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Konten website</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Hero</h1>
          <p className="mt-1 text-sm text-gray-600">Kelola slide hero yang tampil di halaman utama.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand disabled:opacity-50">
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            <PlusIcon className="h-4 w-4" /> Tambah Hero
          </button>
        </div>
      </div>

      {notice && <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</div>}
      {error && !modal && <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 shrink-0" />{error}</div>}

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Daftar Hero</h2>
          <p className="mt-1 text-xs text-gray-500">Urutan angka kecil akan tampil lebih dulu di slider.</p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Memuat data hero...</div>
        ) : sortedHeroes.length === 0 ? (
          <div className="p-10 text-center"><p className="font-semibold text-gray-900">Belum ada hero</p><p className="mt-1 text-sm text-gray-500">Tambahkan slide pertama untuk mengganti data dummy di landing page.</p></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedHeroes.map((hero) => (
              <article key={hero.id} className="grid gap-4 p-5 md:grid-cols-[180px_1fr_auto] md:items-center">
                <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                  <img src={getHeroImageUrl(hero)} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-gray-900">{hero.title}</h3>
                    <Status active={Boolean(hero.is_active)} />
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Urutan {hero.sort_order ?? 0}</span>
                  </div>
                  {hero.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{hero.subtitle}</p>}
                  {hero.cta && <p className="mt-1 text-xs font-medium text-brand">CTA: {hero.cta}</p>}
                </div>
                <div className="flex gap-2 md:flex-col">
                  <button type="button" onClick={() => openEdit(hero)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand"><PencilSquareIcon className="h-4 w-4" /> Edit</button>
                  <button type="button" onClick={() => remove(hero)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Hapus</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={modal === 'create' ? 'Tambah hero' : 'Edit hero'}>
          <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div><h2 className="font-bold text-gray-900">{modal === 'create' ? 'Tambah Hero' : 'Edit Hero'}</h2><p className="mt-0.5 text-xs text-gray-500">Data ini akan digunakan oleh hero slider di halaman utama.</p></div>
              <button type="button" onClick={closeModal} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><XMarkIcon className="h-5 w-5" /></button>
            </div>

            <div className="space-y-5 p-6">
              {error && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><ExclamationCircleIcon className="h-5 w-5 shrink-0" />{error}</div>}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">Gambar {modal === 'create' && <span className="text-red-500">*</span>}</label>
                <button type="button" onClick={() => fileRef.current?.click()} className="group block w-full overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 text-left hover:border-brand">
                  <div className="aspect-[16/7] overflow-hidden">
                    {preview ? <img src={preview} alt="Preview hero" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-gray-500">Klik untuk memilih gambar</div>}
                  </div>
                  <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500">JPG, JPEG, PNG, WEBP. Maksimal 5 MB.</div>
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="hidden" />
              </div>

              <div>
                <label htmlFor="hero-title" className="mb-1.5 block text-sm font-semibold text-gray-800">Title <span className="text-red-500">*</span></label>
                <input id="hero-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" placeholder="LED Videotron, Solusi Visual untuk Bisnis Anda" />
              </div>

              <div>
                <label htmlFor="hero-subtitle" className="mb-1.5 block text-sm font-semibold text-gray-800">Subtitle <span className="font-normal text-gray-400">(opsional)</span></label>
                <textarea id="hero-subtitle" rows="3" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="hero-cta" className="mb-1.5 block text-sm font-semibold text-gray-800">CTA <span className="font-normal text-gray-400">(opsional)</span></label>
                  <input id="hero-cta" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" placeholder="Pesan Sekarang" />
                </div>
                <div>
                  <label htmlFor="hero-order" className="mb-1.5 block text-sm font-semibold text-gray-800">Urutan</label>
                  <input id="hero-order" type="number" min="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-[#2f42d6]" />
                <span><span className="block text-sm font-semibold text-gray-800">Tampilkan di website</span><span className="block text-xs text-gray-500">Hero aktif akan masuk ke slider landing page.</span></span>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={closeModal} disabled={saving} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Batal</button>
              <button type="submit" disabled={saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Hero'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
