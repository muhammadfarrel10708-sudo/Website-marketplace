import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicAboutPage(signal) {
  const res = await apiFetch('/about-page', { signal })
  return res
}

async function adminFetch(path, options = {}) {
  try { return await apiFetch(path, { ...options, token: readSession()?.token }) }
  catch (err) { if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT)); throw err }
}

export async function getAdminAboutPageItems(section) {
  const res = await adminFetch(`/admin/about-page-items?section=${encodeURIComponent(section)}`)
  return res.data
}

export async function createAboutPageItem(formData) {
  const res = await adminFetch('/admin/about-page-items', { method: 'POST', body: formData })
  return res.data
}

export async function updateAboutPageItem(id, formData) {
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/about-page-items/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deleteAboutPageItem(id) {
  return adminFetch(`/admin/about-page-items/${id}`, { method: 'DELETE' })
}
