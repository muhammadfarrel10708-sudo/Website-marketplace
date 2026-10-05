import { siteConfig } from '../data/siteConfig'
import { getWhatsAppLink } from '../data/whatsapp'

export default function Contact() {
  const waLink = getWhatsAppLink()
  const hasContact = Boolean(waLink || siteConfig.email || siteConfig.address)

  return (
    <section id="kontak" className="py-24 sm:py-32 bg-emerald-600">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Butuh Bantuan atau Info Produk?
        </h2>
        <p className="mt-4 text-lg leading-8 text-emerald-50">
          Hubungi {siteConfig.storeName} sekarang, kami siap membantu kebutuhan Anda.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              Chat via WhatsApp
            </a>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="w-full sm:w-auto rounded-full border border-white/70 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              Kirim Email
            </a>
          )}
        </div>

        {siteConfig.address && (
          <p className="mt-8 text-sm text-emerald-50">{siteConfig.address}</p>
        )}
        {!hasContact && (
          <p className="mt-8 text-sm text-emerald-100">
            Info kontak belum diisi. Lengkapi di src/data/siteConfig.js.
          </p>
        )}
      </div>
    </section>
  )
}
