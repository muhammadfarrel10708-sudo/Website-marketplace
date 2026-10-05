// ==== DATA DUMMY: ganti nama, harga, dan kategori dengan produk asli klien ====
// Website ini berdiri sendiri. Tidak ada link ke platform lain; tombol produk mengarah ke WhatsApp/Kontak.
export const categories = [
  { id: 'modul', name: 'Modul LED' },
  { id: 'power', name: 'Power Supply' },
  { id: 'kontrol', name: 'Controller & Card' },
  { id: 'kabinet', name: 'Kabinet & Frame' },
  { id: 'running', name: 'Running Text' },
  { id: 'aksesoris', name: 'Kabel & Aksesoris' },
]

const raw = [
  ['modul', 'Modul LED P2.5 Indoor Full Color 320x160mm', 185000],
  ['modul', 'Modul LED P3 Indoor Full Color 192x192mm', 165000],
  ['modul', 'Modul LED P4 Indoor Full Color 256x128mm', 145000],
  ['modul', 'Modul LED P5 Outdoor Full Color 320x160mm', 175000],
  ['modul', 'Modul LED P6 Outdoor Full Color 192x192mm', 190000],
  ['modul', 'Modul LED P8 Outdoor Full Color 256x128mm', 210000],
  ['modul', 'Modul LED P10 Outdoor Full Color 320x160mm', 225000],
  ['power', 'Power Supply 5V 40A Indoor', 285000],
  ['power', 'Power Supply 5V 60A Outdoor Anti Air', 365000],
  ['power', 'Power Supply 5V 40A Slim Outdoor', 320000],
  ['power', 'Power Supply 4.2V 60A Hemat Daya', 395000],
  ['power', 'Kabel Power AC 3 Meter Heavy Duty', 45000],
  ['kontrol', 'Sending Card Sinkron Full Color', 850000],
  ['kontrol', 'Receiving Card 256x256 Pixel', 275000],
  ['kontrol', 'Receiving Card 512x384 Pixel', 340000],
  ['kontrol', 'Video Processor 2 Input HDMI', 2450000],
  ['kontrol', 'Controller Asinkron WiFi Single Color', 650000],
  ['kabinet', 'Kabinet Besi Indoor 640x640mm', 420000],
  ['kabinet', 'Kabinet Aluminium Die Cast 500x500mm', 780000],
  ['kabinet', 'Kabinet Outdoor Anti Air 960x960mm', 1150000],
  ['kabinet', 'Frame Besi Hollow Videotron per Meter', 350000],
  ['kabinet', 'Braket Dudukan Dinding Videotron', 185000],
  ['running', 'Running Text P10 Single Color Merah 100x20cm', 850000],
  ['running', 'Running Text P10 Single Color Kuning 100x20cm', 850000],
  ['running', 'Running Text P10 Full Color Semi Outdoor 160x32cm', 1450000],
  ['running', 'Running Text Dua Sisi 100x20cm', 2100000],
  ['running', 'Modul Running Text P10 Single Color Hijau', 95000],
  ['aksesoris', 'Kabel Flat Data HUB75 Panjang 30cm (10 pcs)', 60000],
  ['aksesoris', 'Kabel LAN Cat6 Outdoor 50 Meter', 240000],
  ['aksesoris', 'Magnet Modul LED Pengikat (20 pcs)', 55000],
  ['aksesoris', 'Baut & Mur Set Kabinet LED (100 pcs)', 40000],
  ['aksesoris', 'Lem Silikon Waterproof Modul Outdoor', 65000],
  ['aksesoris', 'Kipas Pendingin Kabinet 12V', 35000],
  ['aksesoris', 'Sensor Kecerahan Otomatis', 180000],
  ['aksesoris', 'Tas Kotak Perkakas Teknisi LED', 320000],
]

