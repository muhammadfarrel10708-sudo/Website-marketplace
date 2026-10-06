// Penyimpanan kecil (di memori) untuk pengaturan website yang diatur admin:
//  - "whatsapp"     : nomor tujuan tombol "Pesan via WhatsApp" + template pesannya
//  - "contact_page" : isi halaman Kontak + Kalkulator
// Dipakai lewat hook agar komponen otomatis tampil ulang saat data tiba / admin menyimpan.
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { getSiteConfig, getSiteKey } from './site'
import { getPublicSetting } from '../api/settings'

const STALE_MS = 30 * 1000
const cache = new Map() // `${site}:${key}` -> { value, at }
const inflight = new Map()
const listeners = new Set()

const k = (siteKey, key) => `${siteKey}:${key}`
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
const emit = () => listeners.forEach((fn) => fn())

export function primeSetting(key, value, siteKey = getSiteKey()) {
  cache.set(k(siteKey, key), { value, at: Date.now() })
  emit()
}

export function loadSetting(key, siteKey = getSiteKey()) {
  const id = k(siteKey, key)
  const hit = cache.get(id)
  if (hit && Date.now() - hit.at < STALE_MS) return Promise.resolve(hit.value)
  if (inflight.has(id)) return inflight.get(id)

  const req = getPublicSetting(key)
    .then((value) => {
      cache.set(id, { value, at: Date.now() })
      emit()
      return value
    })
    .catch(() => null) // gagal memuat: pakai nilai bawaan, dicoba lagi saat halaman dibuka berikutnya
    .finally(() => inflight.delete(id))
  inflight.set(id, req)
  return req
}

// undefined = belum dimuat, null = belum pernah diatur admin, object = nilai tersimpan
export function useSetting(key, siteKey = getSiteKey()) {
  const value = useSyncExternalStore(subscribe, () => cache.get(k(siteKey, key))?.value)
  useEffect(() => { loadSetting(key, siteKey) }, [key, siteKey])
  return value
}

// Pesan otomatis: "Halo, saya tertarik dengan produk: A (2 pcs), B. Apakah masih tersedia?"
// Jumlah hanya ditulis jika lebih dari 1. items: [{ name, qty }]
const itemLabel = ({ name, qty }) => (qty > 1 ? `${name} (${qty} pcs)` : name)
export const orderMessage = (items) => `Halo, saya tertarik dengan produk: ${items.map(itemLabel).join(', ')}. Apakah masih tersedia?`
export const productMessage = (name, qty = 1) => orderMessage([{ name, qty }])

export function makeWaLink(number, text) {
  const n = String(number || '').replace(/\D/g, '')
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text || '')}` : null
}

// Hook utama untuk semua tombol WhatsApp di website publik.
// Nomor diambil dari pengaturan admin; jika belum diisi, jatuh ke nomor di site.js (kosong = null).
export function useWhatsApp() {
  const wa = useSetting('whatsapp')
  const cfg = getSiteConfig()
  const number = (wa?.number || cfg.whatsapp || '').replace(/\D/g, '')
  const defaultText = wa?.default_message || cfg.waText

  const link = useCallback((text) => makeWaLink(number, text ?? defaultText), [number, defaultText])
  // Pesan produk selalu otomatis: nama produk yang sedang dibuka pengunjung ikut terkirim.
  const productLink = useCallback((name, qty = 1) => makeWaLink(number, productMessage(name, qty)), [number])
  // Checkout keranjang: beberapa produk sekaligus dalam satu pesan.
  const orderLink = useCallback((items) => (items.length ? makeWaLink(number, orderMessage(items)) : null), [number])

  return { number, link, productLink, orderLink }
}
