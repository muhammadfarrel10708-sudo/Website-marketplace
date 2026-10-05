import { useEffect, useState } from 'react'
import DummyImage from './DummyImage'
import Reveal from './Reveal'
import { getPublicAboutContents } from '../api/aboutContents'
import { site } from '../data/site'

const fallback = [
  {
    id: 'fallback',
    title: `Supplier Jual Running Text & Videotron ${site.city}`,
    paragraph_one: `Lagi cari penyedia layanan pembuatan videotron yang aman, terpercaya, dan berpengalaman? ${site.brand} siap jadi solusinya.`,
    paragraph_two: `Kami melayani pembuatan videotron/megatron untuk kebutuhan indoor maupun outdoor, serta jasa pembuatan LED running text. Sejak ${site.since}, kami dipercaya berbagai instansi, perusahaan, sekolah, rumah ibadah, dan hotel.`,
    image_url: null,
  },
]

export default function AboutIntroSection() {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    const controller = new AbortController()
    getPublicAboutContents(controller.signal)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') setItems(fallback)
      })
    return () => controller.abort()
  }, [])

  return (
    <section aria-label="Tentang Kami">
      {items.slice(0, 1).map((item, index) => (
        <div key={item.id ?? index} className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <Reveal>
            {item.image_url ? (
              <img src={item.image_url} alt="" loading="lazy" className="aspect-[16/10] w-full rounded-2xl object-cover shadow-md" />
            ) : (
              <DummyImage seed={4 + index} ratio="16 / 10" label="Gambar dummy" className="rounded-2xl shadow-md" />
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold leading-tight text-gray-900">{item.title}</h2>
            {item.paragraph_one && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-700">{item.paragraph_one}</p>}
            {item.paragraph_two && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">{item.paragraph_two}</p>}
          </Reveal>
        </div>
      ))}
    </section>
  )
}
