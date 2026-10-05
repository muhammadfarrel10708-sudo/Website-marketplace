import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicCompanyStats(signal) {
  const res = await apiFetch('/company-stats', { signal })
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

export async function getAdminCompanyStats() {
  const res = await adminFetch('/admin/company-stats')
  return res.data
}

export async function createCompanyStat(payload) {
  const res = await adminFetch('/admin/company-stats', { method: 'POST', body: payload })
  return res.data
}

export async function updateCompanyStat(id, payload) {
  const res = await adminFetch(`/admin/company-stats/${id}`, { method: 'PUT', body: payload })
  return res.data
}

export function deleteCompanyStat(id) {
  return adminFetch(`/admin/company-stats/${id}`, { method: 'DELETE' })
}
