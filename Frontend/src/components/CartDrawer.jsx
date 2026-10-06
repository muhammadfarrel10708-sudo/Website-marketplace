import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DummyImage from './DummyImage'
import QtyStepper from './QtyStepper'
import { sitePath } from '../data/site'
import { useWhatsApp } from '../data/settingsStore'
import { closeCart, removeItem, removeSelected, setAllSelected, setQty, toggleSelected, useCart } from '../data/cartStore'

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const checkoutCls = 'block w-full rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700'

export default function CartDrawer() {
  const { items, open } = useCart()
  const { number, orderLink } = useWhatsApp()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') closeCart() }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [open])

  if (!open) return null

  const selected = items.filter((i) => i.selected)
  const allSelected = items.length > 0 && selected.length === items.length
  const total = selected.reduce((sum, i) => sum + i.price * i.qty, 0)
  const waHref = orderLink(selected)

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Keranjang belanja">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">Keranjang{items.length > 0 && <span className="ml-1 text-sm font-medium text-gray-500">({items.length})</span>}</h2>
          <button ref={closeRef} type="button" aria-label="Tutup keranjang" onClick={closeCart} className="rounded-md p-2 text-gray-700 hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingCartIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
            <p className="mt-4 text-base font-semibold text-gray-900">Keranjang masih kosong</p>
            <p className="mt-1 text-sm text-gray-600">Pilih produk di marketplace lalu tekan Add to Cart.</p>
            <Link to={sitePath('/marketplace')} onClick={closeCart} className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              Lihat Marketplace
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-gray-800">
                <input type="checkbox" checked={allSelected} onChange={(e) => setAllSelected(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
                Pilih semua
              </label>
              <button type="button" onClick={removeSelected} disabled={selected.length === 0} className="font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline">
                Hapus yang dipilih
              </button>
            </div>

            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 py-4">
                  <input type="checkbox" aria-label={`Pilih ${i.name}`} checked={i.selected} onChange={() => toggleSelected(i.id)} className="mt-1 h-4 w-4 flex-none accent-[var(--color-brand)]" />
                  <Link to={sitePath(`/marketplace/${i.id}`)} onClick={closeCart} className="h-16 w-16 flex-none overflow-hidden rounded-md bg-gray-100">
                    {i.image_url
                      ? <img src={i.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                      : <DummyImage seed={i.seed} ratio="1 / 1" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={sitePath(`/marketplace/${i.id}`)} onClick={closeCart} className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 hover:text-brand">{i.name}</Link>
                    <p className="mt-1 text-sm font-bold text-brand">{rupiah(i.price)}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QtyStepper compact label={`Jumlah ${i.name}`} value={i.qty} onChange={(n) => setQty(i.id, n)} />
                      <button type="button" aria-label={`Hapus ${i.name}`} onClick={() => removeItem(i.id)} className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimasi total ({selected.length} produk)</span>
                <span className="text-lg font-bold text-gray-900">{rupiah(total)}</span>
              </div>
              {selected.length === 0 ? (
                <button type="button" disabled className={`${checkoutCls} cursor-not-allowed opacity-50`}>Checkout via WhatsApp</button>
              ) : waHref ? (
                <a href={waHref} target="_blank" rel="noopener noreferrer" className={checkoutCls}>Checkout via WhatsApp</a>
              ) : (
                <Link to={sitePath('/kontak')} onClick={closeCart} className={checkoutCls}>Checkout via WhatsApp</Link>
              )}
              {selected.length === 0 && <p className="mt-2 text-center text-xs text-gray-500">Centang produk yang ingin dipesan.</p>}
              {selected.length > 0 && !number && <p className="mt-2 text-center text-xs text-gray-500">Nomor WhatsApp belum diatur, Anda akan diarahkan ke halaman Kontak.</p>}
              <p className="mt-2 text-center text-xs text-gray-500">Harga final dikonfirmasi admin lewat WhatsApp.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
