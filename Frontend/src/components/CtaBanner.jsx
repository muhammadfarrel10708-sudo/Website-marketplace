import { Link } from 'react-router-dom'
import { sitePath } from '../data/site'
import DummyImage from './DummyImage'

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gray-900">
      <DummyImage seed={3} ratio={null} className="absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center text-white">
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
          Tunggu apalagi?
          <br />
          Yuk selesaikan pesanan Anda
        </h2>
        <Link
          to={sitePath("/pesan-sekarang")}
          className="mt-8 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          Pesan Sekarang
        </Link>
      </div>
    </section>
  )
}
