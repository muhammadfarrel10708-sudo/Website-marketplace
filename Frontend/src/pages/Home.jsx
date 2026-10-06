import { useEffect, useState } from 'react'
import { ShieldCheckIcon, BanknotesIcon, WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/outline'
import HeroSlider from '../components/HeroSlider'
import AboutIntroSection from '../components/AboutIntroSection'
import WorkSteps from '../components/WorkSteps'
import Reveal from '../components/Reveal'
import ProductsSection from '../components/ProductsSection'
import ServicesSection from '../components/ServicesSection'
import ArticleCard from '../components/ArticleCard'
import CtaBanner from '../components/CtaBanner'
import { advantages as fallbackAdvantages, articles as fallbackArticles } from '../data/content'
import AreaLayananSection from '../components/AreaLayananSection'
import { getPublicHome } from '../api/home'

const icons = { shield: ShieldCheckIcon, money: BanknotesIcon, wrench: WrenchScrewdriverIcon, clock: ClockIcon }

function Heading({ children, sub }) {
  return <div className="mb-10 text-center"><h2 className="text-3xl font-bold text-gray-900">{children}</h2>{sub && <p className="mt-2 text-sm text-gray-600">{sub}</p>}</div>
}

const emptyHome = { heroes: [], about_contents: [], work_steps: [], services: [], products: [], service_areas: [], advantages: [], company_stats: [], articles: [], sections: [] }

export default function Home() {
  const [home, setHome] = useState(emptyHome)
  const [loaded, setLoaded] = useState(false)

  // Satu permintaan /home untuk seluruh halaman. Bagian-bagian di bawah TIDAK boleh
  // mengambil data sendiri-sendiri, jadi mereka baru dirender setelah data ini tiba.
  useEffect(() => {
    const controller = new AbortController()
    getPublicHome(controller.signal)
      .then((data) => { setHome({ ...emptyHome, ...(data || {}) }); setLoaded(true) })
      .catch((err) => { if (err?.name !== 'AbortError') setLoaded(true) })
    return () => controller.abort()
  }, [])

  const sections = Object.fromEntries((home.sections || []).map((section) => [section.key, section]))
  const latestArticles = home.articles.length ? home.articles : fallbackArticles
  const advantages = home.advantages.length ? home.advantages : fallbackAdvantages.map((a) => ({ ...a, description: a.text }))
  const latestTitle = sections.info_terbaru?.title || 'Info Terbaru'
  const advantageSection = sections.kenapa_pilih_kami || { title: 'Kenapa Harus Pilih Kami?', subtitle: 'Jasa Videotron dan Jual LED Running Text' }
  const companyStatsSection = sections.statistik_perusahaan || { title: 'Statistik Perusahaan Kami', subtitle: null }

  if (!loaded) {
    return (
      <section className="relative overflow-hidden bg-white md:h-[640px]" aria-busy="true" aria-label="Memuat halaman">
        <div className="h-64 animate-pulse bg-gray-100 md:h-full md:w-2/3" />
      </section>
    )
  }

  return (
    <>
      <HeroSlider initialItems={home.heroes} />
      <AboutIntroSection initialItems={home.about_contents} />
      <WorkSteps initialSection={sections.cara_kerja || null} initialSteps={home.work_steps} />
      <ServicesSection initialSection={sections.layanan_home || null} initialServices={home.services} />
      <ProductsSection initialProducts={home.products} initialSection={sections.produk || null} />
      <AreaLayananSection initialItems={home.service_areas} initialSection={sections.area_layanan || null} />

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Heading sub={advantageSection.subtitle}>{advantageSection.title}</Heading>
          {advantages.length > 0 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a, i) => {
              const Icon = icons[a.icon] || ShieldCheckIcon
              return <Reveal key={a.id ?? a.title} delay={i * 0.08}><div className="h-full rounded-xl bg-white p-6 text-center shadow-sm"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand"><Icon className="h-7 w-7" aria-hidden="true" /></span><h3 className="mt-4 font-bold text-gray-900">{a.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{a.description}</p></div></Reveal>
            })}
          </div>}
        </div>
      </section>

      {home.company_stats.length > 0 && <section className="mx-auto max-w-5xl px-6 py-16"><Heading sub={companyStatsSection.subtitle}>{companyStatsSection.title}</Heading><div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">{home.company_stats.map((s) => <div key={s.id ?? s.label}><p className="text-4xl font-extrabold text-brand">{s.value}</p><p className="mt-1 text-sm font-medium text-gray-700">{s.label}</p></div>)}</div></section>}

      <section className="bg-gray-50 py-16"><div className="mx-auto max-w-6xl px-6"><Heading>{latestTitle}</Heading><div className="grid gap-8 md:grid-cols-3">{latestArticles.slice(0, 3).map((a, i) => <ArticleCard key={a.slug} article={a} seed={i + 1} showDate detailBase="/artikel/home" />)}</div></div></section>
      <CtaBanner />
    </>
  )
}
