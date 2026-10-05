import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

// ---- Publik: dipakai landing page ----
export async function getPublicWorkSteps(signal) {
  const res = await apiFetch('/work-steps', { signal })
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

export async function getAdminWorkSteps() {
  const res = await adminFetch('/admin/work-steps')
  return res.data
}

export async function createWorkStep(payload) {
  const res = await adminFetch('/admin/work-steps', { method: 'POST', body: payload })
  return res.data
}

export async function updateWorkStep(id, payload) {
  const res = await adminFetch(`/admin/work-steps/${id}`, { method: 'PUT', body: payload })
  return res.data
}

export function deleteWorkStep(id) {
  return adminFetch(`/admin/work-steps/${id}`, { method: 'DELETE' })
}
