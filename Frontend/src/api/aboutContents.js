import { apiFetch } from './client'
import { AUTH_EXPIRED_EVENT, readSession } from '../auth/authService'

export async function getPublicAboutContents(signal) {
  const res = await apiFetch('/about-contents', { signal })
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

export async function getAdminAboutContents() {
  const res = await adminFetch('/admin/about-contents')
  return res.data
}

export async function createAboutContent(formData) {
  const res = await adminFetch('/admin/about-contents', { method: 'POST', body: formData })
  return res.data
}

export async function updateAboutContent(id, formData) {
  formData.append('_method', 'PUT')
  const res = await adminFetch(`/admin/about-contents/${id}`, { method: 'POST', body: formData })
  return res.data
}

export function deleteAboutContent(id) {
  return adminFetch(`/admin/about-contents/${id}`, { method: 'DELETE' })
}
