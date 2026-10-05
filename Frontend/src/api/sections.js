import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

// ---- Publik ----
export async function getSection(key, signal) {
  try {
    const res = await apiFetch(`/sections/${key}`, { signal })
    return res.data // null jika belum diseed di backend
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

// ---- Admin: wajib login ----
export async function updateSection(key, payload) {
  try {
    const res = await apiFetch(`/admin/sections/${key}`, { method: 'PUT', body: payload, token: readSession()?.token })
    return res.data
  } catch (err) {
    if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw err
  }
}
