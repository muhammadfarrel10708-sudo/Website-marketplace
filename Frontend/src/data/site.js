const siteConfigs = {
  dzikround: {
    brand: 'Dzikround',
    city: 'Surabaya',
    since: 2015,
    whatsapp: '',
    waText: 'Halo, saya ingin bertanya tentang LED Videotron / Running Text.',
    phones: ['(+62) 800-0000-0001', '(+62) 800-0000-0002', '(+62) 800-0000-0003'],
    email: 'email@dzikround.com',
    website: 'www.dzikround.com',
    socials: ['dzikround', 'dzikround', 'dzikround', 'dzikround'],
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
  },
  nusatron: {
    brand: 'Nusatron',
    city: 'Surabaya',
    since: 2015,
    whatsapp: '',
    waText: 'Halo, saya ingin bertanya tentang LED Videotron / Running Text.',
    phones: ['(+62) 800-0000-0001', '(+62) 800-0000-0002', '(+62) 800-0000-0003'],
    email: 'email@nusatron.com',
    website: 'www.nusatron.com',
    socials: ['nusatron', 'nusatron', 'nusatron', 'nusatron'],
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
  },
}

export const themes = {
  dzikround: { brand: '#2f42d6', dark: '#2233ab', sidebar: '#0e1433' },
  nusatron: { brand: '#eab308', dark: '#ca8a04', sidebar: '#3b2f08' },
}

export function getSiteKey() {
  if (typeof window === 'undefined') return 'dzikround'
  return window.location.pathname === '/nusatron' || window.location.pathname.startsWith('/nusatron/')
    ? 'nusatron'
    : 'dzikround'
}

export function getSiteTheme(siteKey = getSiteKey()) {
  return themes[siteKey] || themes.dzikround
}

export function sitePath(path = '/') {
  if (!path || path === '/') return getSiteKey() === 'nusatron' ? '/nusatron' : '/'
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return getSiteKey() === 'nusatron' ? `/nusatron${normalized}` : normalized
}

export const site = new Proxy({}, {
  get(_target, property) {
    return (siteConfigs[getSiteKey()] || siteConfigs.dzikround)[property]
  },
})

export function getSiteConfig(siteKey = getSiteKey()) {
  return siteConfigs[siteKey] || siteConfigs.dzikround
}

export function waLink(text = getSiteConfig().waText) {
  const n = getSiteConfig().whatsapp.replace(/\D/g, '')
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : null
}
