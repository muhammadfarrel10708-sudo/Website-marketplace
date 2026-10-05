import { useEffect, useState } from 'react'
import { ShieldCheckIcon, BanknotesIcon, WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/outline'
import HeroSlider from '../components/HeroSlider'
import AboutIntroSection from '../components/AboutIntroSection'
import WorkSteps from '../components/WorkSteps'
import DummyImage from '../components/DummyImage'
import Reveal from '../components/Reveal'
import ProductsSection from '../components/ProductsSection'
import ServicesSection from '../components/ServicesSection'
import ArticleCard from '../components/ArticleCard'
import CtaBanner from '../components/CtaBanner'
import { advantages as fallbackAdvantages, articles as fallbackArticles } from '../data/content'
import AreaLayananSection from '../components/AreaLayananSection'
import { getPublicArticles } from '../api/articles'
import { getSection } from '../api/sections'
import { getPublicAdvantages } from '../api/advantages'
import { getPublicCompanyStats } from '../api/companyStats'

const icons = { shield: ShieldCheckIcon, money: BanknotesIcon, wrench: WrenchScrewdriverIcon, clock: ClockIcon }

function Heading({ children, sub }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">{children}</h2>
      {sub && <p className="mt-2 text-sm text-gray-600">{sub}</p>}
    </div>
  )
}

export default function Home() {
  const [latestArticles, setLatestArticles] = useState(fallbackArticles)
  const [latestTitle, setLatestTitle] = useState('Info Terbaru')
  const [advantageItems, setAdvantageItems] = useState(fallbackAdvantages.map((a) => ({ ...a, description: a.text })))
  const [advantageSection, setAdvantageSection] = useState({
    title: 'Kenapa Harus Pilih Kami?',
    subtitle: 'Jasa Videotron dan Jual LED Running Text',
  })
  const [companyStats, setCompanyStats] = useState([])
  const [companyStatsSection, setCompanyStatsSection] = useState({ title: 'Statistik Perusahaan Kami', subtitle: null })

  useEffect(() => {
    const controller = new AbortController()
    getPublicArticles('home', controller.signal).then((data) => setLatestArticles(data)).catch(() => {})
    getSection('info_terbaru', controller.signal).then((section) => { if (section?.title) setLatestTitle(section.title) }).catch(() => {})
    getPublicAdvantages(controller.signal).then((data) => setAdvantageItems(data)).catch(() => {})
    getSection('kenapa_pilih_kami', controller.signal).then((section) => { if (section) setAdvantageSection(section) }).catch(() => {})
    getPublicCompanyStats(controller.signal).then((data) => setCompanyStats(data)).catch(() => {})
    getSection('statistik_perusahaan', controller.signal).then((section) => { if (section) setCompanyStatsSection(section) }).catch(() => {})
    return () => controller.abort()
  }, [])

  return (
    <>
      <HeroSlider />

      {/* Tentang Kami / profil singkat */}
      <AboutIntroSection />

      {/* 3 langkah ("Cara Kerja") */}
      <WorkSteps />

      {/* Layanan */}
      <ServicesSection />

      {/* Produk */}
      <ProductsSection />

      {/* Area layanan */}
      <AreaLayananSection />

      {/* Kenapa pilih kami — data card berasal dari CRUD admin */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Heading sub={advantageSection.subtitle}>{advantageSection.title}</Heading>
          {advantageItems.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {advantageItems.map((a, i) => {
                const Icon = icons[a.icon] || ShieldCheckIcon
                return (
                  <Reveal key={a.id ?? a.title} delay={i * 0.08}>
                    <div className="h-full rounded-xl bg-white p-6 text-center shadow-sm">
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 font-bold text-gray-900">{a.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{a.description}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Statistik — tetap menjadi bagian dari alur Home setelah Kenapa Pilih Kami */}
      {companyStats.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <Heading sub={companyStatsSection.subtitle}>{companyStatsSection.title}</Heading>
          <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {companyStats.map((s) => (
              <div key={s.id ?? s.label}>
                <p className="text-4xl font-extrabold text-brand">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-700">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info terbaru */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Heading>{latestTitle}</Heading>
          <div className="grid gap-8 md:grid-cols-3">
            {latestArticles.slice(0, 3).map((a, i) => (
              <ArticleCard key={a.slug} article={a} seed={i + 1} showDate detailBase="/artikel/home" />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
