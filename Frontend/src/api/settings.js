import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

// ---- Publik ----
// Mengembalikan nilai pengaturan, atau null jika admin belum pernah mengaturnya.
export async function getPublicSetting(key, signal) {
  const res = await apiFetch(`/settings/${key}`, { signal, cache: false })
  return res?.data ?? null
}

// ---- Admin: wajib login ----
export async function updateSetting(key, payload) {
  try {
    const res = await apiFetch(`/admin/settings/${key}`, { method: 'PUT', body: payload, token: readSession()?.token })
    return res?.data ?? null
  } catch (err) {
    if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw err
  }
}
