import { useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import Reveal from '../components/Reveal'
import DummyImage from '../components/DummyImage'
import CtaBanner from '../components/CtaBanner'
import { getPublicAboutPage } from '../api/aboutPage'
import { getSection } from '../api/sections'
import { site } from '../data/site'

function MapDummy() {
  const islands = [
    { cx: 90, cy: 120, rx: 70, ry: 22, r: 40 }, { cx: 300, cy: 190, rx: 85, ry: 9, r: 8 },
    { cx: 280, cy: 105, rx: 50, ry: 40, r: 0 }, { cx: 420, cy: 110, rx: 22, ry: 40, r: 15 },
    { cx: 560, cy: 125, rx: 65, ry: 35, r: 10 }, { cx: 420, cy: 205, rx: 55, ry: 6, r: 0 },
  ]
  const dots = [[70, 100], [110, 140], [280, 100], [300, 190], [345, 190], [420, 105], [440, 205], [570, 120], [600, 140], [250, 80]]
  return (
    <svg viewBox="0 0 680 260" className="w-full" role="img" aria-label="Ilustrasi sebaran pelanggan di Indonesia">
      {islands.map((o, i) => <ellipse key={i} cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} transform={`rotate(${o.r} ${o.cx} ${o.cy})`} fill="#c9c9c9" />)}
      {dots.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="13" fill="#444" fillOpacity=".55" /><circle cx={x} cy={y} r="4" fill="var(--color-brand)" /></g>)}
    </svg>
  )
}

function parseImageMeta(value, fallbackShape = 'square') {
  const base = { shape: fallbackShape, zoom: 1, offsetX: 0, offsetY: 0, ratio: 4 / 3 }
  if (!value) return base
  if (value === 'circle' || value === 'square') return { ...base, shape: value }
  try {
    const parsed = JSON.parse(value)
    const legacyX = Number.isFinite(Number(parsed.x)) ? Number(parsed.x) : 50
    const legacyY = Number.isFinite(Number(parsed.y)) ? Number(parsed.y) : 50
    return {
      shape: parsed.shape === 'circle' ? 'circle' : (parsed.shape === 'square' ? 'square' : fallbackShape),
      zoom: Number.isFinite(Number(parsed.zoom)) && Number(parsed.zoom) > 0 ? Number(parsed.zoom) : 1,
      offsetX: Number.isFinite(Number(parsed.offsetX)) ? Number(parsed.offsetX) : (-legacyX * 0.2 + 10),
      offsetY: Number.isFinite(Number(parsed.offsetY)) ? Number(parsed.offsetY) : (-legacyY * 0.2 + 10),
      ratio: Number.isFinite(Number(parsed.ratio)) && Number(parsed.ratio) > 0 ? Number(parsed.ratio) : base.ratio,
    }
  } catch { return base }
}

function AdjustedImage({ src, alt = '', ratio = '4 / 3', meta, className = '' }) {
  if (!src) return null
  const settings = parseImageMeta(meta, 'square')
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ transform: `translate(${settings.offsetX}%, ${settings.offsetY}%) scale(${settings.zoom})`, transformOrigin: 'center center' }}
      />
    </div>
  )
}

function CounterTitle({ title, subtitle, fallbackValue, fallbackLabel, fallbackSubtitle }) {
  const text = title || `${fallbackValue} ${fallbackLabel}`
  const match = text.match(/^(\d+\+)\s*(.*)$/)
  return (
    <div className="mx-auto max-w-xl px-6 py-14 text-center">
      <h2 className="text-5xl font-extrabold text-gray-900">
        {match ? <><span className="text-brand">{match[1]}</span> {match[2]}</> : text}
      </h2>
      <p className="mt-3 text-sm leading-6 text-gray-600">{subtitle || fallbackSubtitle}</p>
    </div>
  )
}

