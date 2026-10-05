import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

// ---- Publik: dipakai landing page ----
export async function getPublicHeroes(signal) {
  const res = await apiFetch('/heroes', { signal })
  return res.data
}

// ---- Admin: wajib login ----
async function adminFetch(path, options = {}) {
  try {
    return await apiFetch(path, { ...options, token: readSession()?.token })
  } catch (err) {
    // Token ditolak server (kedaluwarsa / dihapus): keluarkan admin dari dashboard
    if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw err
  }
}

export async function getAdminHeroes() {
  const res = await adminFetch('/admin/heroes')
  return res.data
}

export async function createHero(formData) {
  const res = await adminFetch('/admin/heroes', { method: 'POST', body: formData })
  return res.data
}

export async function updateHero(id, formData) {
  // Laravel tidak membaca file dari request PUT, jadi dikirim POST + _method=PUT
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/heroes/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deleteHero(id) {
  return adminFetch(`/admin/heroes/${id}`, { method: 'DELETE' })
}
