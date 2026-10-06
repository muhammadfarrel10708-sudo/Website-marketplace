import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon, StarIcon } from '@heroicons/react/24/solid'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import QtyStepper from '../components/QtyStepper'
import { addToCart, openCart } from '../data/cartStore'
import DummyImage from '../components/DummyImage'
import { categories as dzikCategories, getProduct } from '../data/marketplace'
import { getSiteKey, sitePath } from '../data/site'
import { useWhatsApp } from '../data/settingsStore'
import { getPublicMarketplaceProduct, postMarketplaceReview } from '../api/marketplace'
import { loadMine, saveMine } from '../data/reviewsStore'

const COLLAPSED_HEIGHT = 168 // px, tinggi deskripsi saat diringkas

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

function Stars({ value, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex" role="img" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={`${className} ${n <= Math.round(value) ? 'text-amber-400' : 'text-gray-300'}`} aria-hidden="true" />
      ))}
    </span>
  )
}

// Deskripsi dengan tombol "Tampilkan selengkapnya" dan area blur di bawahnya
function Description({ text }) {
  const inner = useRef(null)
  const [open, setOpen] = useState(false)
  const [overflow, setOverflow] = useState(false)

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setOverflow(el.offsetHeight > COLLAPSED_HEIGHT + 24)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text])

  const collapsed = overflow && !open

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={collapsed ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
      >
        <div ref={inner} id="deskripsi-produk" className="whitespace-pre-line text-sm leading-7 text-gray-700">
          {text}
        </div>
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 flex h-28 items-end justify-center">
            {/* lapisan blur yang makin pekat ke bawah */}
            <div
              className="absolute inset-0 backdrop-blur-[3px]"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 70%)',
                maskImage: 'linear-gradient(to bottom, transparent, #000 70%)',
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/80 to-white" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded="false"
              aria-controls="deskripsi-produk"
              className="relative mb-1 flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Tampilkan selengkapnya
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {overflow && open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-expanded="true"
          aria-controls="deskripsi-produk"
          className="mx-auto mt-3 flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-semibold text-brand hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Tampilkan lebih sedikit
          <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function RatingPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div role="radiogroup" aria-label="Beri rating" className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} bintang`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="rounded p-0.5 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <StarIcon className={`h-8 w-8 transition-colors ${n <= shown ? 'text-amber-400' : 'text-gray-300'}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

function Reviews({ reviews, onSubmit }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const [busy, setBusy] = useState(false)
  const all = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date))
  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: all.filter((r) => r.rating === n).length }))

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!rating) next.rating = 'Pilih jumlah bintang dulu.'
    if (comment.trim().length < 5) next.comment = 'Tulis komentar minimal 5 karakter.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      await onSubmit({ name: name.trim() || 'Pembeli', rating, comment: comment.trim() })
    } catch (err) {
      setErrors({ comment: err?.message || 'Ulasan gagal dikirim. Coba lagi.' })
      setBusy(false)
      return
    }
    setBusy(false)
    setName('')
    setRating(0)
    setComment('')
    setSent(true)
  }

  const field =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-2 focus:outline-brand'

  return (
    <section aria-labelledby="judul-ulasan" className="mt-10 border-t border-gray-200 pt-8">
      <h2 id="judul-ulasan" className="text-xl font-bold text-gray-900">Ulasan pembeli</h2>

      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="text-center sm:w-40">
          <p className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</p>
          <div className="mt-1 flex justify-center"><Stars value={avg} className="h-5 w-5" /></div>
          <p className="mt-1 text-xs text-gray-500">{all.length} ulasan</p>
        </div>
        <ul className="flex-1 space-y-1.5" aria-label="Sebaran rating">
          {dist.map(({ n, count }) => (
            <li key={n} className="flex items-center gap-3 text-xs text-gray-600">
              <span className="w-10">{n} bintang</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <span className="block h-full rounded-full bg-amber-400" style={{ width: `${all.length ? (count / all.length) * 100 : 0}%` }} />
              </span>
              <span className="w-5 text-right">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={submit} noValidate className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h3 className="text-base font-semibold text-gray-900">Tulis ulasan Anda</h3>
        <div className="mt-4">
          <RatingPicker value={rating} onChange={(n) => { setRating(n); setSent(false) }} />
          {errors.rating && <p className="mt-1 text-xs text-red-600" role="alert">{errors.rating}</p>}
        </div>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="nama-ulasan" className="mb-1 block text-xs font-medium text-gray-700">Nama (boleh dikosongkan)</label>
            <input id="nama-ulasan" className={field} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="komentar-ulasan" className="mb-1 block text-xs font-medium text-gray-700">Komentar</label>
            <textarea
              id="komentar-ulasan"
              className={`${field} min-h-28 resize-y`}
              maxLength={500}
              value={comment}
              onChange={(e) => { setComment(e.target.value); setSent(false) }}
              placeholder="Ceritakan pengalaman Anda memakai produk ini"
              aria-invalid={Boolean(errors.comment)}
            />
            {errors.comment && <p className="mt-1 text-xs text-red-600" role="alert">{errors.comment}</p>}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className="rounded-full bg-brand px-8 py-2.5 disabled:opacity-60 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            {busy ? 'Mengirim…' : 'Kirim ulasan'}
          </button>
          {sent && <p className="text-sm font-medium text-green-700" role="status">Ulasan terkirim, terima kasih!</p>}
        </div>
      </form>

      {all.length === 0 && <p className="mt-8 text-sm text-gray-600">Belum ada ulasan. Jadilah yang pertama menulis ulasan.</p>}
      <ul className="mt-8 divide-y divide-gray-200">
        {all.map((r) => (
          <li key={r.id} className="flex gap-4 py-5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand" aria-hidden="true">
              {r.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <Stars value={r.rating} className="h-3.5 w-3.5" />
                <span className="text-xs text-gray-500">{formatDate(r.date)}</span>
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-gray-700">{r.comment}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Detail({ product, categories, reviews, onSubmitReview }) {
  const navigate = useNavigate()
  const cat = categories.find((c) => c.id === product.categoryId)?.name
  const { productLink } = useWhatsApp()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const wa = productLink(product.name, qty)
  const cta =
    'inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
  const ctaOutline =
    'inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand bg-white px-8 py-[10px] text-center text-sm font-semibold text-brand transition-colors hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 6000)
    return () => clearTimeout(t)
  }, [added])

  const onAdd = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url || null, seed: product.seed ?? 0 }, qty)
    setAdded(true)
  }

  // Kembali ke daftar dengan pencarian, kategori, dan halaman yang sama
  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate(sitePath('/marketplace')))

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-8">
      <button
        type="button"
        onClick={back}
        className="mb-5 inline-flex items-center gap-1 rounded text-sm font-medium text-gray-700 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        Kembali ke Marketplace
      </button>

      {product.image_url
        ? <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"><img src={product.image_url} alt={product.name} decoding="async" className="h-full w-full object-cover" /></div>
        : <DummyImage seed={product.seed} ratio="4 / 3" label="Gambar dummy" className="rounded-lg" />}

      <p className="mt-6 text-xs text-gray-500">{cat}</p>
      <h1 className="mt-1 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">{product.name}</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <Stars value={Number(product.rating) || 0} />
        <span>{product.rating ?? '–'}</span>
        <span aria-hidden="true">|</span>
        <span>Terjual {product.sold}</span>
      </p>

      <p className="mt-5 text-3xl font-bold text-brand">{rupiah(product.price)}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-sm font-medium text-gray-800">Jumlah</span>
        <QtyStepper value={qty} onChange={setQty} />
        {qty > 1 && <span className="text-sm text-gray-600">Total: <strong className="text-gray-900">{rupiah(product.price * qty)}</strong></span>}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onAdd} className={ctaOutline}>
          <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
          Add to Cart
        </button>
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={cta}>Pesan via WhatsApp</a>
        ) : (
          <Link to={sitePath("/kontak")} className={cta}>Pesan via WhatsApp</Link>
        )}
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-green-700">
        {added && (<>Ditambahkan ke keranjang. <button type="button" onClick={openCart} className="font-semibold underline">Lihat keranjang</button></>)}
      </p>

      <h2 className="mb-3 mt-10 text-xl font-bold text-gray-900">Deskripsi produk</h2>
      <Description text={product.description || 'Belum ada deskripsi untuk produk ini.'} />

      <Reviews reviews={reviews} onSubmit={onSubmitReview} />
    </article>
  )
}

