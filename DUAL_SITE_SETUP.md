# Dzikround + Nusatron

Project ini sekarang memakai **1 dashboard admin** dengan **2 website publik** dan data terpisah.

## Website publik
- Dzikround: `http://localhost:5173/`
- Nusatron: `http://localhost:5173/nusatron`

Keduanya memakai struktur halaman dan API yang sama. Nusatron hanya berbeda pada branding/nuansa kuning dan data tersimpan di tenant `nusatron`.

## Login dashboard
- Dzikround: username `admin`, password `admin12345`
- Nusatron: username `nusatron`, password `admin12345`
- Dashboard tetap satu: `http://localhost:5173/admin`
- Form login tetap satu: `http://localhost:5173/login`

Setelah login, akun menentukan website mana yang sedang dikelola. Request admin otomatis dibatasi ke data site tersebut.

## Setelah memasang patch
Di folder `backend` jalankan:

```bash
php artisan migrate
php artisan db:seed
```

Migration `2026_10_05_000001_add_site_scoping` akan:
1. menambahkan pemisahan data `dzikround` dan `nusatron`;
2. menjadikan data yang sudah ada sebagai data Dzikround;
3. menggandakan data tersebut untuk Nusatron;
4. memisahkan file upload per website agar upload/hapus Nusatron tidak mengubah file Dzikround.

Jika database saat ini sudah berisi data project, **jangan `migrate:fresh`**, karena itu akan menghapus seluruh database.

## Jalankan lokal
Backend:

```bash
cd "C:\Project 1\backend"
C:\xampp\php\php.exe artisan serve
```

Frontend:

```bash
cd "C:\Project 1\frontend"
npm run dev
```
