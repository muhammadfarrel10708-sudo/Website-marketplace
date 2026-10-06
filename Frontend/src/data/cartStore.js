// Keranjang belanja pengunjung. Disimpan di browser (localStorage), terpisah untuk Dzikround & Nusatron.
// Checkout dilakukan lewat WhatsApp, jadi tidak ada data yang dikirim ke server.
import { useSyncExternalStore } from 'react'
import { getSiteKey } from './site'

const PREFIX = 'vt-cart-v1:'
export const MAX_QTY = 999

let state = { siteKey: null, items: [], open: false }
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export const clampQty = (n) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1))

function sanitize(raw) {
  if (!raw || raw.id === undefined || raw.id === null || typeof raw.name !== 'string' || !raw.name.trim()) return null
  return {
    id: String(raw.id),
    name: raw.name.trim(),
    price: Number(raw.price) > 0 ? Number(raw.price) : 0,
    image_url: typeof raw.image_url === 'string' && raw.image_url ? raw.image_url : null,
    seed: Number.isFinite(Number(raw.seed)) ? Number(raw.seed) : 0,
    qty: clampQty(raw.qty),
    selected: raw.selected !== false,
  }
}

function load(siteKey) {
  try {
    const list = JSON.parse(window.localStorage.getItem(PREFIX + siteKey) || '[]')
    return Array.isArray(list) ? list.map(sanitize).filter(Boolean) : []
  } catch {
    return []
  }
}

function snapshot() {
  const siteKey = getSiteKey()
  if (state.siteKey !== siteKey) state = { ...state, siteKey, items: typeof window === 'undefined' ? [] : load(siteKey) }
  return state
}

function commit(items) {
  const cur = snapshot()
  state = { ...cur, items }
  try { window.localStorage.setItem(PREFIX + cur.siteKey, JSON.stringify(items)) } catch { /* storage penuh / diblokir */ }
  emit()
}

if (typeof window !== 'undefined') {
  // Sinkron antar tab: keranjang berubah di tab lain -> muat ulang di sini.
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(PREFIX)) {
      state = { ...state, siteKey: null }
      emit()
    }
  })
}

// ---- Aksi ----
// product: { id, name, price, image_url, seed }. Produk yang sama ditambah jumlahnya.
export function addToCart(product, qty = 1) {
  const item = sanitize({ ...product, qty })
  if (!item) return
  const items = snapshot().items
  const found = items.find((i) => i.id === item.id)
  commit(found
    ? items.map((i) => (i.id === item.id ? { ...i, qty: clampQty(i.qty + item.qty), selected: true, price: item.price || i.price } : i))
    : [...items, item])
}
export const setQty = (id, qty) => commit(snapshot().items.map((i) => (i.id === String(id) ? { ...i, qty: clampQty(qty) } : i)))
export const toggleSelected = (id) => commit(snapshot().items.map((i) => (i.id === String(id) ? { ...i, selected: !i.selected } : i)))
export const setAllSelected = (selected) => commit(snapshot().items.map((i) => ({ ...i, selected })))
export const removeItem = (id) => commit(snapshot().items.filter((i) => i.id !== String(id)))
export const removeSelected = () => commit(snapshot().items.filter((i) => !i.selected))

export function openCart() { state = { ...snapshot(), open: true }; emit() }
export function closeCart() { state = { ...snapshot(), open: false }; emit() }

export function useCart() {
  return useSyncExternalStore((fn) => { listeners.add(fn); return () => listeners.delete(fn) }, snapshot, () => ({ siteKey: null, items: [], open: false }))
}
