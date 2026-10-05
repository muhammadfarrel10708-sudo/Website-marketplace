import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicProducts(signal) {
  const res = await apiFetch('/products', { signal })
  return res.data
}

async function adminFetch(path, options = {}) {
  try {
    return await apiFetch(path, { ...options, token: readSession()?.token })
  } catch (err) {
    if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw err
  }
}

export async function getAdminProducts() {
  const res = await adminFetch('/admin/products')
  return res.data
}

export async function createProduct(formData) {
  const res = await adminFetch('/admin/products', { method: 'POST', body: formData })
  return res.data
}

export async function updateProduct(id, formData) {
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/products/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deleteProduct(id) {
  return adminFetch(`/admin/products/${id}`, { method: 'DELETE' })
}
