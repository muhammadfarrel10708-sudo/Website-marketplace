import { siteConfig } from '../data/siteConfig'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Intro() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.from('.intro-element', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      })
    }
  }, { scope: containerRef })

  return (
    <section id="tentang-toko" ref={containerRef} className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="intro-element text-base font-semibold leading-7 text-emerald-600">Tentang Kami</h2>
          <p className="intro-element mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-balance">
            {siteConfig.intro.heading}
          </p>
          <p className="intro-element mt-6 text-lg leading-8 text-gray-600 text-pretty">
            {siteConfig.intro.paragraph}
          </p>
        </div>
      </div>
    </section>
  )
}