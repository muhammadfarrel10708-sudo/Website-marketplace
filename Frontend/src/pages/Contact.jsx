import { useMemo } from 'react'
import { MapPinIcon } from '@heroicons/react/24/solid'
import CalculatorForm from '../components/CalculatorForm'
import ContactItem from '../components/ContactItem'
import { useSetting } from '../data/settingsStore'
import { resolveContactPage } from '../data/contactDefaults'

export default function Contact() {
  const saved = useSetting('contact_page')
  const page = useMemo(() => resolveContactPage(saved), [saved])

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <h1 className="text-3xl font-extrabold text-brand">{page.heading}</h1>
        {page.subheading && (
          <p className="mt-3 border-b border-gray-200 pb-4 text-xs leading-5 text-gray-700">{page.subheading}</p>
        )}
        <ul className="mt-4 space-y-3 text-xs text-gray-800">
          {page.items.map((item) => <ContactItem key={item.id} item={item} />)}
        </ul>

        {page.addresses.length > 0 && (
          <>
            {page.addresses_title && <h2 className="mt-8 text-xl font-extrabold text-brand">{page.addresses_title}</h2>}
            <ul className="mt-3 space-y-4 text-xs leading-5 text-gray-800">
              {page.addresses.map((a) => (
                <li key={a.id} className="flex gap-3"><MapPinIcon className="mt-0.5 h-4 w-4 flex-none text-brand" aria-hidden="true" />{a.value}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <CalculatorForm compact />
    </section>
  )
}
