import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { getPublicWorkSteps } from '../api/workSteps'
import { getSection } from '../api/sections'
import { steps as dummySteps } from '../data/content'

const dummySection = { title: 'Cara Kerja', subtitle: null }

// Blok "Cara Kerja" (dulu tanpa judul). Mengambil judul & langkah dari backend;
// memakai judul dan 3 langkah contoh bawaan jika backend belum diisi/tidak menyala.
export default function WorkSteps() {
  const [section, setSection] = useState(dummySection)
  const [steps, setSteps] = useState(null) // null = masih memuat

  useEffect(() => {
    const controller = new AbortController()
    getSection('cara_kerja', controller.signal)
      .then((s) => s && setSection(s))
      .catch(() => {})
    getPublicWorkSteps(controller.signal)
      .then((rows) => setSteps(rows.length ? rows : null))
      .catch(() => setSteps(null))
    return () => controller.abort()
  }, [])

  const list = steps ?? dummySteps.map((s) => ({ title: s.title, text: s.text }))
  const labels = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima', 'Keenam']

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        {(section.title || section.subtitle) && (
          <div className="mb-10 text-center">
            {section.title && <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>}
            {section.subtitle && <p className="mt-2 text-sm text-gray-600">{section.subtitle}</p>}
          </div>
        )}
        <div className={`grid gap-6 ${list.length === 3 ? 'md:grid-cols-3' : list.length === 2 ? 'md:grid-cols-2' : list.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : ''}`}>
          {list.map((s, i) => (
            <Reveal key={s.id ?? s.title} delay={i * 0.1}>
              <div className="h-full rounded-xl bg-white p-6 shadow-sm">
                <p className="text-5xl font-extrabold text-brand">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Langkah {labels[i] ?? i + 1}
                </p>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
