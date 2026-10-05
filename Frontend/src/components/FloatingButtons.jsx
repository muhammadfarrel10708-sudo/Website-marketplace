import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserIcon, PhoneIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { waLink } from '../data/site'

const base = 'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105'

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false)
  const wa = waLink()

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-center gap-3">
      <Link to="/kontak" aria-label="Halaman kontak" className={`${base} bg-brand`}>
        <UserIcon className="h-6 w-6" aria-hidden="true" />
      </Link>
      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp" className={`${base} bg-green-500`}>
          <PhoneIcon className="h-6 w-6" aria-hidden="true" />
        </a>
      ) : (
        <Link to="/kontak" aria-label="Chat WhatsApp" className={`${base} bg-green-500`}>
          <PhoneIcon className="h-6 w-6" aria-hidden="true" />
        </Link>
      )}
      {showTop && (
        <button
          type="button"
          aria-label="Kembali ke atas"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`${base} h-10 w-10 bg-brand`}
        >
          <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
