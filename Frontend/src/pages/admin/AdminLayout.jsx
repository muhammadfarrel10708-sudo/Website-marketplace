import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  CubeIcon,
  InboxIcon,
  PhotoIcon,
  Squares2X2Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../auth/useAuth'
import { usePrivatePage } from '../../components/usePrivatePage'
import { Logo } from '../../components/Header'
import { themes } from '../../data/site'

// Landing Page tetap berupa dropdown utama. Bagian Tentang Kami dibuat sebagai
// halaman admin tersendiri dan navigasinya memakai tab horizontal di dalam halaman.
function landingChildren(siteKey) {
  const prefix = siteKey === 'nusatron' ? '/nusatron' : ''
  return [
    { name: 'Home', to: '/admin/landing-page?tab=hero' },
    { name: 'Tentang Kami', to: '/admin/about-page?section=intro' },
    { name: 'Layanan', to: '/admin/services' },
    { name: 'Kalkulator Videotron', to: `${prefix}/kalkulator-videotron`, public: true },
    { name: 'Portofolio', to: '/admin/portfolio?section=items' },
    { name: 'Artikel', to: '/admin/articles' },
    { name: 'FAQ', to: `${prefix}/faq`, public: true },
    { name: 'Kontak', to: '/admin/contact-page' },
  ]
}

const menu = [
  { name: 'Dashboard', to: '/admin', icon: Squares2X2Icon },
  { name: 'Landing Page', to: '/admin/landing-page', icon: PhotoIcon, children: landingChildren },
  { name: 'Produk', to: '/admin/marketplace', icon: CubeIcon, site: 'nusatron' },
  { name: 'Ulasan', icon: ChatBubbleLeftRightIcon },
  { name: 'Pesan masuk', icon: InboxIcon },
  { name: 'Pengaturan', to: '/admin/settings', icon: Cog6ToothIcon },
]

function Sidebar({ onNavigate }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const inLanding = location.pathname.startsWith('/admin/landing-page') || location.pathname.startsWith('/admin/about-page') || location.pathname.startsWith('/admin/services') || location.pathname.startsWith('/admin/articles') || location.pathname.startsWith('/admin/portfolio') || location.pathname.startsWith('/admin/contact-page')
  const [landingOpen, setLandingOpen] = useState(inLanding)
  const [landingRendered, setLandingRendered] = useState(inLanding)
  const closeTimerRef = useRef(null)
  const item = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium'
  const isLandingActive = inLanding
  const siteKey = user?.username === 'nusatron' ? 'nusatron' : (user?.site_key === 'nusatron' ? 'nusatron' : 'dzikround')
  const children = landingChildren(siteKey)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  function openLanding() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setLandingRendered(true)
    requestAnimationFrame(() => setLandingOpen(true))
  }

  function closeLanding() {
    if (!landingRendered && !landingOpen) return

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
    }

    setLandingOpen(false)
    closeTimerRef.current = window.setTimeout(() => {
      setLandingRendered(false)
      closeTimerRef.current = null
    }, 660)
  }

  function toggleLanding() {
    if (landingOpen) {
      closeLanding()
      return
    }

    openLanding()
    navigate('/admin/landing-page?tab=hero')
  }

  function handleMainNavigate() {
    closeLanding()
    onNavigate?.()
  }

  return (
    <nav className="mt-8 flex-1 space-y-1" aria-label="Menu admin">
      {menu.map(({ name, to: rawTo, site: onlySite, icon: Icon, children: getChildren }) => {
        // Menu khusus satu website: untuk website lain tetap tampil sebagai "Segera" (tidak diubah).
        const to = onlySite && onlySite !== siteKey ? undefined : rawTo
        const children = typeof getChildren === 'function' ? getChildren(siteKey) : null
        if (children) {
          const menuOpen = landingOpen
          return (
            <div key={name}>
              <button
                type="button"
                onClick={toggleLanding}
                aria-expanded={menuOpen}
                className={`${item} w-full ${isLandingActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="flex-1 text-left">{name}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {landingRendered && (
                <div
                  className={`mt-1 space-y-0.5 border-l border-white/10 pl-8 ${landingOpen ? 'landing-dropdown-open' : 'landing-dropdown-closing'}`}
                  role="menu"
                  aria-hidden={!landingOpen}
                >
                  {children.map((child, index) => {
                    const active = !child.public && (
                      (child.name === 'Tentang Kami' && location.pathname === '/admin/about-page') ||
                      (child.name === 'Home' && location.pathname === '/admin/landing-page' && new URLSearchParams(location.search).get('tab') === 'hero') ||
                      (child.name === 'Layanan' && location.pathname === '/admin/services') ||
                      (child.name === 'Artikel' && location.pathname === '/admin/articles') ||
                      (child.name === 'Portofolio' && location.pathname === '/admin/portfolio') ||
                      (child.name === 'Kontak' && location.pathname === '/admin/contact-page')
                    )

                    return child.public ? (
                      <Link key={child.name} to={child.to} style={{ '--dropdown-index': index }} onClick={() => onNavigate?.()} className={`landing-dropdown-item flex items-center rounded-lg px-3 py-2 text-xs font-medium ${location.pathname === child.to ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{child.name}</Link>
                    ) : (
                      <NavLink key={child.name} to={child.to} style={{ '--dropdown-index': index }} onClick={() => onNavigate?.()} className={`landing-dropdown-item flex items-center rounded-lg px-3 py-2 text-xs font-medium ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{child.name}</NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }

        return to ? (
          <NavLink
            key={name}
            to={to}
            end
            onClick={handleMainNavigate}
            className={({ isActive }) =>
              `${item} ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {name}
          </NavLink>
        ) : (
          <span key={name} aria-disabled="true" className={`${item} cursor-not-allowed text-white/35`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
            {name}
            <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">Segera</span>
          </span>
        )
      })}
    </nav>
  )
}

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  usePrivatePage('Dashboard')
  const siteKey = user?.username === 'nusatron' || user?.site_key === 'nusatron' ? 'nusatron' : 'dzikround'
  const theme = themes[siteKey]
  const publicHome = siteKey === 'nusatron' ? '/nusatron' : '/'

  return (
    <div className="min-h-svh bg-gray-50" style={{ '--color-brand': theme.brand, '--color-brand-dark': theme.dark }}>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col p-5 lg:flex" style={{ backgroundColor: theme.sidebar }}>
        <Logo light brand={siteKey === 'nusatron' ? 'Nusatron' : 'Dzikround'} homePath={publicHome} />
        <Sidebar />
        <Link to={publicHome} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:text-white">
          <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
          Lihat website
        </Link>
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-full flex-col p-5" style={{ backgroundColor: theme.sidebar }}>
            <div className="flex items-center justify-between">
              <Logo light brand={siteKey === 'nusatron' ? 'Nusatron' : 'Dzikround'} homePath={publicHome} />
              <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="rounded-md p-2 text-white">
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-8">
          <button type="button" aria-label="Buka menu" onClick={() => setOpen(true)} className="rounded-md p-2 text-gray-800 lg:hidden">
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-4 text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand" aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
            Keluar
          </button>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
