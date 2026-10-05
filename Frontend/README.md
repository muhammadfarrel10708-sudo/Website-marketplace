# Website LED Videotron (Frontend)

React + Vite + Tailwind + React Router.

## Menjalankan
    npm install
    npm run dev

## Mengganti data dummy
- `src/data/site.js`    : nama brand, kota, nomor WhatsApp, telepon, email, alamat, statistik
- `src/data/content.js` : teks hero, layanan, produk, artikel, FAQ, portofolio, testimoni
- Gambar dummy dibuat oleh `src/components/DummyImage.jsx`. Ganti pemakaiannya dengan <img src="/foto.jpg"> (taruh file di folder `public/`).

## Deploy
Website memakai BrowserRouter, jadi server harus mengarahkan semua URL ke `index.html` (SPA fallback).
