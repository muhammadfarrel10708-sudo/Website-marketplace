import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../../api/sections'
import { BanknotesIcon, ClockIcon, ShieldCheckIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

const ICONS = {
  shield: ShieldCheckIcon,
  money: BanknotesIcon,
  wrench: WrenchScrewdriverIcon,
  clock: ClockIcon,
}

const fallbackCards = [
  { icon: 'shield', title: 'Jaminan Kualitas', description: 'Kualitas produk running text dan videotron kami terjaga, dan banyak klien yang puas dengan hasilnya.' },
  { icon: 'money', title: 'Harga Terjangkau', description: 'Harga videotron indoor dan outdoor per meter dengan biaya bersahabat, kualitas tetap terjamin.' },
  { icon: 'wrench', title: 'Produk Bergaransi', description: 'Garansi 3 bulan pertama untuk gratis biaya service dan penggantian sparepart.' },
  { icon: 'clock', title: 'Layanan Tepat Waktu', description: 'Dikerjakan cepat, tepat, dan rapi: dalam 3–5 hari videotron Anda siap tayang.' },
]

const fallbackStats = [
  { value: '2015', label: 'Tahun Berdiri' },
  { value: '120+', label: 'Project Selesai' },
  { value: '80+', label: 'Brand Klien' },
  { value: 'Nasional', label: 'Cakupan Layanan' },
]

function useSectionEditor(sectionKey, defaults) {
  const [status, setStatus] = useState('loading')
  const [title, setTitle] = useState(defaults.title)
  const [subtitle, setSubtitle] = useState(defaults.subtitle || '')
  const [content, setContent] = useState(defaults.content)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSection(sectionKey)
      .then((section) => {
        if (cancelled) return
        setTitle(section?.title ?? defaults.title)
        setSubtitle(section?.subtitle ?? defaults.subtitle ?? '')
        setContent(section?.content ?? defaults.content)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Gagal memuat data.')
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [sectionKey])

  const save = async () => {
    if (!title.trim()) {
      setError('Judul wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateSection(sectionKey, { title: title.trim(), subtitle: subtitle.trim() || null, content })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setSaving(false)
    }
  }

  return { status, title, setTitle, subtitle, setSubtitle, content, setContent, saving, error, saved, save }
}

export function WhyChooseUsEditor() {
  const editor = useSectionEditor('kenapa_pilih_kami', { title: 'Kenapa Harus Pilih Kami?', subtitle: 'Jasa Videotron dan Jual LED Running Text', content: { cards: fallbackCards } })
  const cards = Array.isArray(editor.content?.cards) && editor.content.cards.length === 4 ? editor.content.cards : fallbackCards

  const updateCard = (index, key, value) => {
    const next = cards.map((card, i) => i === index ? { ...card, [key]: value } : card)
    editor.setContent({ ...editor.content, cards: next })
  }

  if (editor.status === 'loading') return <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-white" />
  if (editor.status === 'error') return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{editor.error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Edit Kenapa Harus Pilih Kami?</h2>
        <p className="mt-1 text-sm text-gray-600">Semua perubahan di sini langsung mengatur bagian yang tampil di landing page. Konten tetap berada di dalam card pada website.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Judul</label>
            <input value={editor.title} maxLength={120} onChange={(e) => editor.setTitle(e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-2 focus:outline-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Subjudul</label>
            <input value={editor.subtitle} maxLength={300} onChange={(e) => editor.setSubtitle(e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-2 focus:outline-brand" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card, index) => {
          const Icon = ICONS[card.icon] || ShieldCheckIcon
          return (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Card {index + 1}</p><p className="text-sm font-semibold text-gray-900">Konten card</p></div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-800">Title</label>
                  <input value={card.title || ''} maxLength={120} onChange={(e) => updateCard(index, 'title', e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-2 focus:outline-brand" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-800">Deskripsi</label>
                  <textarea value={card.description || ''} maxLength={500} rows={4} onChange={(e) => updateCard(index, 'description', e.target.value)} disabled={editor.saving} className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm leading-6 focus:border-brand focus:outline-2 focus:outline-brand" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editor.error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{editor.error}</p>}
      <div className="flex items-center gap-4">
        <button type="button" onClick={editor.save} disabled={editor.saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60">{editor.saving ? 'Menyimpan…' : 'Simpan perubahan'}</button>
        {editor.saved && <span className="text-sm font-medium text-green-700">Tersimpan.</span>}
      </div>
    </div>
  )
}

export function CompanyStatsEditor() {
  const editor = useSectionEditor('statistik_perusahaan', { title: 'Statistik Perusahaan Kami', subtitle: '', content: { stats: fallbackStats } })
  const stats = Array.isArray(editor.content?.stats) && editor.content.stats.length === 4 ? editor.content.stats : fallbackStats

  const updateStat = (index, key, value) => {
    const next = stats.map((stat, i) => i === index ? { ...stat, [key]: value } : stat)
    editor.setContent({ ...editor.content, stats: next })
  }

  if (editor.status === 'loading') return <div className="h-72 animate-pulse rounded-xl border border-gray-200 bg-white" />
  if (editor.status === 'error') return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{editor.error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Edit Statistik Perusahaan Kami</h2>
        <p className="mt-1 text-sm text-gray-600">Statistik ini tetap menjadi bagian dari alur Home setelah “Kenapa Harus Pilih Kami?”, bukan dipindahkan menjadi halaman terpisah.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Judul</label>
            <input value={editor.title} maxLength={120} onChange={(e) => editor.setTitle(e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-2 focus:outline-brand" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Subjudul <span className="font-normal text-gray-500">(opsional)</span></label>
            <input value={editor.subtitle} maxLength={300} onChange={(e) => editor.setSubtitle(e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-2 focus:outline-brand" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Statistik {index + 1}</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">Nilai</label>
                <input value={stat.value || ''} maxLength={40} onChange={(e) => updateStat(index, 'value', e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold focus:border-brand focus:outline-2 focus:outline-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-800">Label</label>
                <input value={stat.label || ''} maxLength={80} onChange={(e) => updateStat(index, 'label', e.target.value)} disabled={editor.saving} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-2 focus:outline-brand" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {editor.error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{editor.error}</p>}
      <div className="flex items-center gap-4">
        <button type="button" onClick={editor.save} disabled={editor.saving} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60">{editor.saving ? 'Menyimpan…' : 'Simpan perubahan'}</button>
        {editor.saved && <span className="text-sm font-medium text-green-700">Tersimpan.</span>}
      </div>
    </div>
  )
}
