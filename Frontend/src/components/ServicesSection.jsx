import { useEffect, useState } from 'react'
import ServiceGrid from './ServiceGrid'
import { getSection } from '../api/sections'
import { site } from '../data/site'

const dummySection = { title: 'Layanan Kami', subtitle: site.brand }

// Blok "Layanan Kami" di Home: judul + ServiceGrid khusus layanan Home.
export default function ServicesSection({ initialSection = null, initialServices = null }) {
  const [section, setSection] = useState(initialSection || dummySection)

  useEffect(() => {
    if (initialSection || Array.isArray(initialServices)) { if (initialSection) setSection(initialSection); return undefined }
    const controller = new AbortController()
    getSection('layanan_home', controller.signal)
      .then((s) => s && setSection(s))
      .catch(() => {})
    return () => controller.abort()
  }, [initialSection, initialServices])

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {(section.title || section.subtitle) && (
        <div className="mb-10 text-center">
          {section.title && <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>}
          {section.subtitle && <p className="mt-2 text-sm text-gray-600">{section.subtitle}</p>}
        </div>
      )}
      <ServiceGrid placement="home" initialItems={initialServices} />
    </section>
  )
}
