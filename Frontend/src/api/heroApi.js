const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

function authHeaders() {
  const token = localStorage.getItem('vt-admin-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const validationMessages = body?.errors ? Object.values(body.errors).flat().filter(Boolean) : []
    const message = validationMessages[0] || body?.message || `Request gagal (${response.status}).`
    throw new Error(message)
  }

  return body
}

export function getHeroImageUrl(hero) {
  if (!hero?.image) return ''
  if (/^https?:\/\//i.test(hero.image)) return hero.image
  if (hero.image_url) return hero.image_url
  const storageBase = API_BASE.replace(/\/api$/, '')
  return `${storageBase}/storage/${String(hero.image).replace(/^\//, '')}`
}

export async function getActiveHeroes() {
  const result = await request('/heroes/active')
  return result?.data || []
}

export async function getHeroes() {
  const result = await request('/heroes')
  return result?.data || []
}

export async function createHero(formData) {
  return request('/heroes', { method: 'POST', body: formData })
}

export async function updateHero(id, formData) {
  formData.append('_method', 'PUT')
  return request(`/heroes/${id}`, { method: 'POST', body: formData })
}

export async function deleteHero(id) {
  return request(`/heroes/${id}`, { method: 'DELETE' })
}
