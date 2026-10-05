// ============================================================================
// LAYANAN LOGIN (terhubung ke backend Laravel)
//
// login() memanggil POST /api/login. Password diperiksa di server (di-hash),
// server mengirim token. Token itu dikirim di setiap permintaan admin, dan
// server yang memutuskan boleh atau tidak (lihat src/api/heroes.js).
//
// Catatan keamanan: token disimpan di storage browser agar login bertahan.
// Karena itu situs ini tidak boleh memuat skrip pihak ketiga yang tidak
// dipercaya di halaman admin.
// ============================================================================
import { apiFetch } from '../api/client'

const SESSION_KEY = 'vt-admin-session'
const FALLBACK_SESSION_MS = 8 * 60 * 60 * 1000

// Dikirim saat server menolak token (401), didengar oleh AuthProvider
export const AUTH_EXPIRED_EVENT = 'vt-auth-expired'

export async function login(username, password) {
  const data = await apiFetch('/login', { method: 'POST', body: { username: username.trim(), password } })
  const expiresAt = Date.parse(data.expires_at)
  return {
    token: data.token,
    user: { username: data.user.username, name: data.user.name, role: data.user.role },
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : Date.now() + FALLBACK_SESSION_MS,
  }
}

// Mencabut token di server. Kegagalannya tidak menghalangi logout di browser.
export async function logoutRemote(token) {
  if (!token) return
  try {
    await apiFetch('/logout', { method: 'POST', token })
  } catch {
    /* diabaikan */
  }
}

const stores = () => {
  try {
    return [window.sessionStorage, window.localStorage]
  } catch {
    return []
  }
}

export function clearSession() {
  stores().forEach((s) => {
    try {
      s.removeItem(SESSION_KEY)
    } catch {
      /* diabaikan */
    }
  })
}

// Mengembalikan sesi yang sah, atau null (kosong, rusak, kedaluwarsa, tanpa token, bukan admin)
export function readSession() {
  for (const s of stores()) {
    try {
      const raw = s.getItem(SESSION_KEY)
      if (!raw) continue
      const data = JSON.parse(raw)
      const valid =
        data &&
        typeof data.token === 'string' &&
        data.token.length > 0 &&
        typeof data.expiresAt === 'number' &&
        data.expiresAt > Date.now() &&
        data.user?.role === 'admin' &&
        typeof data.user?.username === 'string'
      if (valid) return data
    } catch {
      /* data rusak: dianggap tidak ada */
    }
  }
  clearSession()
  return null
}

// remember = true -> tetap login setelah browser ditutup; false -> hilang saat tab ditutup
export function writeSession(session, remember) {
  clearSession()
  try {
    const target = remember ? window.localStorage : window.sessionStorage
    target.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* penyimpanan diblokir: sesi hanya hidup selama halaman terbuka */
  }
}
