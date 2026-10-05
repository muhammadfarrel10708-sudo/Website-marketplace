import { siteConfig } from '../data/siteConfig'
import { products } from '../data/products'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import OrderLink from './OrderLink'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const containerRef = useRef(null)
  const modalRef = useRef(null)

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return 0 // For 'newest', assuming original array order is newest (or could sort by id)
  })

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.from('.market-header', {
        y: 20, opacity: 0, duration: 0.6,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
      })
    }
  }, { scope: containerRef })

  // Dengarkan pilihan kategori dari section Kategori
  useEffect(() => {
    const onSelect = (e) => setActiveCategory(e.detail)
    window.addEventListener('category-select', onSelect)
    return () => window.removeEventListener('category-select', onSelect)
  }, [])

  // Handle escape key for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProduct(null)
    }
    if (selectedProduct) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedProduct])

  const formatPrice = (price) => {
    if (!price) return 'Hubungi kami untuk harga'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  }

  const handleProductImageError = (e) => {
    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23eee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22146.5%22%20y%3D%22208.5%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
  }

  return (
    <section id="produk" ref={containerRef} className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="market-header text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Katalog Produk</h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
            Temukan berbagai produk pilihan kami. Pesan langsung lewat WhatsApp.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">

          {/* Search */}
          <div className="relative w-full md:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Category Filter */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6"
            >
              <option value="all">Semua Kategori</option>
              {siteConfig.categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6"
            >
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => {
                const categoryName = siteConfig.categories.find(c => c.id === product.categoryId)?.name || 'Kategori'
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={product.id}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={handleProductImageError}
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm p-4 text-center">
                          Belum ada gambar
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-xs text-gray-500 mb-1">{categoryName}</p>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2 flex-grow">
                        {product.name}
                      </h3>
                      <p className="text-emerald-600 font-bold mb-3">
                        {formatPrice(product.price)}
                      </p>
                      <button className="w-full bg-emerald-50 text-emerald-700 font-medium py-2 rounded-lg text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        Lihat Detail
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 text-emerald-600 font-medium hover:text-emerald-700"
            >
              Reset filter pencarian
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  className="relative flex w-full flex-col sm:flex-row transform overflow-hidden bg-white sm:rounded-2xl text-left shadow-xl transition-all sm:max-w-3xl sm:my-8"
                  ref={modalRef}
                >
                  <button
                    type="button"
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm sm:bg-gray-100"
                    onClick={() => setSelectedProduct(null)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="sm:w-1/2 aspect-square sm:aspect-auto bg-gray-100 relative">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={handleProductImageError}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-lg">
                        Belum ada gambar
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 sm:w-1/2 flex flex-col">
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 mb-2">
                        {siteConfig.categories.find(c => c.id === selectedProduct.categoryId)?.name}
                      </p>
                      <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-3xl font-bold text-emerald-600 mb-6">
                        {formatPrice(selectedProduct.price)}
                      </p>

                      <div className="prose prose-sm text-gray-500 mb-8">
                        <p>{selectedProduct.description || 'Hubungi kami untuk detail, spesifikasi, dan ketersediaan produk ini.'}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      <OrderLink
                        message={`Halo, saya tertarik dengan produk: ${selectedProduct.name}. Apakah masih tersedia?`}
                        className="w-full rounded-xl bg-emerald-600 px-3 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors"
                      >
                        Pesan via WhatsApp
                      </OrderLink>
                      <button
                        type="button"
                        className="w-full rounded-xl bg-white px-3 py-4 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedProduct(null)}
                      >
                        Kembali
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}