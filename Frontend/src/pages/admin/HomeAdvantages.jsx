import { ShieldCheckIcon, BanknotesIcon, WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/outline'
import { advantages } from '../../data/content'

const icons = {
  shield: ShieldCheckIcon,
  money: BanknotesIcon,
  wrench: WrenchScrewdriverIcon,
  clock: ClockIcon,
}

export default function HomeAdvantages() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kenapa Harus Pilih Kami?</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bagian ini menampilkan keunggulan perusahaan yang saat ini tampil di Home website.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-gray-900">Daftar keunggulan</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {advantages.map((item) => {
            const Icon = icons[item.icon]
            return (
              <article key={item.title} className="rounded-xl border border-gray-200 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                </span>
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
