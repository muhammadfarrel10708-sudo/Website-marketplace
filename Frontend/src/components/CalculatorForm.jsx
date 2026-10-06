import { useMemo, useState } from 'react'
import { site } from '../data/site'
import { useSetting, useWhatsApp } from '../data/settingsStore'
import { resolveContactPage } from '../data/contactDefaults'

const field = 'mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const label = 'mt-4 block text-xs font-semibold text-gray-800'

// Semua teks, pilihan dropdown, dan aturan hitung berasal dari pengaturan admin (menu Landing Page > Kontak).
function recommend(f, cfg) {
  const w = parseFloat(f.lebar)
  const h = parseFloat(f.tinggi)
  const d = parseFloat(f.jarak)
  if (!(w > 0 && h > 0 && d > 0)) return { error: 'Lebar, tinggi, dan jarak pandang harus berupa angka lebih dari 0.' }

  const jenis = cfg.fields.jenis.options.find((o) => o.label === f.jenis)
  const audiens = cfg.fields.audiens.options.find((o) => o.label === f.audiens)
  const lokasi = cfg.fields.lokasi.options.find((o) => o.label === f.lokasi)

  const list = (jenis?.pitches || []).map(Number).filter((n) => n > 0).sort((a, b) => a - b)
  if (!list.length) return { error: 'Pixel pitch untuk pilihan ini belum diatur. Silakan hubungi kami.' }

  // Aturan praktis: jarak pandang terdekat (m) kira-kira sama dengan pixel pitch (mm)
  const pitch = [...list].reverse().find((p) => p <= d) ?? list[0]
  const minWidth = Number(audiens?.min_width) || 0
  const notes = []
  if (w < minWidth) notes.push(`Untuk jumlah audiens tersebut, disarankan lebar layar minimal sekitar ${minWidth} m.`)
  if (jenis?.environment === 'indoor' && lokasi?.environment === 'outdoor') {
    const alt = cfg.fields.jenis.options.find((o) => o.environment === 'outdoor')
    notes.push(`Anda memilih lokasi outdoor, sebaiknya gunakan tipe${alt ? ` ${alt.label}` : ' untuk outdoor'}.`)
  }
  if (jenis?.environment === 'outdoor' && lokasi?.environment === 'indoor') {
    const alt = cfg.fields.jenis.options.find((o) => o.environment === 'indoor')
    notes.push(`Anda memilih lokasi indoor, sebaiknya gunakan tipe${alt ? ` ${alt.label}` : ' untuk indoor'}.`)
  }

  return {
    pitch,
    area: (w * h).toFixed(2),
    resolusi: `${Math.round((w * 1000) / pitch)} x ${Math.round((h * 1000) / pitch)} px`,
    modul: Math.ceil(w / 0.32) * Math.ceil(h / 0.16),
    notes,
  }
}

function Select({ cfg, value, onChange }) {
  return (
    <select required value={value} onChange={onChange} className={field}>
      <option value="">{cfg.placeholder}</option>
      {cfg.options.map((o) => <option key={o.id} value={o.label}>{o.label}</option>)}
    </select>
  )
}

export default function CalculatorForm({ compact = false }) {
  const saved = useSetting('contact_page')
  const cfg = useMemo(() => resolveContactPage(saved).calculator, [saved])
  const { link: waLink } = useWhatsApp()

  const [f, setF] = useState({ jenis: '', audiens: '', lokasi: '', lebar: '', tinggi: '', jarak: '', wa: '', email: '' })
  const [result, setResult] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const ready = f.jenis && f.audiens && f.lokasi && f.lebar && f.tinggi && f.jarak && f.wa

  const submit = (e) => {
    e.preventDefault()
    setResult(recommend(f, cfg))
  }

  const summary = result && !result.error
    ? `Halo, saya ingin konsultasi kebutuhan videotron.\nJenis: ${f.jenis}\nAudiens: ${f.audiens}\nLokasi: ${f.lokasi}\nUkuran: ${f.lebar} m x ${f.tinggi} m\nJarak pandang terdekat: ${f.jarak} m\nRekomendasi: P${result.pitch} (${result.resolusi})\nWhatsApp saya: ${f.wa}`
    : ''
  const link = summary ? waLink(summary) : null
  const { inputs } = cfg

  return (
    <form onSubmit={submit} className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${compact ? '' : 'sm:p-8'}`}>
      <h2 className="text-2xl font-semibold text-gray-900">{cfg.title}</h2>
      {cfg.description && <p className="mt-2 text-xs text-gray-700">{cfg.description}</p>}

      <label className={label}>{cfg.fields.jenis.label} *
        <Select cfg={cfg.fields.jenis} value={f.jenis} onChange={set('jenis')} />
      </label>
      <label className={label}>{cfg.fields.audiens.label} *
        <Select cfg={cfg.fields.audiens} value={f.audiens} onChange={set('audiens')} />
      </label>
      <label className={label}>{cfg.fields.lokasi.label} *
        <Select cfg={cfg.fields.lokasi} value={f.lokasi} onChange={set('lokasi')} />
      </label>
      <label className={label}>{inputs.lebar.label} *
        <input required type="number" min="0.1" step="any" inputMode="decimal" placeholder={inputs.lebar.placeholder} value={f.lebar} onChange={set('lebar')} className={field} />
      </label>
      <label className={label}>{inputs.tinggi.label} *
        <input required type="number" min="0.1" step="any" inputMode="decimal" placeholder={inputs.tinggi.placeholder} value={f.tinggi} onChange={set('tinggi')} className={field} />
      </label>
      <label className={label}>{inputs.jarak.label} *
        <input required type="number" min="0.1" step="any" inputMode="decimal" placeholder={inputs.jarak.placeholder} value={f.jarak} onChange={set('jarak')} className={field} />
      </label>
      <label className={label}>{inputs.wa.label} *
        <input required type="tel" inputMode="tel" placeholder={inputs.wa.placeholder} value={f.wa} onChange={set('wa')} className={field} />
      </label>
      <label className={label}>{inputs.email.label}
        <input type="email" placeholder={inputs.email.placeholder} value={f.email} onChange={set('email')} className={field} />
      </label>

      <button
        type="submit"
        disabled={!ready}
        className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-bold tracking-wide text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {cfg.button_label}
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
                <p className="mt-3 text-xs text-gray-500">Nomor WhatsApp {site.brand} belum diisi. Admin dapat mengisinya di menu Pengaturan.</p>
              )}
            </>
          )}
        </div>
      )}
    </form>
  )
}
