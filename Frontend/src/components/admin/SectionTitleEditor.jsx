import { useEffect, useState } from 'react'
import { getSection, updateSection } from '../../api/sections'

// Editor judul & subjudul satu blok konten (dipakai di tab admin manapun yang punya section berjudul).
// sectionKey: kunci di tabel sections (mis. 'cara_kerja', 'layanan').
export default function SectionTitleEditor({ sectionKey, defaultTitle, helpText }) {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSection(sectionKey)
      .then((s) => {
        if (cancelled) return
        setTitle(s?.title ?? defaultTitle)
        setSubtitle(s?.subtitle ?? '')
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [sectionKey, defaultTitle])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(t)
  }, [saved])

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Judul wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateSection(sectionKey, { title: title.trim(), subtitle: subtitle.trim() || null })
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') return <div className="h-28 animate-pulse rounded-lg border border-gray-200 bg-white" />
  if (status === 'error') return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat judul bagian.</p>

  return (
    <form onSubmit={submit} className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Judul bagian ini di website</h2>
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`section-title-${sectionKey}`} className="mb-1.5 block text-sm font-medium text-gray-800">Judul</label>
          <input
            id={`section-title-${sectionKey}`}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand"
            value={title}
            maxLength={120}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />
        </div>
        <div>
          <label htmlFor={`section-subtitle-${sectionKey}`} className="mb-1.5 block text-sm font-medium text-gray-800">
            Subjudul <span className="text-xs font-normal text-gray-500">(opsional)</span>
          </label>
          <input
            id={`section-subtitle-${sectionKey}`}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand"
            value={subtitle}
            maxLength={300}
            onChange={(e) => setSubtitle(e.target.value)}
            disabled={saving}
          />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-xs font-medium text-red-600">{error}</p>}
      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Menyimpan…' : 'Simpan judul'}
        </button>
        {saved && <span className="text-sm font-medium text-green-700">Tersimpan.</span>}
      </div>
    </form>
  )
}
