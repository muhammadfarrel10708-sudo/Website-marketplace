import { siteConfig } from './siteConfig'

// Link WhatsApp dengan pesan otomatis. Mengembalikan null jika nomor belum diisi.
export function getWhatsAppLink(message = siteConfig.whatsappText) {
  const number = siteConfig.whatsappNumber?.replace(/\D/g, '')
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
