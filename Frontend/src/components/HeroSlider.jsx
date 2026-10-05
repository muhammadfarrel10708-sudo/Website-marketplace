import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import DummyImage from './DummyImage'
import { getPublicHeroes } from '../api/heroes'
import { slides as dummySlides } from '../data/content'
import { site } from '../data/site'

// Dipakai selama admin belum menambah slide, atau saat backend tidak bisa dihubungi,
// supaya halaman utama tidak pernah kosong.
const fallbackSlides = dummySlides.map((s, i) => ({
  id: `dummy-${i}`,
  title: s.title,
  subtitle: `${site.brand} ${s.text}`,
  cta_label: 'Pesan Sekarang',
  cta_url: '/pesan-sekarang',
  image_url: null,
}))

const ctaClass =
  'mt-8 inline-block rounded-full bg-brand px-10 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors'

function CtaButton({ label, url }) {
  if (!label || !url) return null
  if (url.startsWith('/')) {
    return (
      <Link to={url} className={ctaClass}>
        {label}
      </Link>
    )
  }
  if (/^https?:\/\//i.test(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={ctaClass}>
        {label}
      </a>
    )
  }
  return null
}

function useHeroSlides() {
  const [state, setState] = useState({ ready: false, items: fallbackSlides })

  useEffect(() => {
    const ctrl = new AbortController()
    getPublicHeroes(ctrl.signal)
      .then((items) => setState({ ready: true, items: items.length ? items : fallbackSlides }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ ready: true, items: fallbackSlides })
      })
    return () => ctrl.abort()
  }, [])

  return state
}

function Carousel({ items }) {
  const [[index, dir], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const count = items.length
  const multiple = count > 1

  const go = (step) => setState(([i]) => [(i + step + count) % count, step])

  useEffect(() => {
    if (paused || !multiple) return
    const t = setInterval(() => setState(([i]) => [(i + 1) % count, 1]), 6000)
    return () => clearInterval(t)
  }, [paused, multiple, count])

  const slide = items[index % count]
  const arrow =
    'absolute z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gray-700/80 text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  return (
    <section
      className="relative overflow-hidden bg-white md:h-[640px]"
      aria-roledescription="carousel"
      aria-label="Highlight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={slide.id}
          custom={dir}
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -60 }}
          transition={{ duration: 0.35 }}
          className="md:absolute md:inset-0"
        >
          <div className="relative h-64 md:absolute md:inset-y-0 md:left-0 md:h-full md:w-2/3">
            {slide.image_url ? (
              <img src={slide.image_url} alt="" decoding="async" className="h-full w-full object-cover" />
            ) : (
              <DummyImage seed={index * 2} ratio={null} label="Gambar dummy" className="h-full w-full" />
            )}
            <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-white md:block" />
          </div>
          <div className="relative px-6 py-10 text-center md:absolute md:right-24 md:top-1/2 md:w-[40%] md:-translate-y-1/2 md:p-0 md:text-right">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">{slide.title}</h1>
            {slide.subtitle && <p className="mt-6 text-sm leading-7 text-gray-800 md:text-base">{slide.subtitle}</p>}
            <CtaButton label={slide.cta_label} url={slide.cta_url} />
          </div>
        </motion.div>
      </AnimatePresence>

      {multiple && (
        <>
          <button type="button" aria-label="Slide sebelumnya" onClick={() => go(-1)} className={`${arrow} left-4 top-28 md:top-1/2 md:-translate-y-1/2`}>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Slide berikutnya" onClick={() => go(1)} className={`${arrow} right-4 top-28 md:top-1/2 md:-translate-y-1/2`}>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 gap-2 md:flex">
            {items.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Ke slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-6 bg-brand' : 'w-2.5 bg-gray-400'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default function HeroSlider() {
  const { ready, items } = useHeroSlides()

  // Selama data dimuat, tampilkan kerangka setinggi slider agar layout tidak melompat
  if (!ready) {
    return (
      <section className="relative overflow-hidden bg-white md:h-[640px]" aria-busy="true" aria-label="Highlight">
        <div className="h-64 animate-pulse bg-gray-100 md:h-full md:w-2/3" />
      </section>
    )
  }

  return <Carousel items={items} />
}
