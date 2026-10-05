import { site } from '../../data/site'

export default function HomeStats() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistik Perusahaan</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bagian ini menampilkan statistik perusahaan yang saat ini tampil di Home website.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-gray-900">Statistik Perusahaan Kami</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {site.stats.map((stat) => (
            <article key={stat.label} className="rounded-xl border border-gray-200 p-5 text-center">
              <p className="text-3xl font-extrabold text-brand">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-700">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
