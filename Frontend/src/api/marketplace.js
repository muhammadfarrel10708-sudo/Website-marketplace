import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicMarketplace(signal) {
  const res = await apiFetch('/marketplace-products', { signal, cache: false })
  return res.data ?? []
}

async function adminFetch(path, options = {}) {
  try { return await apiFetch(path, { ...options, token: readSession()?.token }) }
  catch (err) { if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT)); throw err }
}

export async function getAdminMarketplace() {
  const res = await adminFetch('/admin/marketplace-products')
  return res.data ?? []
}
export async function createMarketplaceProduct(formData) {
  const res = await adminFetch('/admin/marketplace-products', { method: 'POST', body: formData })
  return res.data
}
export async function updateMarketplaceProduct(id, formData) {
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/marketplace-products/${id}`, { method: 'POST', body: formData })
  return res.data
}
export function deleteMarketplaceProduct(id) { return adminFetch(`/admin/marketplace-products/${id}`, { method: 'DELETE' }) }

export async function getPublicMarketplaceProduct(id, signal) {
  const res = await apiFetch(`/marketplace-products/${id}`, { signal, cache: false })
  return res.data
}
export async function postMarketplaceReview(id, payload) {
  const res = await apiFetch(`/marketplace-products/${id}/reviews`, { method: 'POST', body: payload })
  return res.data
}
