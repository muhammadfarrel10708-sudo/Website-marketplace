import { siteConfig } from '../data/siteConfig'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Categories() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.from('.cat-card', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      })
    }
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="py-16 bg-emerald-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Kategori Pilihan</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.categories.map((category, index) => (
            <div
              key={category.id}
              role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click() }} className="cat-card w-[calc(50%-0.5rem)] sm:w-48 bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-[box-shadow,border-color] cursor-pointer flex flex-col items-center justify-center min-h-24"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('category-select', { detail: category.id }))
                document.getElementById('produk')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}