import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <p className="mt-4 text-gray-700">Halaman tidak ditemukan.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white">Kembali ke Home</Link>
    </section>
  )
}
