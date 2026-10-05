import { useState } from 'react'
import { needTypes, audiences, locations, pitches } from '../data/content'
import { site, waLink } from '../data/site'

const field = 'mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const label = 'mt-4 block text-xs font-semibold text-gray-800'

function recommend(f) {
  const w = parseFloat(f.lebar)
  const h = parseFloat(f.tinggi)
  const d = parseFloat(f.jarak)
  if (!(w > 0 && h > 0 && d > 0)) return { error: 'Lebar, tinggi, dan jarak pandang harus berupa angka lebih dari 0.' }

  const list = pitches[f.jenis]
  // Aturan praktis: jarak pandang terdekat (m) kira-kira sama dengan pixel pitch (mm)
  const pitch = [...list].reverse().find((p) => p <= d) ?? list[0]
  const minWidth = audiences.find(([name]) => name === f.audiens)?.[1] ?? 0
  const notes = []
  if (w < minWidth) notes.push(`Untuk jumlah audiens tersebut, disarankan lebar layar minimal sekitar ${minWidth} m.`)
  if (f.jenis === 'Videotron Indoor' && f.lokasi.includes('Outdoor')) notes.push('Anda memilih lokasi outdoor, sebaiknya gunakan tipe Videotron Outdoor.')
  if (f.jenis === 'Videotron Outdoor' && f.lokasi.includes('Indoor')) notes.push('Anda memilih lokasi indoor, sebaiknya gunakan tipe Videotron Indoor.')

  return {
    pitch,
    area: (w * h).toFixed(2),
    resolusi: `${Math.round((w * 1000) / pitch)} x ${Math.round((h * 1000) / pitch)} px`,
    modul: Math.ceil(w / 0.32) * Math.ceil(h / 0.16),
    notes,
  }
}

export default function CalculatorForm({ compact = false }) {
  const [f, setF] = useState({ jenis: '', audiens: '', lokasi: '', lebar: '', tinggi: '', jarak: '', wa: '', email: '' })
  const [result, setResult] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const ready = f.jenis && f.audiens && f.lokasi && f.lebar && f.tinggi && f.jarak && f.wa

  const submit = (e) => {
    e.preventDefault()
    setResult(recommend(f))
  }

  const summary = result && !result.error
    ? `Halo, saya ingin konsultasi kebutuhan videotron.\nJenis: ${f.jenis}\nAudiens: ${f.audiens}\nLokasi: ${f.lokasi}\nUkuran: ${f.lebar} m x ${f.tinggi} m\nJarak pandang terdekat: ${f.jarak} m\nRekomendasi: P${result.pitch} (${result.resolusi})\nWhatsApp saya: ${f.wa}`
    : ''
  const link = summary ? waLink(summary) : null

  return (
    <form onSubmit={submit} className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${compact ? '' : 'sm:p-8'}`}>
      <h2 className="text-2xl font-semibold text-gray-900">Kalkulator Kebutuhan Videotron</h2>
      <p className="mt-2 text-xs text-gray-700">Isi data berikut untuk mendapatkan rekomendasi videotron yang sesuai dengan kebutuhan Anda.</p>

      <label className={label}>Jenis Kebutuhan *
        <select required value={f.jenis} onChange={set('jenis')} className={field}>
          <option value="">Pilih Kebutuhan</option>
          {needTypes.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className={label}>Jumlah Target Audiens *
        <select required value={f.audiens} onChange={set('audiens')} className={field}>
          <option value="">Pilih Jumlah Audiens</option>
          {audiences.map(([o]) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className={label}>Lokasi Pemasangan *
        <select required value={f.lokasi} onChange={set('lokasi')} className={field}>
          <option value="">Pilih Lokasi</option>
          {locations.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className={label}>Estimasi Lebar Videotron (Meter) *
        <input required type="number" min="0.1" step="any" inputMode="decimal" placeholder="Contoh: 3" value={f.lebar} onChange={set('lebar')} className={field} />
      </label>
      <label className={label}>Estimasi Tinggi Videotron (Meter) *
        <input required type="number" min="0.1" step="any" inputMode="decimal" placeholder="Contoh: 2" value={f.tinggi} onChange={set('tinggi')} className={field} />
      </label>
      <label className={label}>Jarak Pandang Terdekat (Meter) *
        <input required type="number" min="0.1" step="any" inputMode="decimal" placeholder="Contoh: 3" value={f.jarak} onChange={set('jarak')} className={field} />
      </label>
      <label className={label}>WhatsApp *
        <input required type="tel" inputMode="tel" placeholder="08xxxxxxxxxx" value={f.wa} onChange={set('wa')} className={field} />
      </label>
      <label className={label}>Email (Opsional)
        <input type="email" placeholder="nama@email.com" value={f.email} onChange={set('email')} className={field} />
      </label>

      <button
        type="submit"
        disabled={!ready}
        className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-bold tracking-wide text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        Hitung Kebutuhan
      </button>

      {result && (
        <div className="mt-6 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm" role="status">
          {result.error ? (
            <p className="text-brand-dark">{result.error}</p>
          ) : (
            <>
              <p className="font-semibold text-gray-900">Rekomendasi: <span className="text-brand">P{result.pitch}</span> ({f.jenis})</p>
              <ul className="mt-2 space-y-1 text-gray-700">
                <li>Luas layar: {result.area} m²</li>
                <li>Resolusi perkiraan: {result.resolusi}</li>
                <li>Perkiraan modul (320 x 160 mm): {result.modul} pcs</li>
              </ul>
              {result.notes.map((n) => <p key={n} className="mt-2 text-xs text-gray-600">{n}</p>)}
              <p className="mt-3 text-xs text-gray-500">Ini estimasi awal. Spesifikasi dan harga final ditentukan setelah konsultasi dan survey.</p>
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full bg-green-500 px-5 py-2 text-xs font-semibold text-white hover:bg-green-600">
                  Kirim ke WhatsApp
                </a>
              ) : (
                <p className="mt-3 text-xs text-gray-500">Nomor WhatsApp {site.brand} belum diisi di src/data/site.js.</p>
              )}
            </>
          )}
        </div>
      )}
    </form>
  )
}
