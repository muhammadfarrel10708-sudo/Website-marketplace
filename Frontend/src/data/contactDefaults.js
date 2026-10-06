// Nilai bawaan halaman Kontak + Kalkulator. Dipakai selama admin belum menyimpan apa pun,
// dan untuk melengkapi bagian yang belum pernah diisi.
import { getSiteConfig, getSiteKey } from './site'
import { needTypes, audiences, locations, pitches } from './content'

export const CONTACT_TYPES = [
  { value: 'phone', label: 'Nomor telepon', placeholder: '(+62) 812-3456-7890' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: '081234567890' },
  { value: 'email', label: 'Email', placeholder: 'nama@email.com' },
  { value: 'instagram', label: 'Instagram', placeholder: 'username_instagram' },
  { value: 'facebook', label: 'Facebook', placeholder: 'nama.halaman' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'username_tiktok' },
  { value: 'youtube', label: 'YouTube', placeholder: 'nama channel' },
  { value: 'website', label: 'Website', placeholder: 'www.contoh.com' },
  { value: 'other', label: 'Lainnya', placeholder: 'Isi kontak' },
]

let seq = 0
export const newId = (prefix = 'n') => `${prefix}${Date.now().toString(36)}${(seq++).toString(36)}`

const jenisEnv = { 'Videotron Indoor': 'indoor', 'Videotron Outdoor': 'outdoor' }
const lokasiEnv = (name) => (name.includes('Outdoor') ? 'outdoor' : name.includes('Indoor') ? 'indoor' : 'any')

export function defaultContactPage(siteKey = getSiteKey()) {
  const s = getSiteConfig(siteKey)
  let n = 0
  const id = () => `d${++n}`
  return {
    heading: 'Contact Now!',
    subheading: 'Untuk informasi mengenai layanan pengadaan LED screen/videotron atau lainnya, silakan hubungi kami di:',
    items: [
      ...s.phones.map((value) => ({ id: id(), type: 'phone', value })),
      { id: id(), type: 'email', value: s.email },
      ...s.socials.map((value) => ({ id: id(), type: 'instagram', value })),
      { id: id(), type: 'website', value: s.website },
    ],
    addresses_title: 'Alamat :',
    addresses: s.addresses.map((value) => ({ id: id(), value })),
    calculator: {
      title: 'Kalkulator Kebutuhan Videotron',
      description: 'Isi data berikut untuk mendapatkan rekomendasi videotron yang sesuai dengan kebutuhan Anda.',
      fields: {
        jenis: {
          label: 'Jenis Kebutuhan',
          placeholder: 'Pilih Kebutuhan',
          options: needTypes.map((label) => ({ id: id(), label, environment: jenisEnv[label] || 'any', pitches: pitches[label] })),
        },
        audiens: {
          label: 'Jumlah Target Audiens',
          placeholder: 'Pilih Jumlah Audiens',
          options: audiences.map(([label, min_width]) => ({ id: id(), label, min_width })),
        },
        lokasi: {
          label: 'Lokasi Pemasangan',
          placeholder: 'Pilih Lokasi',
          options: locations.map((label) => ({ id: id(), label, environment: lokasiEnv(label) })),
        },
      },
      inputs: {
        lebar: { label: 'Estimasi Lebar Videotron (Meter)', placeholder: 'Contoh: 3' },
        tinggi: { label: 'Estimasi Tinggi Videotron (Meter)', placeholder: 'Contoh: 2' },
        jarak: { label: 'Jarak Pandang Terdekat (Meter)', placeholder: 'Contoh: 3' },
        wa: { label: 'WhatsApp', placeholder: '08xxxxxxxxxx' },
        email: { label: 'Email (Opsional)', placeholder: 'nama@email.com' },
      },
      button_label: 'Hitung Kebutuhan',
    },
  }
}

// Gabungkan data tersimpan dengan bawaan. Bagian yang hilang (undefined) memakai bawaan;
// teks yang sengaja dikosongkan admin (null / '') tetap kosong.
const str = (v, def) => (typeof v === 'string' ? v : v === null ? '' : def)
const arr = (v, def) => (Array.isArray(v) ? v : def)
const withIds = (list, prefix) => list.map((x, i) => ({ ...x, id: x.id || `${prefix}${i}` }))

export function resolveContactPage(saved, siteKey = getSiteKey()) {
  const d = defaultContactPage(siteKey)
  if (!saved || typeof saved !== 'object') return d
  const c = saved.calculator || {}
  const fields = c.fields || {}
  const inputs = c.inputs || {}

  const field = (name) => {
    const f = fields[name] || {}
    return {
      label: str(f.label, d.calculator.fields[name].label),
      placeholder: str(f.placeholder, d.calculator.fields[name].placeholder),
      options: withIds(arr(f.options, d.calculator.fields[name].options), `${name}-`),
    }
  }
  const input = (name) => ({
    label: str(inputs[name]?.label, d.calculator.inputs[name].label),
    placeholder: str(inputs[name]?.placeholder, d.calculator.inputs[name].placeholder),
  })

  return {
    heading: str(saved.heading, d.heading),
    subheading: str(saved.subheading, d.subheading),
    items: withIds(arr(saved.items, d.items), 'i'),
    addresses_title: str(saved.addresses_title, d.addresses_title),
    addresses: withIds(arr(saved.addresses, d.addresses), 'a'),
    calculator: {
      title: str(c.title, d.calculator.title),
      description: str(c.description, d.calculator.description),
      fields: { jenis: field('jenis'), audiens: field('audiens'), lokasi: field('lokasi') },
      inputs: { lebar: input('lebar'), tinggi: input('tinggi'), jarak: input('jarak'), wa: input('wa'), email: input('email') },
      button_label: str(c.button_label, d.calculator.button_label),
    },
  }
}
