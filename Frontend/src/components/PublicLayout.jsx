import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import { getSiteKey, getSiteTheme } from '../data/site'

// Kerangka website publik. Dzikround berada di root, Nusatron di /nusatron.
export default function PublicLayout() {
  const siteKey = getSiteKey()
  const theme = getSiteTheme(siteKey)

  useEffect(() => {
    document.title = `${siteKey === 'nusatron' ? 'Nusatron' : 'Dzikround'} | LED Videotron & Running Text`
  }, [siteKey])
  return (
    <div
      className="flex min-h-svh flex-col"
      style={{ '--color-brand': theme.brand, '--color-brand-dark': theme.dark, '--site-deep': theme.sidebar }}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
