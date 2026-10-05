import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function HowToShop() {
  const containerRef = useRef(null)

  const steps = [
    {
      id: 1,
      name: 'Pilih Produk',
      description: 'Cari dan pilih produk yang Anda inginkan dari katalog kami.',
    },
    {
      id: 2,
      name: 'Hubungi via WhatsApp',
      description: 'Klik tombol pesan, kirim detail pesanan Anda, dan tim kami akan membantu langsung.',
    },
    {
      id: 3,
      name: 'Pesanan Diproses',
      description: 'Konfirmasi pembayaran dan pengiriman diatur bersama tim kami.',
    }
  ]

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.from('.step-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      })
    }
  }, { scope: containerRef })

  return (
    <section id="cara-belanja" ref={containerRef} className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Mudah & Cepat</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cara Pesan</p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.id} className="step-card flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <span className="text-2xl font-bold">{step.id}</span>
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  {step.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}