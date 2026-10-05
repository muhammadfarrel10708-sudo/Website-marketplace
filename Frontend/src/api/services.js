import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

// ---- Publik: dipakai landing page & halaman /layanan ----
export async function getPublicServices(signal, placement = 'page') {
  const query = placement === 'home' ? '?placement=home' : '?placement=page'
  const res = await apiFetch(`/services${query}`, { signal })
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

export async function getAdminServices(placement = 'page') {
  const query = placement === 'home' ? '?placement=home' : '?placement=page'
  const res = await adminFetch(`/admin/services${query}`)
  return res.data
}

export async function createService(formData, placement = 'page') {
  formData.append('placement', placement)
  const res = await adminFetch('/admin/services', { method: 'POST', body: formData })
  return res.data
}

export async function updateService(id, formData) {
  formData.append('_method', 'PUT') // Laravel tidak membaca file dari request PUT
  const res = await adminFetch(`/admin/services/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deleteService(id) {
  return adminFetch(`/admin/services/${id}`, { method: 'DELETE' })
}
