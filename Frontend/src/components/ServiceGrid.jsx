import { useEffect, useState } from 'react'
import DummyImage from './DummyImage'
import Reveal from './Reveal'
import { getPublicServices } from '../api/services'
import { services as dummyServices } from '../data/content'

// Dipakai di Home dan di halaman /layanan. Placement menentukan daftar layanan yang dipakai.
// Mengambil daftar dari backend; memakai daftar contoh bawaan jika backend kosong/tidak menyala.
export default function ServiceGrid({ placement = 'page', initialItems = null }) {
  const [items, setItems] = useState(Array.isArray(initialItems) ? initialItems : null) // null = masih memuat

  useEffect(() => {
    if (Array.isArray(initialItems)) { setItems(initialItems); return undefined }
    const controller = new AbortController()
    getPublicServices(controller.signal, placement)
      .then((rows) => setItems(rows.length ? rows : null))
      .catch(() => setItems(null))
    return () => controller.abort()
  }, [placement, initialItems])

  const list = items ?? dummyServices.map((s, i) => ({ id: `dummy-${i}`, title: s.title, text: s.text, image_url: null }))

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {list.map((s, i) => (
        <Reveal key={s.id} delay={(i % 2) * 0.1} className="h-full">
          <div className="h-full rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-100 p-4 text-center shadow-sm">
            {s.image_url ? (
              <img src={s.image_url} alt="" loading="lazy" className="aspect-[3/2] w-full rounded-xl object-cover" />
            ) : (
              <DummyImage seed={i + 1} ratio="3 / 2" label="Gambar dummy" className="rounded-xl" />
            )}
            <h3 className="mt-5 text-base font-bold text-gray-900">{s.title}</h3>
            <p className="mx-auto mt-3 max-w-sm pb-4 text-sm leading-6 text-gray-600">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
