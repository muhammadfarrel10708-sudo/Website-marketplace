import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicArticles(placement = 'home', signal) {
  const query = placement ? `?placement=${encodeURIComponent(placement)}` : ''
  const res = await apiFetch(`/articles${query}`, { signal })
  return res.data
}

export async function getPublicArticle(slug, placement = 'menu', signal) {
  const query = placement ? `?placement=${encodeURIComponent(placement)}` : ''
  const res = await apiFetch(`/articles/${encodeURIComponent(slug)}${query}`, { signal })
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

export async function getAdminArticles(placement = 'home') {
  const query = placement ? `?placement=${encodeURIComponent(placement)}` : ''
  const res = await adminFetch(`/admin/articles${query}`)
  return res.data
}

export async function createArticle(formData, placement = 'home') {
  formData.append('placement', placement)
  const res = await adminFetch('/admin/articles', { method: 'POST', body: formData })
  return res.data
}

export async function updateArticle(id, formData, placement = 'home') {
  formData.append('_method', 'PUT')
  formData.append('placement', placement)
  const res = await adminFetch(`/admin/articles/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deleteArticle(id) {
  return adminFetch(`/admin/articles/${id}`, { method: 'DELETE' })
}
