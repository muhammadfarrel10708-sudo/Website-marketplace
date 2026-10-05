import { useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import DummyImage from '../components/DummyImage'
import Reveal from '../components/Reveal'
import CtaBanner from '../components/CtaBanner'
import { getPublicPortfolio } from '../api/portfolio'
import { getSection } from '../api/sections'
import { projects as fallbackProjects } from '../data/content'
import { site } from '../data/site'

const fallbackItems = fallbackProjects.map(([title, city, type], i) => ({ id: `fallback-${i}`, title, city, type }))

function AdjustedBrand({ brand }) {
  if (!brand.image_url) return null

  const zoom = Number(brand.zoom) > 0 ? Number(brand.zoom) : 1
  const positionX = Number.isFinite(Number(brand.position_x)) ? Number(brand.position_x) : 50
  const positionY = Number.isFinite(Number(brand.position_y)) ? Number(brand.position_y) : 50
  const offsetX = positionX - 50
  const offsetY = positionY - 50

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-white ${brand.shape === 'square' ? 'rounded-lg' : 'rounded-full'}`}
    >
      <img
        src={brand.image_url}
        alt=""
        draggable={false}
        className="absolute left-1/2 top-1/2 block h-full w-full max-w-none object-contain"
        style={{
          transform: `translate(-50%, -50%) translate(${offsetX}%, ${offsetY}%) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}

function PortfolioLightbox({ item, index, total, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    setClosing(false); setZoom(1)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey) }
  }, [item])

  const close = () => {
    if (closing) return
    setClosing(true)
    window.setTimeout(onClose, 220)
  }
  const wheel = (e) => { e.preventDefault(); setZoom((v) => Math.min(3, Math.max(1, Number((v + (e.deltaY < 0 ? 0.12 : -0.12)).toFixed(2))))) }

  return <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onMouseDown={(e) => { if (e.target === e.currentTarget) close() }} role="dialog" aria-modal="true" aria-label="Pratinjau foto project">
    <div className={`relative flex max-h-[92vh] max-w-[92vw] flex-col items-center transition-transform duration-200 ease-out ${closing ? 'scale-75' : 'scale-100'}`}>
      <div className="mb-3 flex w-full items-center justify-between gap-4 text-white"><span className="text-sm font-medium">{index + 1} dari {total}</span><button type="button" onClick={close} className="rounded-full bg-white/10 px-3 py-1.5 text-2xl leading-none hover:bg-white/20" aria-label="Tutup">×</button></div>
      <div className="relative flex max-h-[78vh] max-w-[88vw] items-center justify-center overflow-hidden rounded-xl bg-black/30 shadow-2xl" onWheel={wheel}>
        <div className="max-h-[78vh] max-w-[88vw] transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
          {item.image_url ? <img src={item.image_url} alt={item.title} className="block max-h-[78vh] max-w-[88vw] object-contain" draggable={false} /> : <DummyImage seed={index} ratio="4 / 3" label="Gambar dummy" className="w-[min(78vw,900px)]" />}
        </div>
        <button type="button" onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-3 text-2xl text-white hover:bg-black/65" aria-label="Foto sebelumnya">‹</button>
        <button type="button" onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-4 py-3 text-2xl text-white hover:bg-black/65" aria-label="Foto berikutnya">›</button>
      </div>
      <div className="mt-3 flex items-center gap-3 text-white"><span className="text-sm font-semibold">{item.title}</span><span className="text-xs text-white/60">{item.city} · {item.type}</span><button type="button" onClick={() => setZoom((v) => Math.min(3, Number((v + 0.2).toFixed(2))))} className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/20">+</button><button type="button" onClick={() => setZoom((v) => Math.max(1, Number((v - 0.2).toFixed(2))))} className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/20">−</button></div>
      <p className="mt-2 text-xs text-white/55">Klik foto untuk melihat lebih besar · Scroll untuk zoom</p>
    </div>
  </div>
}

export default function Portfolio() {
  const [items, setItems] = useState(fallbackItems)
  const [brands, setBrands] = useState([])
  const [sections, setSections] = useState({
    portofolio: { title: 'Portofolio Kami', subtitle: '' },
    project: { title: '120+ Project', subtitle: 'Hasil project Surabaya Videotron lebih dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.' },
    brand: { title: '80+ Brand', subtitle: 'Survey kepuasan dari banyaknya brand yang telah bekerja sama dengan Surabaya Videotron.' },
  })
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getPublicPortfolio(controller.signal),
      getSection('portofolio', controller.signal),
      getSection('portfolio_project', controller.signal),
      getSection('portfolio_brand', controller.signal),
    ]).then(([data, portofolio, project, brand]) => {
      if (data?.items?.length) setItems(data.items)
      if (data?.brands) setBrands(data.brands)
      setSections((prev) => ({ portofolio: portofolio || prev.portofolio, project: project || prev.project, brand: brand || prev.brand }))
    }).catch((err) => { if (err?.name !== 'AbortError') { /* fallback content remains visible */ } })
    return () => controller.abort()
  }, [])

  const open = (i) => setSelectedIndex(i)
  const selected = selectedIndex === null ? null : items[selectedIndex]
  const prev = () => setSelectedIndex((i) => i === null ? i : (i - 1 + items.length) % items.length)
  const next = () => setSelectedIndex((i) => i === null ? i : (i + 1) % items.length)

  return <>
    <PageTitle sub={sections.portofolio.subtitle || undefined}>{sections.portofolio.title || 'Portofolio Kami'}</PageTitle>
    <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 pb-14 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, i) => <Reveal key={item.id ?? i}>
        <button type="button" onClick={() => open(i)} className="group block w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand">
          <div className="relative overflow-hidden">{item.image_url ? <img src={item.image_url} alt={item.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /> : <DummyImage seed={i} ratio="4 / 3" label="Gambar dummy" className="transition duration-500 group-hover:scale-105" />}<span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">Klik untuk lihat</span></div>
          <span className="flex items-center justify-between gap-2 px-3 py-2.5"><span><span className="block text-xs font-bold text-gray-900">{item.title}</span><span className="block text-[11px] text-gray-500">{item.city}</span></span><span className="rounded bg-brand px-2 py-1 text-[10px] font-bold text-white">Type {item.type}</span></span>
        </button>
      </Reveal>)}
    </section>

    <section className="bg-white py-2">
      <div className="mx-auto max-w-xl px-6 py-12 text-center"><h2 className="text-5xl font-extrabold text-gray-900">{sections.project.title || '120+ Project'}</h2>{sections.project.subtitle && <p className="mt-3 text-sm leading-6 text-gray-600">{sections.project.subtitle}</p>}</div>
    </section>

    <section className="bg-white py-2"><div className="mx-auto max-w-xl px-6 py-12 text-center"><h2 className="text-5xl font-extrabold text-gray-900">{sections.brand.title || '80+ Brand'}</h2>{sections.brand.subtitle && <p className="mt-3 text-sm leading-6 text-gray-600">{sections.brand.subtitle}</p>}</div></section>
    <section className="bg-white pb-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 px-6 sm:grid-cols-3 lg:grid-cols-5">{brands.filter((b) => b.image_url).map((brand) => <Reveal key={brand.id}><AdjustedBrand brand={brand} /></Reveal>)}</div>
    </section>

    <CtaBanner />
    {selected && <PortfolioLightbox item={selected} index={selectedIndex} total={items.length} onClose={() => setSelectedIndex(null)} onPrev={prev} onNext={next} />}
  </>
}