const fallback = {
  intro: [{ id: 'intro', content_one: `${site.brand} telah melayani lebih dari 120+ customer di berbagai Provinsi di Indonesia`, content_two: `Berdiri sejak ${site.since}, kami fokus pada pembuatan LED videotron, LED running text, dan advertising untuk instansi, perusahaan, sekolah, rumah ibadah, dan hotel.` }],
  testimonials: [
    { id: 't1', title: 'Budi Santoso', subtitle: 'PT Media Vision', meta_one: 'P2.5', content_one: 'LED-nya keren, kualitasnya mantap! Pemasangannya gesit dan rapi. Sekarang videotron di tempat kami benar-benar terlihat profesional, terang, dan jernih.' },
    { id: 't2', title: 'Andi Pratama', subtitle: 'Cafe & Resto Lumina', meta_one: 'P2.5', content_one: 'Pelayanan luar biasa! Proses pemasangan cepat, hasilnya rapi, dan kualitas LED-nya sangat memuaskan.' },
    { id: 't3', title: 'Rina Wijaya', subtitle: 'Hotel Contoh', meta_one: 'P3', content_one: 'Tim responsif dan hasil akhirnya sesuai harapan. Videotron ballroom kami tampil tajam untuk setiap acara.' },
  ],
  projects: ['Real X Club|Surabaya|P2.5','Sekolah Contoh|Malang|P2.5','Kebun Binatang|Surabaya|P4','Gedung Serbaguna|Sidoarjo|P3','Koarmada II|Surabaya|P2.5','Hotel Bintang|Surabaya|P1.86','Masjid Agung|Gresik|P4','Kampus Contoh|Surabaya|P2'].map((x, i) => { const [title, subtitle, meta_one] = x.split('|'); return { id: `p${i}`, title, subtitle, meta_one } }),
  brands: ['Brand A','Brand B','Brand C','Brand D','Brand E','Brand F','Brand G','Brand H','Brand I','Brand J','Brand K','Brand L'].map((title, i) => ({ id: `b${i}`, title })),
}

