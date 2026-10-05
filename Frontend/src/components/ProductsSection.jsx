import { useEffect, useState } from 'react'
import { getPublicProducts } from '../api/products'
import { getSection } from '../api/sections'
import { indoor, outdoor, runningText } from '../data/content'
import DummyImage from './DummyImage'
import Reveal from './Reveal'

const fallback = [
  { id: 'fallback-indoor', title: 'Videotron Indoor', description: 'Pilihan videotron indoor untuk berbagai kebutuhan profesional.', image_url: null, layout_variant: 'card_1', items: indoor, sort_order: 1, is_active: true },
  { id: 'fallback-outdoor', title: 'Videotron Outdoor', description: 'Pilihan videotron outdoor untuk area terbuka.', image_url: null, layout_variant: 'card_1', items: outdoor, sort_order: 2, is_active: true },
  { id: 'fallback-running', title: 'Running Text', description: 'Running text untuk kebutuhan informasi dan promosi.', image_url: null, layout_variant: 'card_2', items: runningText, sort_order: 3, is_active: true },
]

function Heading({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
    </div>
  )
}

function ProductImage({ product, seed, ratio = '4 / 3' }) {
  if (product.image_url) {
    return <img src={product.image_url} alt="" loading="lazy" className="h-full w-full object-cover" style={{ aspectRatio: ratio }} />
  }
  return <DummyImage seed={seed} ratio={ratio} label="Gambar dummy" className="w-full" />
}

function CardOne({ product, seed }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <ProductImage product={product} seed={seed} ratio="4 / 3" />
      <h3 className="mt-3 text-center text-sm font-semibold text-gray-900">{product.title}</h3>
      {product.description && <p className="mt-2 text-xs leading-5 text-gray-600">{product.description}</p>}
      <dl className="mt-4 space-y-3">
        {(product.items || []).map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <dt className="text-sm font-bold text-gray-900">{item.name}</dt>
            {item.text && <dd className="text-xs leading-5 text-gray-600">{item.text}</dd>}
          </div>
        ))}
      </dl>
    </article>
  )
}

function CardTwo({ product, seed }) {
  return (
    <article className="mt-6 grid items-start gap-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1.4fr]">
      <div>
        <ProductImage product={product} seed={seed} ratio="16 / 9" />
        <h3 className="mt-3 text-center text-sm font-semibold text-gray-900">{product.title}</h3>
        {product.description && <p className="mt-2 text-xs leading-5 text-gray-600">{product.description}</p>}
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {(product.items || []).map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <dt className="text-sm font-bold text-gray-900">{item.name}</dt>
            {item.text && <dd className="text-xs leading-5 text-gray-600">{item.text}</dd>}
          </div>
        ))}
      </dl>
    </article>
  )
}

export default function ProductsSection() {
  const [products, setProducts] = useState(fallback)
  const [title, setTitle] = useState('Produk Kami')
  const [subtitle, setSubtitle] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    Promise.allSettled([getPublicProducts(controller.signal), getSection('produk', controller.signal)]).then(([productsResult, sectionResult]) => {
      if (productsResult.status === 'fulfilled' && productsResult.value?.length) setProducts(productsResult.value)
      if (sectionResult.status === 'fulfilled' && sectionResult.value) {
        setTitle(sectionResult.value.title || 'Produk Kami')
        setSubtitle(sectionResult.value.subtitle || '')
      }
    })
    return () => controller.abort()
  }, [])

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Heading title={title} subtitle={subtitle} />
        <div className="grid gap-6 md:grid-cols-2">
          {products.filter((p) => p.layout_variant === 'card_1').map((product, index) => (
            <Reveal key={product.id} delay={index * 0.1}>
              <CardOne product={product} seed={index} />
            </Reveal>
          ))}
        </div>
        {products.filter((p) => p.layout_variant === 'card_2').map((product, index) => (
          <Reveal key={product.id} delay={index * 0.1}>
            <CardTwo product={product} seed={5 + index} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
