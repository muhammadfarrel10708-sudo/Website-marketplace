import { useEffect, useState } from 'react'
import Accordion from './Accordion'
import { getPublicServiceAreas } from '../api/serviceAreas'
import { getSection } from '../api/sections'
import { areas as dummyAreas } from '../data/content'
import { site } from '../data/site'

const dummySection = { title: `Area Layanan ${site.brand}`, subtitle: null }

// Blok "Area Layanan ..." di Home: judul + accordion. Judul & daftar bisa diedit lewat admin.
export default function AreaLayananSection({ initialItems = null, initialSection = null }) {
  const [section, setSection] = useState(initialSection || dummySection)
  const [items, setItems] = useState(initialItems?.length ? initialItems : null) // null = pakai contoh bawaan

  useEffect(() => {
    if (Array.isArray(initialItems)) {
      setItems(initialItems.length ? initialItems : null)
      if (initialSection) setSection(initialSection)
      return undefined
    }
    const controller = new AbortController()
    getSection('area_layanan', controller.signal)
      .then((s) => s && setSection(s))
      .catch(() => {})
    getPublicServiceAreas(controller.signal)
      .then((rows) => setItems(rows.length ? rows : null))
      .catch(() => setItems(null))
    return () => controller.abort()
  }, [initialItems, initialSection])

  const list = (items ?? dummyAreas.map(([title, text], i) => ({ id: `dummy-${i}`, title, text }))).map((a) => [a.title, a.text])

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {(section.title || section.subtitle) && (
        <div className="mb-10 text-center">
          {section.title && <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>}
          {section.subtitle && <p className="mt-2 text-sm text-gray-600">{section.subtitle}</p>}
        </div>
      )}
      <Accordion items={list} />
    </section>
  )
}
