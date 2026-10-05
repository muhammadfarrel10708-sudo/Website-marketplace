import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

// Semua halaman di dalam route ini hanya bisa dibuka admin yang sudah login.
// Belum login -> langsung dialihkan ke /login (isi halaman tidak pernah dirender).
export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
