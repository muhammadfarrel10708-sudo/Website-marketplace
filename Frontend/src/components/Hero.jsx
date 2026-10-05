import { siteConfig } from '../data/siteConfig'
import OrderLink from './OrderLink'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Hero() {
  const containerRef = useRef(null)

  useGSAP(() => {
    // Only animate if prefers-reduced-motion is false
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-element', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.2
      })
    }
  }, { scope: containerRef })

  return (
    <section id="beranda" ref={containerRef} className="relative flex min-h-svh items-center pt-28 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-100 to-emerald-50 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="hero-element text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
          {siteConfig.hero.headline}
        </h1>
        <p className="hero-element mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto text-pretty">
          {siteConfig.hero.valueProposition}
        </p>
        <div className="hero-element mt-10 flex items-center justify-center gap-x-6">
          <OrderLink className="rounded-full bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all">
            {siteConfig.hero.ctaText}
          </OrderLink>
          <a href="#produk" className="text-base font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-colors">
            Lihat Produk <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}