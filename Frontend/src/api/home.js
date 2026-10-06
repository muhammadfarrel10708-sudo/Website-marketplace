import { apiFetch } from './client'

export async function getPublicHome(signal) {
  const res = await apiFetch('/home', { signal })
  return res
}
