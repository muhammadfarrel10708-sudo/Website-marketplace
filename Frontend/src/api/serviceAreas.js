import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

// ---- Publik: dipakai landing page ----
export async function getPublicServiceAreas(signal) {
  const res = await apiFetch('/service-areas', { signal })
  return res.data
}

// ---- Admin: wajib login ----
async function adminFetch(path, options = {}) {
  try {
    return await apiFetch(path, { ...options, token: readSession()?.token })
  } catch (err) {
    if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw err
  }
}

export async function getAdminServiceAreas() {
  const res = await adminFetch('/admin/service-areas')
  return res.data
}

export async function createServiceArea(payload) {
  const res = await adminFetch('/admin/service-areas', { method: 'POST', body: payload })
  return res.data
}

export async function updateServiceArea(id, payload) {
  const res = await adminFetch(`/admin/service-areas/${id}`, { method: 'PUT', body: payload })
  return res.data
}

export function deleteServiceArea(id) {
  return adminFetch(`/admin/service-areas/${id}`, { method: 'DELETE' })
}
