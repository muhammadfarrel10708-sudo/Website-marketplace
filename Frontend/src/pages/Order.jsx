import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import { needTypes } from '../data/content'
import { site } from '../data/site'
import { useWhatsApp } from '../data/settingsStore'

const field = 'mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'

export default function Order() {
  const { link: waLink } = useWhatsApp()
  const [f, setF] = useState({ nama: '', wa: '', jenis: '', pesan: '' })
  const [sent, setSent] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const text = `Halo ${site.brand}, saya ${f.nama}.\nKebutuhan: ${f.jenis}\nPesan: ${f.pesan || '-'}\nWhatsApp saya: ${f.wa}`
    const link = waLink(text)
    if (link) window.open(link, '_blank', 'noopener,noreferrer')
    setSent(link ? 'ok' : 'nonumber')
  }

  return (
    <>
      <PageTitle sub="Isi data singkat berikut, tim kami akan menghubungi Anda via WhatsApp.">Pesan Sekarang</PageTitle>
      <form onSubmit={submit} className="mx-auto mb-16 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <label className="block text-xs font-semibold">Nama *
          <input required value={f.nama} onChange={set('nama')} className={field} placeholder="Nama lengkap" />
        </label>
        <label className="mt-4 block text-xs font-semibold">WhatsApp *
          <input required type="tel" inputMode="tel" value={f.wa} onChange={set('wa')} className={field} placeholder="08xxxxxxxxxx" />
        </label>
        <label className="mt-4 block text-xs font-semibold">Kebutuhan *
          <select required value={f.jenis} onChange={set('jenis')} className={field}>
            <option value="">Pilih Kebutuhan</option>
            {needTypes.map((o) => <option key={o}>{o}</option>)}
            <option>Service / Maintenance</option>
            <option>Part LED Videotron</option>
          </select>
        </label>
        <label className="mt-4 block text-xs font-semibold">Pesan (Opsional)
          <textarea rows="4" value={f.pesan} onChange={set('pesan')} className={field} placeholder="Ukuran, lokasi, atau pertanyaan lain" />
        </label>
        <button type="submit" className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
          Kirim via WhatsApp
        </button>
        {sent === 'nonumber' && (
          <p className="mt-4 text-xs text-brand-dark" role="status">Nomor WhatsApp belum diisi. Admin dapat mengisinya di menu Pengaturan.</p>
        )}
      </form>
    </>
  )
}
