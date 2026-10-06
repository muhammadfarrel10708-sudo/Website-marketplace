import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import { categories, products } from '../../data/marketplace'
import { loadMine } from '../../data/reviewsStore'
import { useAuth } from '../../auth/useAuth'
import { getAdminMarketplace } from '../../api/marketplace'
import DummyImage from '../../components/DummyImage'

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

function Stat({ label, value, note }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  )
}

function NusatronDashboard({ user }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    getAdminMarketplace()
      .then((rows) => { if (alive) { setItems(rows); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [])

  const active = items.filter((p) => p.is_active).length
  const latest = items.slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name || 'Admin'}</h1>
          <p className="mt-1 text-sm text-gray-600">Ringkasan website Nusatron.</p>
        </div>
        <Link to="/admin/marketplace" className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Kelola Marketplace</Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Produk marketplace" value={status === 'ready' ? items.length : '–'} />
        <Stat label="Tampil di website" value={status === 'ready' ? active : '–'} />
        <Stat label="Disembunyikan" value={status === 'ready' ? items.length - active : '–'} />
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Produk terbaru</h2>
          <Link to="/admin/marketplace" className="text-sm font-medium text-brand hover:underline">Lihat semua</Link>
        </div>
        {status === 'error' && <p className="mt-4 text-sm text-red-700">Data marketplace belum bisa dimuat. Pastikan backend berjalan dan migrasi sudah dijalankan.</p>}
        {status === 'ready' && latest.length === 0 && <p className="mt-4 text-sm text-gray-600">Belum ada produk. Tambahkan lewat menu Produk.</p>}
        {latest.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((p, i) => (
              <div key={p.id} className="overflow-hidden rounded-lg border border-gray-200">
                <div className="aspect-[4/3] bg-gray-100">
                  {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <DummyImage seed={i} ratio="4 / 3" label="Gambar dummy" className="h-full w-full" />}
                </div>
                <p className="line-clamp-2 p-3 text-sm font-semibold text-gray-900">{p.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function DzikroundDashboard({ user }) {
  const data = useMemo(() => {
    // Semua ulasan: dummy + ulasan yang ditulis pengunjung di browser ini
    const reviews = products.flatMap((p) =>
      [...loadMine(p.id), ...p.reviews].map((r) => ({ ...r, productId: p.id, productName: p.name })),
    )
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    const perCategory = categories.map((c) => ({ ...c, count: products.filter((p) => p.categoryId === c.id).length }))
    const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)
    return { reviews, avg, perCategory, top, maxCount: Math.max(...perCategory.map((c) => c.count)) }
  }, [])

  const catName = (id) => categories.find((c) => c.id === id)?.name

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo, {user.name}</h1>
          <p className="mt-1 text-sm text-gray-600">Ringkasan katalog dan ulasan pembeli.</p>
        </div>
        <Link to="/marketplace" className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          Lihat Marketplace
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total produk" value={products.length} note="Data dummy" />
        <Stat label="Kategori" value={categories.length} />
        <Stat label="Total ulasan" value={data.reviews.length} />
        <Stat label="Rata-rata rating" value={data.avg.toFixed(1)} note="Dari semua ulasan" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="rounded-lg border border-gray-200 bg-white p-5 lg:col-span-2" aria-labelledby="h-kategori">
          <h2 id="h-kategori" className="text-base font-semibold text-gray-900">Produk per kategori</h2>
          <ul className="mt-5 space-y-4">
            {data.perCategory.map((c) => (
              <li key={c.id}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{c.name}</span>
                  <span className="font-semibold text-gray-900">{c.count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(c.count / data.maxCount) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 lg:col-span-3" aria-labelledby="h-terlaris">
          <h2 id="h-terlaris" className="text-base font-semibold text-gray-900">Produk terlaris</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="pb-2 pr-3 font-medium">#</th>
                  <th className="pb-2 pr-3 font-medium">Produk</th>
                  <th className="pb-2 pr-3 text-right font-medium">Terjual</th>
                  <th className="pb-2 text-right font-medium">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.top.map((p, i) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-3 text-gray-500">{i + 1}</td>
                    <td className="py-3 pr-3">
                      <Link to={`/marketplace/${p.id}`} className="font-medium text-gray-900 hover:text-brand">{p.name}</Link>
                      <p className="text-xs text-gray-500">{catName(p.categoryId)}</p>
                    </td>
                    <td className="py-3 pr-3 text-right font-semibold text-gray-900">{p.sold}</td>
                    <td className="py-3 text-right text-gray-700">{rupiah(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5" aria-labelledby="h-ulasan">
        <h2 id="h-ulasan" className="text-base font-semibold text-gray-900">Ulasan terbaru</h2>
        <ul className="mt-2 divide-y divide-gray-100">
          {data.reviews.slice(0, 5).map((r) => (
            <li key={r.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="sm:w-48 sm:flex-none">
                <p className="text-sm font-semibold text-gray-900">
                  {r.name}
                  {r.id.startsWith('me-') && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800">Baru</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{formatDate(r.date)}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-xs text-gray-600">
                  <StarIcon className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  {r.rating}
                  <span aria-hidden="true">|</span>
                  <Link to={`/marketplace/${r.productId}`} className="truncate hover:text-brand">{r.productName}</Link>
                </p>
                <p className="mt-1 break-words text-sm leading-6 text-gray-700">{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isNusatron = user?.site_key === 'nusatron' || user?.username === 'nusatron'
  return isNusatron ? <NusatronDashboard user={user} /> : <DzikroundDashboard user={user} />
}
