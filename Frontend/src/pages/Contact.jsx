import { PhoneIcon, EnvelopeIcon, MapPinIcon, GlobeAltIcon, AtSymbolIcon } from '@heroicons/react/24/solid'
import CalculatorForm from '../components/CalculatorForm'
import { site } from '../data/site'

export default function Contact() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <h1 className="text-3xl font-extrabold text-brand">Contact Now!</h1>
        <p className="mt-3 border-b border-gray-200 pb-4 text-xs leading-5 text-gray-700">
          Untuk informasi mengenai layanan pengadaan LED screen/videotron atau lainnya, silakan hubungi kami di:
        </p>
        <ul className="mt-4 space-y-3 text-xs text-gray-800">
          {site.phones.map((p) => (
            <li key={p} className="flex items-center gap-3"><PhoneIcon className="h-4 w-4 text-brand" aria-hidden="true" />{p}</li>
          ))}
          <li className="flex items-center gap-3"><EnvelopeIcon className="h-4 w-4 text-brand" aria-hidden="true" />{site.email}</li>
          {site.socials.map((s, i) => (
            <li key={i} className="flex items-center gap-3"><AtSymbolIcon className="h-4 w-4 text-brand" aria-hidden="true" />{s}</li>
          ))}
          <li className="flex items-center gap-3"><GlobeAltIcon className="h-4 w-4 text-brand" aria-hidden="true" />{site.website}</li>
        </ul>

        <h2 className="mt-8 text-xl font-extrabold text-brand">Alamat :</h2>
        <ul className="mt-3 space-y-4 text-xs leading-5 text-gray-800">
          {site.addresses.map((a) => (
            <li key={a} className="flex gap-3"><MapPinIcon className="mt-0.5 h-4 w-4 flex-none text-brand" aria-hidden="true" />{a}</li>
          ))}
        </ul>
      </div>
      <CalculatorForm compact />
    </section>
  )
}
