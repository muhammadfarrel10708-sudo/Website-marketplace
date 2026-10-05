import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { site } from '../data/site'

export function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label={site.brand}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <g fill="#2f42d6">
          <rect x="6" y="8" width="5" height="22" transform="rotate(-18 8 19)" />
          <rect x="15" y="3" width="5" height="27" />
          <rect x="24" y="8" width="5" height="22" transform="rotate(18 26 19)" />
        </g>
      </svg>
      <span className={`text-lg font-extrabold leading-5 ${light ? 'text-white' : 'text-gray-900'}`}>{site.brand}</span>
    </Link>
  )
}

const linkClass = ({ isActive }) =>
  `border-b-2 py-2 text-sm font-medium transition-colors ${
    isActive ? 'border-brand text-brand' : 'border-transparent text-gray-900 hover:text-brand'
  }`

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Utama">
          {site.nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass}>
              {n.name}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-gray-800 xl:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-72 max-w-full bg-white p-6 shadow-xl">
            <div className="mb-6 flex justify-end">
              <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="rounded-md p-2">
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col" aria-label="Menu mobile">
              {site.nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-gray-100 py-3 text-sm font-medium ${isActive ? 'text-brand' : 'text-gray-900'}`
                  }
                >
                  {n.name}
                </NavLink>
              ))}
              <Link
                to="/pesan-sekarang"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-brand py-3 text-center text-sm font-semibold text-white"
              >
                Pesan Sekarang
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
