import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Heroes from './Heroes'
import AboutContents from './AboutContents'
import WorkSteps from './WorkSteps'
import Services from './Services'
import ServiceAreas from './ServiceAreas'
import Products from './Products'
import Articles from './Articles'
import Advantages from './Advantages'
import CompanyStats from './CompanyStats'

// Konten landing page dikelompokkan di satu menu "Landing Page".
// Layanan dan Artikel diakses dari dropdown sidebar agar mengikuti struktur navigasi website publik.
const tabs = [
  { key: 'hero', label: 'Hero Slider' },
  { key: 'tentang-kami-home', label: 'Tentang Kami (Home)' },
  { key: 'cara-kerja', label: 'Cara Kerja' },
  { key: 'layanan-home', label: 'Layanan (Home)' },
  { key: 'produk', label: 'Produk' },
  { key: 'area-layanan', label: 'Area Layanan' },
  { key: 'kenapa-pilih-kami', label: 'Kenapa Pilih Kami' },
  { key: 'statistik-perusahaan', label: 'Statistik Perusahaan' },
  { key: 'info-terbaru', label: 'Artikel Home' },
]

export default function HeroSection() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab') || 'hero'
  const supportedTabs = new Set([...tabs.map((tab) => tab.key), 'layanan', 'layanan-home', 'info-terbaru', 'tentang-kami'])
  const [active, setActive] = useState(supportedTabs.has(requestedTab) ? requestedTab : 'hero')

  useEffect(() => {
    const next = searchParams.get('tab') || 'hero'
    const normalized = next === 'tentang-kami' ? 'tentang-kami-home' : next === 'layanan' ? 'layanan-home' : next
    setActive(supportedTabs.has(normalized) ? normalized : 'hero')
  }, [searchParams])

  function selectTab(key) {
    setActive(key)
    setSearchParams(key === 'hero' ? {} : { tab: key })
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div role="tablist" aria-label="Bagian yang dikelola" className="flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            onClick={() => selectTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active === t.key ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {active === 'hero' && <Heroes embedded />}
        {active === 'info-terbaru' && <Articles placement="home" />}
        {active === 'tentang-kami-home' && <AboutContents />}
        {active === 'cara-kerja' && <WorkSteps />}
        {active === 'layanan-home' && <Services placement="home" />}
        {active === 'area-layanan' && <ServiceAreas />}
        {active === 'produk' && <Products />}
        {active === 'kenapa-pilih-kami' && <Advantages />}
        {active === 'statistik-perusahaan' && <CompanyStats />}
      </div>
    </div>
  )
}
