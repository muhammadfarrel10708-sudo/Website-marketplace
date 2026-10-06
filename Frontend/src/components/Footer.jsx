import { QRCodeSVG } from 'qrcode.react'
import { useMemo } from 'react'
import { MapPinIcon } from '@heroicons/react/24/solid'
import { site } from '../data/site'
import ContactItem from './ContactItem'
import { useSetting, useWhatsApp } from '../data/settingsStore'
import { resolveContactPage } from '../data/contactDefaults'

export default function Footer() {
  const { link } = useWhatsApp()
  const saved = useSetting('contact_page')
  const page = useMemo(() => resolveContactPage(saved), [saved])
  const qrValue = link() || (typeof window !== 'undefined' ? window.location.origin : site.website)
  return (
    <footer className="text-white" style={{ backgroundColor: 'var(--site-deep)' }}>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[auto_1fr_1fr] md:items-start">
        <div className="rounded bg-white p-2 justify-self-center md:justify-self-start">
          <QRCodeSVG value={qrValue} size={132} />
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">Alamat</h3>
          <ul className="space-y-4 text-xs leading-5 text-gray-200">
            {page.addresses.map((a) => (
              <li key={a.id} className="flex gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 flex-none text-brand" aria-hidden="true" />
                <span>{a.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">Kontak</h3>
          <ul className="space-y-2 text-xs text-gray-200">
            {page.items.map((item) => <ContactItem key={item.id} item={item} />)}
          </ul>
        </div>
      </div>
      <p className="pb-8 text-center text-xs font-semibold">
        &copy; {new Date().getFullYear()} {site.brand}. All Rights Reserved.
      </p>
    </footer>
  )
}
