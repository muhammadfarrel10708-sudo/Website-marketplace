import { areas } from '../../data/content'
import Accordion from '../../components/Accordion'

export default function HomeServiceAreas() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Area Layanan</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bagian ini menampilkan konten Area Layanan yang saat ini tampil di Home website.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-gray-900">Area Layanan Nama Brand</h2>
        <p className="mt-1 text-sm text-gray-500">
          Data berikut mengikuti konten Area Layanan pada Home.
        </p>
        <div className="mt-5">
          <Accordion items={areas} />
        </div>
      </section>
    </div>
  )
}
