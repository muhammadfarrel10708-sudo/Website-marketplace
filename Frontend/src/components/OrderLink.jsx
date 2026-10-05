import { getWhatsAppLink } from '../data/whatsapp'

// Tombol pesan: ke WhatsApp jika nomor sudah diisi, jika belum ke section Kontak.
export default function OrderLink({ message, className, children, onClick }) {
  const wa = getWhatsAppLink(message)
  if (wa) {
    return (
      <a href={wa} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <a href="#kontak" className={className} onClick={onClick}>
      {children}
    </a>
  )
}
