import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sitePath } from '../data/site'
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/solid'
import PageTitle from '../components/PageTitle'
import DummyImage from '../components/DummyImage'
import { categories as dzikCategories, products as dzikProducts } from '../data/marketplace'
import { getSiteKey } from '../data/site'
import { getPublicMarketplace } from '../api/marketplace'

const PAGE_SIZE = 10

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

// Daftar nomor halaman dengan elipsis, mis. 1 … 4 5 6 … 12
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, total, current, current - 1, current + 1])
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out = []
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
}

function Card({ p, categories }) {
  const cat = categories.find((c) => c.id === p.categoryId)?.name
  return (
    <Link
      to={sitePath(`/marketplace/${p.id}`)}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {p.image_url
        ? <div className="aspect-square bg-gray-100"><img src={p.image_url} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" /></div>
        : <DummyImage seed={p.seed} ratio="1 / 1" label="Gambar dummy" />}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] text-gray-500">{cat}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-gray-900 group-hover:text-brand">{p.name}</h3>
        <p className="mt-2 text-base font-bold text-brand">{rupiah(p.price)}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
          <StarIcon className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          {p.rating ?? '–'} <span aria-hidden="true">|</span> Terjual {p.sold}
        </p>
      </div>
    </Link>
  )
}


function MarketplaceView({ products, categories, loading = false, error = '', sub }) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('kategori') || 'all'
  const sort = params.get('urut') || 'default'
  const pageParam = parseInt(params.get('hal') || '1', 10) || 1

  // Setiap perubahan filter kembali ke halaman 1
  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries({ hal: '1', ...patch }).forEach(([k, v]) => {
      if (!v || v === 'all' || v === 'default' || (k === 'hal' && v === '1')) next.delete(k)
      else next.set(k, v)
    })
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = products.filter(
      (p) => (cat === 'all' || p.categoryId === cat) && (!term || p.name.toLowerCase().includes(term)),
    )
    if (sort === 'murah') list.sort((a, b) => a.price - b.price)
    if (sort === 'mahal') list.sort((a, b) => b.price - a.price)
    if (sort === 'terlaris') list.sort((a, b) => b.sold - a.sold)
    return list
  }, [q, cat, sort, products])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(Math.max(pageParam, 1), totalPages)
  const start = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  const goPage = (n) => {
    update({ hal: String(n) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const counts = useMemo(() => {
    const term = q.trim().toLowerCase()
    const inSearch = products.filter((p) => !term || p.name.toLowerCase().includes(term))
    const m = { all: inSearch.length }
    categories.forEach((c) => (m[c.id] = inSearch.filter((p) => p.categoryId === c.id).length))
    return m
  }, [q, products, categories])

  const chip = (active) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
      active ? 'border-brand bg-brand text-white' : 'border-gray-300 bg-white text-gray-800 hover:border-brand hover:text-brand'
    }`

  const pageBtn =
    'flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  return (
    <>
      <PageTitle sub={sub}>Marketplace</PageTitle>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Cari produk, mis. modul P3 atau power supply"
              aria-label="Cari produk"
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-2 focus:outline-brand"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => update({ urut: e.target.value })}
            aria-label="Urutkan produk"
            className="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand md:w-56"
          >
            <option value="default">Urutan awal</option>
            <option value="terlaris">Terlaris</option>
            <option value="murah">Harga terendah</option>
            <option value="mahal">Harga tertinggi</option>
          </select>
        </div>

        <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-2" role="group" aria-label="Kategori produk">
          <button type="button" className={chip(cat === 'all')} aria-pressed={cat === 'all'} onClick={() => update({ kategori: 'all' })}>
            Semua ({counts.all})
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => update({ kategori: c.id })}>
              {c.name} ({counts[c.id]})
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-600" aria-live="polite">
          {loading || error || !products.length ? '\u00a0' : filtered.length
            ? `Menampilkan ${start + 1}–${start + visible.length} dari ${filtered.length} produk`
            : 'Tidak ada produk yang cocok'}
        </p>

        {loading ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-gray-100" />)}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-lg border border-dashed border-red-300 bg-red-50 py-16 text-center text-sm text-red-700">{error}</div>
        ) : !products.length ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 py-16 text-center text-sm text-gray-600">Belum ada produk marketplace.</div>
        ) : visible.length ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {visible.map((p) => (
              <Card key={p.id} p={p} categories={categories} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-700">Produk tidak ditemukan. Coba kata kunci lain atau pilih kategori berbeda.</p>
            <button
              type="button"
              onClick={() => setParams({}, { replace: true })}
              className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Reset pencarian
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Halaman produk">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => goPage(page - 1)}
              aria-label="Halaman sebelumnya"
              className={`${pageBtn} border-gray-300 bg-white text-gray-800 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-800`}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            {pageList(page, totalPages).map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} className="px-1 text-gray-500" aria-hidden="true">…</span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => goPage(n)}
                  aria-current={n === page ? 'page' : undefined}
                  aria-label={`Halaman ${n}`}
                  className={`${pageBtn} ${n === page ? 'border-brand bg-brand text-white' : 'border-gray-300 bg-white text-gray-800 hover:border-brand hover:text-brand'}`}
                >
                  {n}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => goPage(page + 1)}
              aria-label="Halaman berikutnya"
              className={`${pageBtn} border-gray-300 bg-white text-gray-800 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-800`}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
    </>
  )
}

function DzikroundMarketplace() {
  return <MarketplaceView products={dzikProducts} categories={dzikCategories} sub="Komponen dan perangkat LED Videotron, siap kirim ke seluruh Indonesia." />
}

// Produk Nusatron datang dari API (dikelola admin) dan dipetakan ke bentuk yang sama dengan Dzikround.
function NusatronMarketplace() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    getPublicMarketplace(controller.signal)
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => { if (err?.name !== 'AbortError') setError(err?.message || 'Gagal memuat produk.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const { items, cats } = useMemo(() => {
    const names = [...new Set(rows.map((r) => (r.category || '').trim()).filter(Boolean))]
    return {
      cats: names.map((n) => ({ id: n, name: n })),
      items: rows.map((r, i) => ({ ...r, categoryId: (r.category || '').trim(), seed: i, rating: r.rating != null ? r.rating.toFixed(1) : null })),
    }
  }, [rows])

  return <MarketplaceView products={items} categories={cats} loading={loading} error={error} sub="Komponen dan perangkat LED Videotron dari Nusatron." />
}

export default function Marketplace() {
  return getSiteKey() === 'nusatron' ? <NusatronMarketplace /> : <DzikroundMarketplace />
}