export default function About() {
  const [data, setData] = useState(fallback)
  const [sections, setSections] = useState({
    intro: { title: 'Tentang Kami', subtitle: '' },
    testimonials: { title: 'Pendapat Customer Kami', subtitle: '' },
    projects: { title: 'Project', subtitle: 'Hasil project yang telah dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.' },
    brands: { title: 'Brand', subtitle: `Survey kepuasan dan banyaknya brand yang telah bekerja sama dengan ${site.brand}.` },
  })

  useEffect(() => {
    const controller = new AbortController()
    Promise.allSettled([
      getPublicAboutPage(controller.signal),
      getSection('tentang_kami_intro', controller.signal),
      getSection('tentang_kami_testimonials', controller.signal),
      getSection('tentang_kami_projects', controller.signal),
      getSection('tentang_kami_brands', controller.signal),
    ]).then((results) => {
      if (results[0]?.status === 'fulfilled') {
        const page = results[0].value
        const hasData = page && Object.values(page).some((x) => Array.isArray(x) && x.length)
        if (hasData) setData((prev) => ({ ...prev, ...page }))
      }

      setSections((prev) => ({
        intro: results[1]?.status === 'fulfilled' && results[1].value ? results[1].value : prev.intro,
        testimonials: results[2]?.status === 'fulfilled' && results[2].value ? results[2].value : prev.testimonials,
        projects: results[3]?.status === 'fulfilled' && results[3].value ? results[3].value : prev.projects,
        brands: results[4]?.status === 'fulfilled' && results[4].value ? results[4].value : prev.brands,
      }))
    }).catch((err) => { if (err?.name !== 'AbortError') setData(fallback) })
    return () => controller.abort()
  }, [])

  const intro = data.intro?.[0]
  return (
    <>
      <PageTitle>{sections.intro.title}</PageTitle>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 lg:grid-cols-2">
        <Reveal>
          <p className="text-2xl font-bold leading-snug text-gray-900">{intro?.content_one || `${site.brand} telah melayani lebih dari 120+ customer di berbagai Provinsi di Indonesia`}</p>
          <p className="mt-4 text-sm leading-7 text-gray-600">{intro?.content_two || `Berdiri sejak ${site.since}, kami fokus pada pembuatan LED videotron, LED running text, dan advertising untuk instansi, perusahaan, sekolah, rumah ibadah, dan hotel.`}</p>
        </Reveal>
        <Reveal delay={0.1}><MapDummy /></Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold">{sections.testimonials.title}</h2>
          {sections.testimonials.subtitle && <p className="mx-auto -mt-6 mb-10 max-w-2xl text-center text-sm text-gray-600">{sections.testimonials.subtitle}</p>}
          <div className="grid gap-6 md:grid-cols-3">
            {data.testimonials.map((t, i) => (
              <Reveal key={t.id ?? i} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-xl bg-white p-5 shadow-md">
                  {t.image_url ? <AdjustedImage src={t.image_url} alt="" ratio="16 / 10" meta={t.meta_two} className="w-full rounded-lg" /> : <DummyImage seed={i + 2} ratio="16 / 10" label="Gambar dummy" className="rounded-lg" />}
                  <blockquote className="mt-4 flex-1 text-sm leading-6 text-gray-700">{t.content_one}</blockquote>
                  <figcaption className="mt-4 flex items-center justify-between"><span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">{t.title?.[0]}</span><span><span className="block text-xs font-bold">{t.title}</span><span className="block text-[11px] text-gray-500">{t.subtitle}</span></span></span><span className="rounded-md bg-brand px-3 py-1.5 text-center text-white"><span className="block text-[9px] leading-3">Type</span><span className="block text-sm font-bold leading-4">{t.meta_one || '-'}</span></span></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CounterTitle title={sections.projects.title} subtitle={sections.projects.subtitle} fallbackValue="120+" fallbackLabel="Project" fallbackSubtitle="Hasil project yang telah dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami." />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 pb-8 sm:grid-cols-3 lg:grid-cols-4">
        {data.projects.map((p, i) => <Reveal key={p.id ?? p.title}><div className="relative">{p.image_url ? <AdjustedImage src={p.image_url} alt="" ratio="4 / 3" meta={p.meta_two} className="w-full rounded-lg" /> : <DummyImage seed={i} ratio="4 / 3" className="rounded-lg" />}<div className="absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-lg bg-white/95 px-3 py-2"><span><span className="block text-xs font-bold text-gray-900">{p.title}</span><span className="block text-[11px] text-gray-500">{p.subtitle}</span></span><span className="rounded bg-brand px-2 py-1 text-[10px] font-bold text-white">Type {p.meta_one}</span></div></div></Reveal>)}
      </div>

      <CounterTitle title={sections.brands.title} subtitle={sections.brands.subtitle} fallbackValue="" fallbackLabel="Brand" fallbackSubtitle={`Survey kepuasan dan banyaknya brand yang telah bekerja sama dengan ${site.brand}.`} />
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-6 pb-16 sm:grid-cols-4 lg:grid-cols-6">
        {data.brands.filter((b) => b.image_url).map((b, i) => { const meta = parseImageMeta(b.meta_two, 'circle'); return <div key={b.id ?? i} className="flex aspect-square w-full items-center justify-center bg-white p-0"><div className={`relative h-full w-full overflow-hidden bg-white ${meta.shape === 'square' ? 'rounded-lg' : 'rounded-full'}`}><img src={b.image_url} alt="" className="absolute inset-0 h-full w-full object-contain" style={{ transform: `translate(${meta.offsetX}%, ${meta.offsetY}%) scale(${meta.zoom})`, transformOrigin: 'center center' }} /></div></div> })}
      </div>
      <CtaBanner />
    </>
  )
}
