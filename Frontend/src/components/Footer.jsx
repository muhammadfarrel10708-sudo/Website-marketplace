import { QRCodeSVG } from 'qrcode.react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, GlobeAltIcon, AtSymbolIcon } from '@heroicons/react/24/solid'
import { site, waLink } from '../data/site'

export default function Footer() {
  const qrValue = waLink() || (typeof window !== 'undefined' ? window.location.origin : site.website)
  return (
    <footer className="bg-[#0e1433] text-white">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[auto_1fr_1fr] md:items-start">
        <div className="rounded bg-white p-2 justify-self-center md:justify-self-start">
          <QRCodeSVG value={qrValue} size={132} />
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">Alamat</h3>
          <ul className="space-y-4 text-xs leading-5 text-gray-200">
            {site.addresses.map((a) => (
              <li key={a} className="flex gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 flex-none text-brand" aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">Kontak</h3>
          <ul className="space-y-2 text-xs text-gray-200">
            {site.phones.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 text-brand" aria-hidden="true" />
                {p}
              </li>
            ))}
            <li className="flex items-center gap-3">
              <EnvelopeIcon className="h-4 w-4 text-brand" aria-hidden="true" />
              {site.email}
            </li>
            {site.socials.map((s, i) => (
              <li key={i} className="flex items-center gap-3">
                <AtSymbolIcon className="h-4 w-4 text-brand" aria-hidden="true" />
                {s}
              </li>
            ))}
            <li className="flex items-center gap-3">
              <GlobeAltIcon className="h-4 w-4 text-brand" aria-hidden="true" />
              {site.website}
            </li>
          </ul>
        </div>
      </div>
      <p className="pb-8 text-center text-xs font-semibold">
        &copy; {new Date().getFullYear()} {site.brand}. All Rights Reserved.
      </p>
    </footer>
  )
}
