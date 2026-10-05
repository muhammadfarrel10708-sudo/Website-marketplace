import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { AUTH_EXPIRED_EVENT, clearSession, login, logoutRemote, readSession, writeSession } from './authService'

export default function AuthProvider({ children }) {
  // Dibaca langsung saat pertama render agar tidak ada "kedip" ke halaman login
  const [session, setSession] = useState(readSession)

  const signIn = useCallback(async (username, password, remember) => {
    const next = await login(username, password) // melempar error jika salah
    writeSession(next, remember)
    setSession(next)
  }, [])

  const signOut = useCallback(() => {
    const token = readSession()?.token
    clearSession()
    setSession(null)
    logoutRemote(token) // cabut token di server (tanpa menunggu)
  }, [])

  // Keluar otomatis saat sesi habis
  useEffect(() => {
    if (!session) return
    const ms = session.expiresAt - Date.now()
    const t = setTimeout(signOut, Math.min(Math.max(ms, 0), 2 ** 31 - 1))
    return () => clearTimeout(t)
  }, [session, signOut])

  // Server menolak token (401): langsung keluar, tidak perlu memanggil logout lagi
  useEffect(() => {
    const onExpired = () => {
      clearSession()
      setSession(null)
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
  }, [])

  // Sinkron antar tab: logout di satu tab ikut mengeluarkan tab lain
  useEffect(() => {
    const onStorage = () => setSession(readSession())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => ({ user: session?.user ?? null, signIn, signOut }), [session, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
