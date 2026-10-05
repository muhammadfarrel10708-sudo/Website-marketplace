// Klien HTTP tunggal untuk semua panggilan ke backend Laravel.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors // { namaField: ['pesan', ...] } dari validasi Laravel (422)
  }
}

// path diawali "/" dan tanpa "/api", contoh: apiFetch('/heroes')
export async function apiFetch(path, { method = 'GET', body, token, signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let payload = body
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${API_URL}/api${path}`, { method, headers, body: payload, signal })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new ApiError('Tidak dapat terhubung ke server. Pastikan backend Laravel sedang berjalan.')
  }

  if (res.status === 204) return null

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
  return data
}