function NotFoundProduct() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Produk tidak ditemukan</h1>
      <p className="mt-3 text-sm text-gray-600">Produk ini mungkin sudah dihapus atau alamatnya salah.</p>
      <Link to={sitePath("/marketplace")} className="mt-6 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        Lihat semua produk
      </Link>
    </section>
  )
}

function DzikroundDetail() {
  const { id } = useParams()
  const product = getProduct(id)
  if (!product) return <NotFoundProduct />
  return <DzikroundLoaded key={product.id} product={product} />
}

function DzikroundLoaded({ product }) {
  const [mine, setMine] = useState(() => loadMine(product.id))
  const submit = async ({ name, rating, comment }) => {
    const review = { id: `me-${Date.now()}`, name, rating, comment, date: new Date().toISOString() }
    const list = [review, ...mine]
    setMine(list)
    saveMine(product.id, list)
  }
  return <Detail product={product} categories={dzikCategories} reviews={[...mine, ...product.reviews]} onSubmitReview={submit} />
}

// Produk Nusatron: data dan ulasan dari backend.
function NusatronDetail() {
  const { id } = useParams()
  const [state, setState] = useState({ status: 'loading', product: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', product: null })
    getPublicMarketplaceProduct(id, controller.signal)
      .then((product) => setState({ status: 'ready', product }))
      .catch((err) => { if (err?.name !== 'AbortError') setState({ status: err?.status === 404 ? 'missing' : 'error', product: null, message: err?.message }) })
    return () => controller.abort()
  }, [id])

  if (state.status === 'loading') {
    return <div className="mx-auto max-w-3xl px-6 pb-16 pt-8"><div className="aspect-[4/3] animate-pulse rounded-lg bg-gray-100" /></div>
  }
  if (state.status === 'missing') return <NotFoundProduct />
  if (state.status === 'error') {
    return <section className="mx-auto max-w-xl px-6 py-24 text-center text-sm text-red-700">{state.message || 'Gagal memuat produk.'}</section>
  }
  return <NusatronLoaded key={state.product.id} initial={state.product} />
}

function NusatronLoaded({ initial }) {
  const [reviews, setReviews] = useState(initial.reviews || [])
  const submit = async (payload) => {
    const saved = await postMarketplaceReview(initial.id, payload)
    setReviews((prev) => [saved, ...prev])
  }
  const count = reviews.length
  const rating = count ? (reviews.reduce((a, r) => a + r.rating, 0) / count).toFixed(1) : null
  const category = (initial.category || '').trim()
  const product = { ...initial, rating, categoryId: category, seed: 0 }
  const cats = category ? [{ id: category, name: category }] : []
  return <Detail product={product} categories={cats} reviews={reviews} onSubmitReview={submit} />
}

export default function ProductDetail() {
  return getSiteKey() === 'nusatron' ? <NusatronDetail /> : <DzikroundDetail />
}
