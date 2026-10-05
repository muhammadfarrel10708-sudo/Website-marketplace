import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicAdvantages(signal) {
  const res = await apiFetch('/advantages', { signal })
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

export async function getAdminAdvantages() {
  const res = await adminFetch('/admin/advantages')
  return res.data
}

export async function createAdvantage(payload) {
  const res = await adminFetch('/admin/advantages', { method: 'POST', body: payload })
  return res.data
}

export async function updateAdvantage(id, payload) {
  const res = await adminFetch(`/admin/advantages/${id}`, { method: 'PUT', body: payload })
  return res.data
}

export function deleteAdvantage(id) {
  return adminFetch(`/admin/advantages/${id}`, { method: 'DELETE' })
}
