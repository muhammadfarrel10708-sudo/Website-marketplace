import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { getPublicSetting, updateSetting } from '../../api/settings'
import { makeWaLink, primeSetting, productMessage } from '../../data/settingsStore'
import { getSiteConfig } from '../../data/site'

const input = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand'
const labelCls = 'mb-1.5 block text-sm font-medium text-gray-800'

// Tampilan nomor yang ramah: 6281234567890 -> 081234567890 (disimpan tetap format internasional).
const toLocal = (n) => (n && n.startsWith('62') ? `0${n.slice(2)}` : n || '')

export default function Settings() {
  const { user } = useAuth()
  const siteKey = user?.username === 'nusatron' || user?.site_key === 'nusatron' ? 'nusatron' : 'dzikround'
  const cfg = getSiteConfig(siteKey)

  const [status, setStatus] = useState('loading') // loading | ready | error
  const [number, setNumber] = useState('')
  const [defaultMessage, setDefaultMessage] = useState(cfg.waText)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    getPublicSetting('whatsapp')
      .then((v) => {
        if (cancelled) return
        setNumber(toLocal(v?.number))
        setDefaultMessage(v?.default_message || cfg.waText)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => { cancelled = true }
  }, [cfg.waText])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 3500)
    return () => clearTimeout(t)
  }, [saved])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const value = await updateSetting('whatsapp', {
        number: number.trim(),
        default_message: defaultMessage.trim() || null,
      })
      primeSetting('whatsapp', value, siteKey)
      setNumber(toLocal(value?.number))
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  const digits = number.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits.startsWith('8') ? `62${digits}` : digits
  const testLink = makeWaLink(normalized, productMessage('Contoh Produk'))

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
      <p className="mt-1 text-sm text-gray-600">Pengaturan ini hanya berlaku untuk website {cfg.brand}.</p>

      {status === 'loading' && <div className="mt-6 h-64 animate-pulse rounded-lg border border-gray-200 bg-white" />}
      {status === 'error' && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat pengaturan. Muat ulang halaman.</p>
      )}

      {status === 'ready' && (
        <form onSubmit={submit} className="mt-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900">Tombol "Pesan via WhatsApp"</h2>
          <p className="mt-1 text-xs text-gray-500">
            Nomor ini dipakai semua tombol WhatsApp di website: halaman produk, tombol melayang, kalkulator, halaman Pesan Sekarang, dan QR di footer. Di halaman produk, nama produk yang diklik pengunjung otomatis ikut terkirim di pesan, tanpa perlu diatur.
          </p>

          <div className="mt-5">
            <label htmlFor="wa-number" className={labelCls}>Nomor WhatsApp tujuan</label>
            <input
              id="wa-number"
              className={input}
              value={number}
              inputMode="tel"
              placeholder="081234567890"
              maxLength={30}
              onChange={(e) => setNumber(e.target.value)}
              disabled={saving}
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Boleh ditulis 08xxx atau 62xxx, otomatis diubah ke format WhatsApp. Kosongkan untuk menonaktifkan tombol (pengunjung diarahkan ke halaman Kontak).
            </p>
          </div>

          <div className="mt-5">
            <label htmlFor="wa-default" className={labelCls}>Pesan otomatis umum</label>
            <textarea id="wa-default" rows={2} className={input} value={defaultMessage} maxLength={300} onChange={(e) => setDefaultMessage(e.target.value)} disabled={saving} />
            <p className="mt-1.5 text-xs text-gray-500">Dipakai tombol WhatsApp melayang dan QR di footer.</p>
          </div>

          {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Menyimpan…' : 'Simpan pengaturan'}
            </button>
            {testLink && (
              <a href={testLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand hover:underline">
                Coba buka di WhatsApp
              </a>
            )}
            {saved && <span className="text-sm font-medium text-green-700">Tersimpan.</span>}
          </div>
        </form>
      )}
    </div>
  )
}
