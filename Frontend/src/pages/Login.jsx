import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../auth/useAuth'
import { usePrivatePage } from '../components/usePrivatePage'
import DummyImage from '../components/DummyImage'
import { Logo } from '../components/Header'

const MAX_TRIES = 5
const LOCK_MS = 30_000

export default function Login() {
  const { user, signIn } = useAuth()
  const location = useLocation()
  usePrivatePage('Masuk')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [fails, setFails] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!lockedUntil) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [lockedUntil])

  const remaining = Math.max(0, Math.ceil((lockedUntil - now) / 1000))
  const locked = remaining > 0

  // Sudah login -> tidak perlu melihat form lagi
  if (user) {
    const from = location.state?.from
    const target = typeof from === 'string' && from.startsWith('/admin') ? from : '/admin'
    return <Navigate to={target} replace />
  }

  const submit = async (e) => {
    e.preventDefault()
    if (busy || locked) return
    if (!username.trim() || !password) {
      setError('Isi username dan password.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await signIn(username, password, remember)
      // berhasil: AuthProvider memperbarui user, lalu <Navigate> di atas mengalihkan ke /admin
    } catch (err) {
      const next = fails + 1
      if (next >= MAX_TRIES) {
        setFails(0)
        setNow(Date.now())
        setLockedUntil(Date.now() + LOCK_MS)
        setError('Terlalu banyak percobaan. Coba lagi beberapa saat lagi.')
      } else {
        setFails(next)
        setError(err.message || 'Login gagal. Coba lagi.')
      }
      setPassword('')
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-2 focus:outline-brand disabled:bg-gray-100'

  return (
    <div className="grid min-h-svh bg-white lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0e1433] lg:block">
        <DummyImage seed={0} ratio={null} className="absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1433] via-[#0e1433]/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo light />
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold leading-tight">Kelola konten website dalam satu tempat.</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">Halaman ini khusus admin. Pengunjung website tidak memerlukan akun.</p>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk sebagai admin</h1>
          <p className="mt-2 text-sm text-gray-600">Gunakan akun admin untuk membuka dashboard.</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-800">Username</label>
              <input
                id="username"
                className={field}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={busy || locked}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-800">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  className={`${field} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={busy || locked}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-brand"
                >
                  {show ? <EyeSlashIcon className="h-5 w-5" aria-hidden="true" /> : <EyeIcon className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-[#2f42d6]" />
              Ingat saya di perangkat ini
            </label>

            <button
              type="submit"
              disabled={busy || locked}
              className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locked ? `Coba lagi dalam ${remaining} detik` : busy ? 'Memeriksa…' : 'Masuk'}
            </button>
          </form>

          {import.meta.env.DEV && (
            <p className="mt-6 rounded-lg bg-gray-100 px-4 py-3 text-xs leading-5 text-gray-600">
              Mode pengembangan. Login memakai akun dari backend Laravel: username dan password diatur di file
              <b> .env </b> backend (ADMIN_USERNAME dan ADMIN_PASSWORD), lalu dibuat dengan <b>php artisan db:seed</b>.
              Petunjuk ini tidak muncul di versi produksi.
            </p>
          )}

          <Link to="/" className="mt-8 inline-block text-sm font-medium text-gray-700 hover:text-brand">
            &larr; Kembali ke website
          </Link>
        </div>
      </main>
    </div>
  )
}
