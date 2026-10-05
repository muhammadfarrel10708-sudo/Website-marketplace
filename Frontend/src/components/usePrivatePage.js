import { useEffect } from 'react'

// Judul tab + minta mesin pencari tidak mengindeks halaman login/admin
export function usePrivatePage(title) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} | Admin`
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.title = prev
      meta.remove()
    }
  }, [title])
}
