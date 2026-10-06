// Klien HTTP tunggal untuk semua panggilan ke backend Laravel.
import { getSiteKey } from '../data/site'

function requestSiteKey() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    try {
      const raw = window.localStorage.getItem('vt-admin-session') || window.sessionStorage.getItem('vt-admin-session')
      const session = raw ? JSON.parse(raw) : null
      return session?.user?.site_key || 'dzikround'
    } catch {
      return 'dzikround'
    }
  }
  return getSiteKey()
}
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const NUSATRON_CACHE_TTL = 60 * 1000
const NUSATRON_CACHE_PREFIX = 'vt-nusatron-public-cache-v4'
const inFlight = new Map()

function isNusatronPublicRequest(token) {
  return !token && requestSiteKey() === 'nusatron'
}

function cacheKey(path) {
  return `${NUSATRON_CACHE_PREFIX}:${path}`
}

export function clearNusatronPublicCache() {
  if (typeof window === 'undefined') return
  for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
    const key = window.localStorage.key(i)
    if (key?.startsWith(`${NUSATRON_CACHE_PREFIX}:`)) window.localStorage.removeItem(key)
  }
}

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors // { namaField: ['pesan', ...] } dari validasi Laravel (422)
  }
}

// path diawali "/" dan tanpa "/api", contoh: apiFetch('/heroes')
export async function apiFetch(path, { method = 'GET', body, token, signal, cache = true } = {}) {
  const headers = { Accept: 'application/json', 'X-Site-Key': requestSiteKey() }
  const cacheable = cache && method === 'GET' && isNusatronPublicRequest(token) && typeof window !== 'undefined'
  const key = cacheable ? cacheKey(path) : null

  if (cacheable) {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const cached = JSON.parse(raw)
        if (cached?.expires > Date.now()) return cached.data
        window.localStorage.removeItem(key)
      }
    } catch {
      // Cache tidak boleh menghambat request asli.
    }
    const pending = inFlight.get(key)
    if (pending) return withAbort(pending, signal)
  }

  if (token) headers.Authorization = `Bearer ${token}`
  let payload = body
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const request = (async () => {
    let res
    try {
      // Permintaan yang dibagi antar pemanggil (cache Nusatron) tidak boleh ikut dibatalkan
      // hanya karena salah satu pemanggilnya dibatalkan (mis. StrictMode memasang ulang efek).
      res = await fetch(`${API_URL}/api${path}`, { method, headers, body: payload, signal: cacheable ? undefined : signal })
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      throw new ApiError('Tidak dapat terhubung ke server. Pastikan backend Laravel sedang berjalan.')
    }

    if (res.status === 204) {
      if (method !== 'GET') clearNusatronPublicCache()
      return null
    }

    let data = null
    try {
      data = await res.json()
    } catch {
      /* respons bukan JSON */
    }

    if (!res.ok) {
      if (res.status === 429) throw new ApiError('Terlalu banyak percobaan. Coba lagi beberapa saat lagi.', 429)
      const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null
      throw new ApiError(firstError || data?.message || `Permintaan gagal (${res.status}).`, res.status, data?.errors ?? null)
    }

    if (method !== 'GET') clearNusatronPublicCache()
    if (cacheable && key) {
      try {
        window.localStorage.setItem(key, JSON.stringify({ expires: Date.now() + NUSATRON_CACHE_TTL, data }))
      } catch {
        // Abaikan jika storage penuh.
      }
    }
    return data
  })()

  if (cacheable) {
    inFlight.set(key, request)
    const clear = () => { if (inFlight.get(key) === request) inFlight.delete(key) }
    request.then(clear, clear)
    return withAbort(request, signal)
  }
  return request
}

// Menunggu promise bersama, tetapi tetap menolak dengan AbortError jika signal pemanggil dibatalkan.
function withAbort(promise, signal) {
  if (!signal) return promise
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('Aborted', 'AbortError'))
    if (signal.aborted) return abort()
    signal.addEventListener('abort', abort, { once: true })
    promise.then(
      (v) => { signal.removeEventListener('abort', abort); resolve(v) },
      (e) => { signal.removeEventListener('abort', abort); reject(e) },
    )
  })
}
