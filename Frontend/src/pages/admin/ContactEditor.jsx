import { useEffect, useRef, useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../auth/useAuth'
import { getPublicSetting, updateSetting } from '../../api/settings'
import { primeSetting } from '../../data/settingsStore'
import { CONTACT_TYPES, defaultContactPage, newId, resolveContactPage } from '../../data/contactDefaults'

const input = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand focus:outline-2 focus:outline-brand'
const labelCls = 'mb-1 block text-xs font-medium text-gray-700'
const card = 'rounded-lg border border-gray-200 bg-white p-5'
const iconBtn = 'rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:hover:bg-transparent'
const addBtn = 'inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5'

function move(list, i, dir) {
  const j = i + dir
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

function Field({ label, children }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>
}

// Tombol "Tambah" dengan pilihan jenis kontak (nomor, email, Instagram, website, dll).
function AddContactMenu({ onPick }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" className={addBtn} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <PlusIcon className="h-4 w-4" aria-hidden="true" /> Tambah
      </button>
      {open && (
        <div role="menu" className="absolute left-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Tambah kontak</p>
          {CONTACT_TYPES.map((t) => (
            <button key={t.value} type="button" role="menuitem" onClick={() => { onPick(t.value); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-50">
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactTab({ page, patch }) {
  const lastRef = useRef(null)
  const [focusId, setFocusId] = useState(null)

  useEffect(() => {
    if (focusId && lastRef.current) { lastRef.current.focus(); setFocusId(null) }
  }, [focusId, page.items.length, page.addresses.length])

  const setItem = (id, p) => patch({ items: page.items.map((it) => (it.id === id ? { ...it, ...p } : it)) })
  const addItem = (type) => {
    const id = newId('i')
    patch({ items: [...page.items, { id, type, value: '' }] })
    setFocusId(id)
  }
  const setAddr = (id, value) => patch({ addresses: page.addresses.map((a) => (a.id === id ? { ...a, value } : a)) })
  const addAddr = () => {
    const id = newId('a')
    patch({ addresses: [...page.addresses, { id, value: '' }] })
    setFocusId(id)
  }

  return (
    <div className="space-y-5">
      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-900">Header halaman</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Header">
            <input className={input} value={page.heading} maxLength={120} onChange={(e) => patch({ heading: e.target.value })} />
          </Field>
          <Field label="Sub header">
            <textarea rows={3} className={input} value={page.subheading} maxLength={500} onChange={(e) => patch({ subheading: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-900">Daftar kontak</h2>
        <p className="mt-1 text-xs text-gray-500">Tampil di halaman Kontak dan footer, sesuai urutan di sini.</p>
        <ul className="mt-4 space-y-3">
          {page.items.map((it, i) => {
            const meta = CONTACT_TYPES.find((t) => t.value === it.type) || CONTACT_TYPES[CONTACT_TYPES.length - 1]
            return (
              <li key={it.id} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <select aria-label="Jenis kontak" className={`${input} sm:w-44 sm:flex-none`} value={it.type} onChange={(e) => setItem(it.id, { type: e.target.value })}>
                  {CONTACT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input
                  aria-label={`Isi ${meta.label}`}
                  ref={it.id === focusId ? lastRef : null}
                  className={`${input} min-w-0 flex-1`}
                  value={it.value}
                  maxLength={200}
                  placeholder={meta.placeholder}
                  onChange={(e) => setItem(it.id, { value: e.target.value })}
                />
                <div className="flex flex-none items-center">
                  <button type="button" aria-label="Naikkan" className={iconBtn} disabled={i === 0} onClick={() => patch({ items: move(page.items, i, -1) })}><ArrowUpIcon className="h-4 w-4" /></button>
                  <button type="button" aria-label="Turunkan" className={iconBtn} disabled={i === page.items.length - 1} onClick={() => patch({ items: move(page.items, i, 1) })}><ArrowDownIcon className="h-4 w-4" /></button>
                  <button type="button" aria-label="Hapus kontak" className={`${iconBtn} hover:!text-red-600`} onClick={() => patch({ items: page.items.filter((x) => x.id !== it.id) })}><TrashIcon className="h-4 w-4" /></button>
                </div>
              </li>
            )
          })}
          {page.items.length === 0 && <li className="text-sm text-gray-500">Belum ada kontak. Klik Tambah.</li>}
        </ul>
        <div className="mt-4"><AddContactMenu onPick={addItem} /></div>
      </section>

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-900">Alamat</h2>
        <div className="mt-4">
          <Field label="Judul bagian alamat">
            <input className={input} value={page.addresses_title} maxLength={60} onChange={(e) => patch({ addresses_title: e.target.value })} />
          </Field>
        </div>
        <ul className="mt-4 space-y-3">
          {page.addresses.map((a, i) => (
            <li key={a.id} className="flex items-start gap-2">
              <textarea aria-label={`Alamat ${i + 1}`} ref={a.id === focusId ? lastRef : null} rows={2} className={`${input} min-w-0 flex-1`} value={a.value} maxLength={500} placeholder="Alamat lengkap" onChange={(e) => setAddr(a.id, e.target.value)} />
              <div className="flex flex-none items-center">
                <button type="button" aria-label="Naikkan" className={iconBtn} disabled={i === 0} onClick={() => patch({ addresses: move(page.addresses, i, -1) })}><ArrowUpIcon className="h-4 w-4" /></button>
                <button type="button" aria-label="Turunkan" className={iconBtn} disabled={i === page.addresses.length - 1} onClick={() => patch({ addresses: move(page.addresses, i, 1) })}><ArrowDownIcon className="h-4 w-4" /></button>
                <button type="button" aria-label="Hapus alamat" className={`${iconBtn} hover:!text-red-600`} onClick={() => patch({ addresses: page.addresses.filter((x) => x.id !== a.id) })}><TrashIcon className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button type="button" className={addBtn} onClick={addAddr}><PlusIcon className="h-4 w-4" aria-hidden="true" /> Tambah alamat</button>
        </div>
      </section>
    </div>
  )
}

// Editor satu dropdown: label, placeholder, dan daftar pilihan (+ isian tambahan sesuai jenis dropdown).
function DropdownEditor({ title, fieldKey, cfg, onChange }) {
  const setOpt = (id, p) => onChange({ ...cfg, options: cfg.options.map((o) => (o.id === id ? { ...o, ...p } : o)) })
  const addOpt = () => {
    const base = { id: newId('o'), label: '' }
    const extra = fieldKey === 'jenis' ? { environment: 'any', pitches: [2.5] } : fieldKey === 'audiens' ? { min_width: 0 } : { environment: 'any' }
    onChange({ ...cfg, options: [...cfg.options, { ...base, ...extra }] })
  }
  const envSelect = (o) => (
    <select aria-label="Jenis lokasi" className={`${input} sm:w-36 sm:flex-none`} value={o.environment || 'any'} onChange={(e) => setOpt(o.id, { environment: e.target.value })}>
      <option value="any">Semua lokasi</option>
      <option value="indoor">Indoor</option>
      <option value="outdoor">Outdoor</option>
    </select>
  )

  return (
    <section className={card}>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Label"><input className={input} value={cfg.label} maxLength={120} onChange={(e) => onChange({ ...cfg, label: e.target.value })} /></Field>
        <Field label="Teks awal dropdown"><input className={input} value={cfg.placeholder} maxLength={120} onChange={(e) => onChange({ ...cfg, placeholder: e.target.value })} /></Field>
      </div>

      <p className="mb-2 mt-5 text-xs font-medium text-gray-700">Pilihan dropdown</p>
      {fieldKey === 'jenis' && <p className="mb-2 text-xs text-gray-500">Pixel pitch: angka dipisah koma (mis. 1.25, 1.53, 2). Dipakai untuk menentukan rekomendasi.</p>}
      {fieldKey === 'audiens' && <p className="mb-2 text-xs text-gray-500">Lebar minimal (meter) dipakai untuk catatan "disarankan lebar layar minimal". Isi 0 jika tidak perlu.</p>}
      <ul className="space-y-2">
        {cfg.options.map((o, i) => (
          <li key={o.id} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <input aria-label="Nama pilihan" className={`${input} min-w-0 flex-1`} value={o.label} maxLength={120} placeholder="Nama pilihan" onChange={(e) => setOpt(o.id, { label: e.target.value })} />
            {fieldKey === 'jenis' && (
              <>
                {envSelect(o)}
                <PitchInput value={o.pitches} onCommit={(pitches) => setOpt(o.id, { pitches })} />
              </>
            )}
            {fieldKey === 'audiens' && (
              <input aria-label="Lebar minimal (meter)" type="number" min="0" step="any" className={`${input} sm:w-36 sm:flex-none`} value={o.min_width ?? 0} placeholder="Lebar min (m)" onChange={(e) => setOpt(o.id, { min_width: e.target.value === '' ? 0 : Number(e.target.value) })} />
            )}
            {fieldKey === 'lokasi' && envSelect(o)}
            <div className="flex flex-none items-center">
              <button type="button" aria-label="Naikkan" className={iconBtn} disabled={i === 0} onClick={() => onChange({ ...cfg, options: move(cfg.options, i, -1) })}><ArrowUpIcon className="h-4 w-4" /></button>
              <button type="button" aria-label="Turunkan" className={iconBtn} disabled={i === cfg.options.length - 1} onClick={() => onChange({ ...cfg, options: move(cfg.options, i, 1) })}><ArrowDownIcon className="h-4 w-4" /></button>
              <button type="button" aria-label="Hapus pilihan" className={`${iconBtn} hover:!text-red-600`} disabled={cfg.options.length <= 1} onClick={() => onChange({ ...cfg, options: cfg.options.filter((x) => x.id !== o.id) })}><TrashIcon className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button type="button" className={addBtn} onClick={addOpt}><PlusIcon className="h-4 w-4" aria-hidden="true" /> Tambah pilihan</button>
      </div>
    </section>
  )
}

// Teks bebas selama mengetik; baru diubah jadi daftar angka saat selesai (blur).
function PitchInput({ value, onCommit }) {
  const [text, setText] = useState((value || []).join(', '))
  useEffect(() => { setText((value || []).join(', ')) }, [value])
  const commit = () => {
    const nums = text.split(/[,;\s]+/).map((s) => parseFloat(s.replace(',', '.'))).filter((n) => n > 0)
    onCommit(nums)
  }
  return (
    <input
      aria-label="Pixel pitch (pisahkan dengan koma)"
      className={`${input} sm:w-48 sm:flex-none`}
      value={text}
      placeholder="mis. 1.25, 1.53, 2"
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
    />
  )
}

function InputEditor({ title, cfg, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr] sm:items-end">
      <Field label={`${title} - label`}><input className={input} value={cfg.label} maxLength={120} onChange={(e) => onChange({ ...cfg, label: e.target.value })} /></Field>
      <Field label="Contoh isian (placeholder)"><input className={input} value={cfg.placeholder} maxLength={120} onChange={(e) => onChange({ ...cfg, placeholder: e.target.value })} /></Field>
    </div>
  )
}

function CalculatorTab({ page, patch }) {
  const c = page.calculator
  const setC = (p) => patch({ calculator: { ...c, ...p } })
  const setField = (k) => (v) => setC({ fields: { ...c.fields, [k]: v } })
  const setInput = (k) => (v) => setC({ inputs: { ...c.inputs, [k]: v } })

  return (
    <div className="space-y-5">
      <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900">
        Kalkulator ini juga tampil di halaman Kalkulator Videotron, jadi perubahan di sini berlaku di kedua halaman. Tanda * pada kolom wajib ditambahkan otomatis.
      </p>

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-900">Judul kalkulator</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Judul"><input className={input} value={c.title} maxLength={120} onChange={(e) => setC({ title: e.target.value })} /></Field>
          <Field label="Keterangan di bawah judul"><textarea rows={2} className={input} value={c.description} maxLength={500} onChange={(e) => setC({ description: e.target.value })} /></Field>
        </div>
      </section>

      <DropdownEditor title="Dropdown 1" fieldKey="jenis" cfg={c.fields.jenis} onChange={setField('jenis')} />
      <DropdownEditor title="Dropdown 2" fieldKey="audiens" cfg={c.fields.audiens} onChange={setField('audiens')} />
      <DropdownEditor title="Dropdown 3" fieldKey="lokasi" cfg={c.fields.lokasi} onChange={setField('lokasi')} />

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-900">Kolom isian</h2>
        <div className="mt-4 space-y-4">
          <InputEditor title="Lebar" cfg={c.inputs.lebar} onChange={setInput('lebar')} />
          <InputEditor title="Tinggi" cfg={c.inputs.tinggi} onChange={setInput('tinggi')} />
          <InputEditor title="Jarak pandang" cfg={c.inputs.jarak} onChange={setInput('jarak')} />
          <InputEditor title="WhatsApp" cfg={c.inputs.wa} onChange={setInput('wa')} />
          <InputEditor title="Email" cfg={c.inputs.email} onChange={setInput('email')} />
        </div>
      </section>

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-900">Tombol</h2>
        <div className="mt-4 max-w-sm">
          <Field label="Teks tombol"><input className={input} value={c.button_label} maxLength={60} onChange={(e) => setC({ button_label: e.target.value })} /></Field>
        </div>
      </section>
    </div>
  )
}

const tabs = [
  { key: 'kontak', label: 'Info Kontak' },
  { key: 'kalkulator', label: 'Kalkulator' },
]

export default function ContactEditor() {
  const { user } = useAuth()
  const siteKey = user?.username === 'nusatron' || user?.site_key === 'nusatron' ? 'nusatron' : 'dzikround'

  const [status, setStatus] = useState('loading') // loading | ready | error
  const [page, setPage] = useState(null)
  const [tab, setTab] = useState('kontak')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    getPublicSetting('contact_page')
      .then((v) => {
        if (cancelled) return
        setPage(resolveContactPage(v, siteKey))
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => { cancelled = true }
  }, [siteKey])

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 3500)
    return () => clearTimeout(t)
  }, [saved])

  useEffect(() => {
    if (!dirty) return
    const warn = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const patch = (p) => { setPage((cur) => ({ ...cur, ...p })); setDirty(true); setSaved(false) }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const value = await updateSetting('contact_page', page)
      primeSetting('contact_page', value, siteKey)
      setPage(resolveContactPage(value, siteKey))
      setDirty(false)
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    if (!window.confirm('Kembalikan semua isi halaman Kontak ke bawaan? Perubahan baru tersimpan setelah Anda menekan Simpan.')) return
    setPage(defaultContactPage(siteKey))
    setDirty(true)
    setSaved(false)
  }

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <h1 className="text-2xl font-bold text-gray-900">Halaman Kontak</h1>
      <p className="mt-1 text-sm text-gray-600">Atur header, daftar kontak, alamat, dan kalkulator yang tampil di halaman Kontak.</p>

      {status === 'loading' && <div className="mt-6 h-64 animate-pulse rounded-lg border border-gray-200 bg-white" />}
      {status === 'error' && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat data. Muat ulang halaman.</p>}

      {status === 'ready' && page && (
        <>
          <div role="tablist" aria-label="Bagian halaman Kontak" className="mt-6 flex gap-1 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${tab === t.key ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {tab === 'kontak' ? <ContactTab page={page} patch={patch} /> : <CalculatorTab page={page} patch={patch} />}
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-64 sm:px-8">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving || !dirty}
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Menyimpan…' : 'Simpan perubahan'}
              </button>
              <button type="button" onClick={reset} disabled={saving} className="text-sm font-medium text-gray-600 hover:text-gray-900">Kembalikan ke bawaan</button>
              {dirty && !saving && <span className="text-xs text-amber-700">Ada perubahan yang belum disimpan.</span>}
              {saved && <span className="text-sm font-medium text-green-700">Tersimpan.</span>}
              {error && <span role="alert" className="text-sm font-medium text-red-600">{error}</span>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
