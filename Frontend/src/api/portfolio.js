import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicPortfolio(signal) {
  return apiFetch('/portfolio', { signal })
}

export async function getPublicPortfolioBrands(signal) {
  const res = await apiFetch('/portfolio-brands', { signal })
  return res?.data ?? []
}

async function adminFetch(path, options = {}) {
  try {
    return await apiFetch(path, { ...options, token: readSession()?.token })
  } catch (err) {
    if (err.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw err
  }
}

export async function getAdminPortfolioItems() {
  const res = await adminFetch('/admin/portfolio-items')
  return res.data
}

export async function createPortfolioItem(formData) {
  const res = await adminFetch('/admin/portfolio-items', { method: 'POST', body: formData })
  return res.data
}

export async function updatePortfolioItem(id, formData) {
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/portfolio-items/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deletePortfolioItem(id) {
  return adminFetch(`/admin/portfolio-items/${id}`, { method: 'DELETE' })
}

export async function getAdminPortfolioBrands() {
  const res = await adminFetch('/admin/portfolio-brands')
  return res.data
}

export async function createPortfolioBrand(formData) {
  const res = await adminFetch('/admin/portfolio-brands', { method: 'POST', body: formData })
  return res.data
}

export async function updatePortfolioBrand(id, formData) {
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/portfolio-brands/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deletePortfolioBrand(id) {
  return adminFetch(`/admin/portfolio-brands/${id}`, { method: 'DELETE' })
}
