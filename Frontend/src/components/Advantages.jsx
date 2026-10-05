import { siteConfig } from '../data/siteConfig'
import OrderLink from './OrderLink'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function Advantages() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.from('.adv-item', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      })
    }
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 items-center">

            {/* Left side: Text & List */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Kenapa Memilih Kami?
              </h2>
              <p className="mt-4 text-lg text-gray-500 mb-10">
                Kami berkomitmen memberikan pengalaman belanja terbaik untuk Anda.
              </p>

              <dl className="space-y-8">
                {siteConfig.advantages.map((adv) => (
                  <div key={adv.id} className="adv-item flex gap-x-4">
                    <dt className="flex-none">
                      <CheckCircleIcon className="h-7 w-7 text-emerald-500" aria-hidden="true" />
                    </dt>
                    <dd className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-900">{adv.title}</span>
                      <span className="mt-1 text-base leading-7 text-gray-600">{adv.description}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right side: Decorative block (since we don't have images) */}
            <div className="adv-item bg-emerald-50 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Siap untuk memesan?</h3>
                <OrderLink className="inline-flex rounded-full bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all">
                  Hubungi Kami
                </OrderLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}