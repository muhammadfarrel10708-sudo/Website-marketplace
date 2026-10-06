import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, AtSymbolIcon, ChatBubbleLeftRightIcon, LinkIcon } from '@heroicons/react/24/solid'

const icons = {
  phone: PhoneIcon,
  whatsapp: ChatBubbleLeftRightIcon,
  email: EnvelopeIcon,
  instagram: AtSymbolIcon,
  facebook: AtSymbolIcon,
  tiktok: AtSymbolIcon,
  youtube: AtSymbolIcon,
  website: GlobeAltIcon,
  other: LinkIcon,
}

const bare = (v) => v.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?/i, '')
const url = (v) => (/^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim().replace(/^\/+/, '')}`)

// Tautan klik untuk tiap jenis kontak (null = hanya teks).
export function contactHref({ type, value }) {
  const v = (value || '').trim()
  if (!v) return null
  switch (type) {
    case 'phone': { const d = v.replace(/[^\d+]/g, ''); return d ? `tel:${d}` : null }
    case 'whatsapp': {
      let d = v.replace(/\D/g, '')
      if (d.startsWith('0')) d = `62${d.slice(1)}`
      return d ? `https://wa.me/${d}` : null
    }
    case 'email': return `mailto:${v}`
    case 'instagram': return /^https?:\/\//i.test(v) ? v : `https://instagram.com/${bare(v).split('/')[0]}`
    case 'tiktok': return /^https?:\/\//i.test(v) ? v : `https://tiktok.com/@${bare(v).split('/')[0]}`
    case 'facebook': return /^https?:\/\//i.test(v) ? v : `https://facebook.com/${bare(v).split('/')[0]}`
    case 'youtube': return /^https?:\/\//i.test(v) ? v : `https://youtube.com/@${bare(v).split('/')[0]}`
    case 'website': return url(v)
    case 'other': return /^(https?:\/\/|www\.)/i.test(v) ? url(v) : null
    default: return null
  }
}

// Satu baris kontak: ikon + teks (jadi tautan jika bisa).
export default function ContactItem({ item, className = 'flex items-center gap-3', iconClass = 'h-4 w-4 text-brand' }) {
  const Icon = icons[item.type] || LinkIcon
  const href = contactHref(item)
  const external = href && /^https?:/.test(href)
  return (
    <li className={className}>
      <Icon className={`${iconClass} flex-none`} aria-hidden="true" />
      {href ? (
        <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="break-words hover:underline">{item.value}</a>
      ) : (
        <span className="break-words">{item.value}</span>
      )}
    </li>
  )
}
