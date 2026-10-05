// ==== DATA DUMMY: ganti dengan data asli klien ====
export const site = {
  brand: 'Nama Brand',
  city: 'Surabaya',
  since: 2015,
  whatsapp: '', // format internasional tanpa +, contoh: '6281234567890'
  waText: 'Halo, saya ingin bertanya tentang LED Videotron / Running Text.',
  phones: ['(+62) 800-0000-0001', '(+62) 800-0000-0002', '(+62) 800-0000-0003'],
  email: 'email@namabrand.com',
  website: 'www.namabrand.com',
  socials: ['namabrand', 'namabrand', 'namabrand', 'namabrand'],
  addresses: [
    'Alamat kantor / toko utama (dummy), Lantai 2 Blok A1, Kota Surabaya, Jawa Timur 60000',
    'Alamat cabang (dummy), Jl. Contoh No. 1, Kota Lain, Provinsi 00000',
  ],
  nav: [
    { name: 'Home', to: '/' },
    { name: 'Tentang Kami', to: '/tentang-kami' },
    { name: 'Layanan', to: '/layanan' },
    { name: 'Kalkulator Videotron', to: '/kalkulator-videotron' },
    { name: 'Marketplace', to: '/marketplace' },
    { name: 'Portofolio', to: '/portofolio' },
    { name: 'Artikel', to: '/artikel' },
    { name: 'FAQ', to: '/faq' },
    { name: 'Kontak', to: '/kontak' },
  ],
  stats: [
    { value: '2015', label: 'Tahun Berdiri' },
    { value: '120+', label: 'Project Selesai' },
    { value: '80+', label: 'Brand Klien' },
    { value: 'Nasional', label: 'Cakupan Layanan' },
  ],
}

export function waLink(text = site.waText) {
  const n = site.whatsapp.replace(/\D/g, '')
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : null
}
