import { useState } from 'react'
import ServiceAreas from './ServiceAreas'

// Bagian-bagian konten halaman utama (selain Hero/Cara Kerja/Layanan) dikumpulkan di satu menu ini
// lewat tab, supaya sidebar admin tidak bertambah panjang tiap ada bagian baru.
// Tab "Kenapa Pilih Kami" dan "Statistik" menyusul di sini.
const tabs = [{ key: 'area-layanan', label: 'Area Layanan' }]

export default function HomeContentSection() {
  const [active, setActive] = useState('area-layanan')

  return (
    <div>
      <div role="tablist" aria-label="Bagian yang dikelola" className="flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active === t.key ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-6">{active === 'area-layanan' && <ServiceAreas />}</div>
    </div>
  )
}