// ---- Deskripsi dummy per kategori (ganti dengan deskripsi asli tiap produk) ----
const specs = {
  modul: {
    intro: 'Modul LED full color dengan warna tajam, kecerahan merata, dan refresh rate tinggi sehingga gambar tetap nyaman dilihat, termasuk saat direkam kamera.',
    body: 'Cocok untuk videotron iklan, panggung, ruang rapat, showroom, toko, hingga papan informasi di depan gedung. Setiap modul diuji satu per satu sebelum dikirim, dan dikemas dengan busa pelindung agar aman sampai tujuan.\n\nModul bisa dirangkai sesuai ukuran layar yang Anda butuhkan. Tim kami siap membantu menghitung jumlah modul, power supply, dan controller yang dibutuhkan untuk satu layar.',
    list: ['Warna: full color RGB', 'Refresh rate: 3840 Hz', 'Sudut pandang: 140° horizontal / 120° vertikal', 'Interface: HUB75, kompatibel dengan receiving card umum', 'Garansi: 6 bulan (klaim modul rusak, bukan kerusakan fisik)'],
  },
  power: {
    intro: 'Power supply switching dengan output stabil untuk menyalakan modul LED dan controller tanpa kedip.',
    body: 'Dilengkapi proteksi arus lebih, tegangan lebih, dan korsleting, serta sirkuit pendingin agar tetap aman dipakai berjam-jam. Bodi kokoh dan lubang terminal jelas sehingga pemasangan lebih cepat.\n\nUntuk pemakaian outdoor, pilih tipe anti air dan tetap letakkan di dalam kabinet tertutup. Jumlah power supply yang dibutuhkan bergantung pada total daya layar, tanyakan ke kami jika ragu.',
    list: ['Input: AC 110–240V, 50/60 Hz', 'Efisiensi tinggi, suhu kerja stabil', 'Proteksi: OCP, OVP, SCP', 'Garansi: 3 bulan'],
  },
  kontrol: {
    intro: 'Perangkat pengendali yang mengatur tampilan gambar, video, dan teks di layar LED Anda.',
    body: 'Mudah dipasang dengan perangkat lunak berbahasa Indonesia atau Inggris dan mendukung berbagai resolusi layar. Kompatibel dengan mayoritas modul LED yang beredar di pasaran.\n\nSebelum membeli, sebutkan ukuran layar dan jenis modul yang dipakai. Kami akan bantu memastikan perangkat yang dipilih cocok, termasuk panduan pengaturan awal lewat WhatsApp.',
    list: ['Mendukung pengaturan kecerahan manual dan otomatis', 'Bisa dioperasikan lewat laptop atau PC', 'Konektor standar industri', 'Garansi: 6 bulan'],
  },
  kabinet: {
    intro: 'Kabinet dan rangka penopang modul LED dengan bahan kuat, presisi, dan tahan karat.',
    body: 'Lubang modul dan jarak antar kabinet dibuat presisi sehingga sambungan layar rata tanpa celah. Tersedia ruang untuk power supply dan receiving card, dengan jalur kabel rapi untuk memudahkan servis.\n\nPengiriman antar kota dikemas kayu atau karton tebal. Untuk pemasangan di lokasi, tim instalasi kami juga bisa datang jika dibutuhkan.',
    list: ['Bahan: besi galvanis / aluminium, cat powder coating', 'Tersedia versi indoor dan outdoor', 'Bisa dipesan sesuai ukuran (custom)'],
  },
  running: {
    intro: 'Running text LED dengan tulisan jelas dari jarak jauh, cocok untuk toko, kantor, dan tempat usaha.',
    body: 'Teks dapat diubah kapan saja lewat aplikasi di HP atau laptop, lengkap dengan pilihan efek gerak dan kecepatan. Menyala terang di siang hari dan hemat listrik.\n\nSetiap unit sudah dirakit dalam bingkai siap pasang dan diuji menyala sebelum dikirim. Tersedia juga permintaan ukuran khusus.',
    list: ['Pengaturan teks via WiFi / USB', 'Efek gerak: kiri, kanan, atas, bawah, kedip', 'Rangka aluminium ringan', 'Garansi: 6 bulan'],
  },
  aksesoris: {
    intro: 'Perlengkapan pendukung instalasi dan perawatan LED Videotron.',
    body: 'Kualitas standar lapangan dan sudah sering dipakai teknisi kami.',
    list: [],
  },
}

const buildDescription = (categoryId, name) => {
  const d = specs[categoryId]
  const parts = [`${name}. ${d.intro}`, d.body]
  if (d.list.length) parts.push('Spesifikasi & keterangan:\n' + d.list.map((x) => `• ${x}`).join('\n'))
  return parts.join('\n\n')
}

// ---- Ulasan dummy (deterministik supaya tidak berubah tiap refresh) ----
const reviewers = ['Budi S.', 'Rina A.', 'Agus W.', 'Dewi K.', 'Hendra P.', 'Siti N.', 'Yoga P.', 'Maya L.', 'Fajar R.', 'Lina T.']
const reviewText = {
  5: ['Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin juga responsif.', 'Puas banget, sesuai kebutuhan proyek kami. Pasti order lagi.'],
  4: ['Produk bagus, hanya pengiriman agak lama. Selebihnya aman.', 'Sesuai gambar dan berfungsi baik. Semoga stok selalu tersedia.'],
  3: ['Barang oke, tapi packing bisa lebih tebal lagi.'],
}
const ratingCycle = [5, 5, 4, 5, 4, 3, 5]

const seedReviews = (i) =>
  Array.from({ length: 3 + (i % 4) }, (_, k) => {
    const rating = ratingCycle[(i + k) % ratingCycle.length]
    const texts = reviewText[rating]
    const day = new Date(Date.UTC(2026, 8, 20 - ((i * 3 + k * 5) % 60)))
    return {
      id: `seed-${i}-${k}`,
      name: reviewers[(i + k * 3) % reviewers.length],
      rating,
      comment: texts[(i + k) % texts.length],
      date: day.toISOString(),
    }
  })

export const products = raw.map(([categoryId, name, price], i) => {
  const reviews = seedReviews(i)
  return {
    id: `p${i + 1}`,
    categoryId,
    name,
    price,
    sold: 12 + ((i * 37) % 480),
    seed: i,
    description: categoryId === 'aksesoris' && i % 2 === 0
      ? `${name}. ${specs.aksesoris.intro} ${specs.aksesoris.body}`
      : buildDescription(categoryId, name),
    reviews,
    rating: (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1),
  }
})

export const getProduct = (id) => products.find((p) => p.id === id)
