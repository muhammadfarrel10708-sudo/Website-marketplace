# Panduan Backend Laravel + MySQL (XAMPP)

Panduan ini untuk Windows dengan XAMPP (PHP 8.2.12). Backend memakai **Laravel 12** (syarat PHP 8.2 ke atas, jadi cocok).

## Cara kerja singkat

```
Admin (React /admin/heroes)  ──►  Laravel API (localhost:8000)  ──►  MySQL (XAMPP)
                                        │
Landing page (React /)  ◄───────────────┘   GET /api/heroes
```

- **Frontend** (folder `Frontend`) jalan di `http://localhost:5173`.
- **Backend** (folder `Backend`) jalan di `http://localhost:8000` lewat `php artisan serve`.
- **XAMPP hanya dipakai untuk MySQL** (dan phpMyAdmin). Apache hanya perlu menyala saat Anda membuka phpMyAdmin, tidak untuk menjalankan backend.
- Gambar yang diunggah disimpan di `Backend/public/uploads/heroes/`.

Susunan folder yang disarankan:

```
Project 1/
├── Frontend/     ← React (timpa dengan folder Frontend dari zip ini)
└── Backend/      ← Laravel (folder baru)
```

---

## A. Persiapan sekali saja

### 1. Pasang Composer
Composer adalah "npm"-nya PHP.
1. Unduh **Composer-Setup.exe** dari getcomposer.org dan jalankan.
2. Saat diminta memilih PHP, arahkan ke `C:\xampp\php\php.exe`.
3. Buka terminal baru, cek: `composer -V`

### 2. Daftarkan PHP XAMPP ke PATH
1. Tekan tombol Windows, ketik **environment variables**, buka *Edit the system environment variables*.
2. Klik **Environment Variables**, pilih `Path` (bagian *User variables*), klik **Edit**, lalu **New** dan isi `C:\xampp\php`.
3. Tutup semua terminal, buka terminal baru, cek:
   ```
   php -v
   ```
   Harus muncul `PHP 8.2.12`.

### 3. Aktifkan ekstensi PHP
Buka `C:\xampp\php\php.ini` (sesuai halaman phpinfo Anda) dengan Notepad. Cari baris berikut dan pastikan **tidak diawali titik koma** (`;`). Hapus `;` jika ada:

```
extension=zip
extension=fileinfo
extension=mbstring
extension=openssl
extension=pdo_mysql
extension=curl
```

Simpan, lalu cek di terminal: `php -m` (semua nama di atas harus muncul).

### 4. Buat database MySQL
1. Buka **XAMPP Control Panel**, klik **Start** pada **MySQL** (dan **Apache** jika ingin memakai phpMyAdmin).
2. Buka `http://localhost/phpmyadmin` (atau buat database lewat terminal tanpa Apache: `C:\xampp\mysql\bin\mysql -u root -e "CREATE DATABASE videotron CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`).
3. Di phpMyAdmin: klik **New**, isi nama `videotron`, pilih collation `utf8mb4_unicode_ci`, klik **Create**.

---

## B. Menjalankan backend

Buka terminal di dalam folder `Backend`:

```
composer install
copy .env.example .env
php artisan key:generate
```

Buka file `.env` dan cek bagian ini:

```
DB_DATABASE=videotron
DB_USERNAME=root
DB_PASSWORD=            ← kosong, ini bawaan XAMPP

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin12345    ← GANTI dengan password Anda sendiri
```

Lanjutkan:

```
php artisan migrate
php artisan db:seed
php artisan serve
```

- `migrate` membuat tabel (`heroes`, `users`, `personal_access_tokens`, dll).
- `db:seed` membuat akun admin dari `.env`.
- `serve` menyalakan backend. **Biarkan terminal ini terbuka.**

**Cek backend hidup:**
- `http://localhost:8000` → tampil JSON `{"app":"...","status":"ok",...}`
- `http://localhost:8000/api/heroes` → tampil `{"data":[]}`

Di phpMyAdmin, database `videotron` sekarang berisi tabel `heroes`, `users`, dan lainnya.

---

## C. Menjalankan frontend

1. Timpa folder `Frontend` Anda dengan folder `Frontend` dari zip ini (tidak ada paket npm baru, jadi `node_modules` lama tetap aman). Jika ragu, jalankan `npm install` sekali lagi.
2. (Opsional) Salin `.env.example` menjadi `.env` di folder Frontend. Isinya `VITE_API_URL=http://localhost:8000`. Tanpa file ini, alamat itu sudah dipakai otomatis.
3. Jalankan:
   ```
   npm run dev
   ```
4. Buka `http://localhost:5173/login`, masuk dengan `ADMIN_USERNAME` dan `ADMIN_PASSWORD` dari `.env` backend.

---

## D. Cara memakai menu Hero

1. Di dashboard, klik menu **Hero** di sidebar.
2. Klik **Tambah**, isi:
   - **Gambar** (wajib): JPG, PNG, atau WebP, maksimal 5 MB. Disarankan lebar, misalnya 1600 × 900 px.
   - **Judul** (wajib)
   - **Subjudul** (opsional)
   - **Teks tombol** dan **Link tombol** (opsional, harus diisi berpasangan). Link bisa `/pesan-sekarang` (halaman di website) atau `https://...` (alamat luar).
   - **Urutan tampil** (opsional): angka kecil tampil lebih dulu. Kosong = di akhir.
   - **Tampilkan di website**: matikan untuk menyembunyikan slide tanpa menghapusnya.
3. Klik **Simpan**. Buka `http://localhost:5173`: slide baru langsung ada di slider (refresh halaman).
4. **Ubah** dan **Hapus** ada di setiap baris. Saat mengubah, gambar boleh dikosongkan jika tidak ingin diganti.

Catatan perilaku:
- Selama belum ada slide yang tampil, landing page memakai **slide contoh bawaan** (dummy), jadi halaman tidak pernah kosong.
- Jika slide hanya satu, panah dan titik navigasi otomatis disembunyikan.
- Jika tombol tidak diisi, slide tampil tanpa tombol.
- Menghapus atau mengganti gambar juga menghapus file lama dari `public/uploads`.

---

## E. Daftar API

| Metode | Alamat | Login? | Fungsi |
|---|---|---|---|
| GET | `/api/heroes` | tidak | Slide aktif untuk landing page |
| POST | `/api/login` | tidak | Login, menghasilkan token (maks. 5 percobaan/menit) |
| POST | `/api/logout` | ya | Mencabut token |
| GET | `/api/me` | ya | Data admin yang login |
| GET | `/api/admin/heroes` | ya | Semua slide (termasuk yang disembunyikan) |
| POST | `/api/admin/heroes` | ya | Tambah slide (`multipart/form-data`) |
| POST | `/api/admin/heroes/{id}` + `_method=PUT` | ya | Ubah slide |
| DELETE | `/api/admin/heroes/{id}` | ya | Hapus slide |

Ubah slide memakai POST dengan field `_method=PUT` karena PHP tidak membaca file dari request PUT. Token dikirim lewat header `Authorization: Bearer <token>`.

Uji cepat login dari terminal (PowerShell):

```
curl.exe -X POST http://localhost:8000/api/login -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin12345\"}"
```

---

## F. Isi folder Backend (yang ditambahkan ke Laravel bawaan)

```
Backend/
├── .env.example                       ← sudah diarahkan ke MySQL XAMPP
├── bootstrap/app.php                  ← mengaktifkan routes/api.php + error API selalu JSON
├── config/admin.php                   ← akun admin dari .env
├── config/cors.php                    ← mengizinkan React memanggil API
├── config/filesystems.php             ← disk "uploads" (public/uploads)
├── routes/api.php                     ← semua alamat API
├── app/Models/Hero.php
├── app/Models/User.php                ← ditambah token (Sanctum) + kolom username
├── app/Http/Controllers/Api/AuthController.php
├── app/Http/Controllers/Api/HeroController.php          ← publik
├── app/Http/Controllers/Api/Admin/HeroController.php    ← CRUD admin
├── app/Http/Requests/HeroRequest.php  ← aturan validasi + pesan Indonesia
├── app/Http/Resources/HeroResource.php
├── app/Rules/SafeLink.php             ← menolak link "javascript:" dll
├── database/migrations/               ← tabel heroes, username, token
└── database/seeders/AdminSeeder.php
```

Login memakai **Laravel Sanctum** (token). Password disimpan ter-hash, token berlaku 8 jam (`ADMIN_TOKEN_HOURS`), dan setiap permintaan admin diperiksa ulang oleh server.

---

## G. Masalah yang sering muncul

| Gejala | Penyebab dan solusi |
|---|---|
| `php` tidak dikenali | PATH belum benar (langkah A2). Tutup dan buka ulang terminal. |
| Composer error `ext-zip`, `ext-fileinfo`, atau `ext-mbstring` tidak ada | Aktifkan di `php.ini` (langkah A3). |
| `could not find driver` | Aktifkan `extension=pdo_mysql` di `php.ini`. |
| `SQLSTATE[HY000] [2002]` | MySQL belum di-Start di XAMPP, atau port bukan 3306 (samakan `DB_PORT`). |
| `SQLSTATE[HY000] [1049] Unknown database` | Database `videotron` belum dibuat (langkah A4), atau nama di `.env` berbeda. |
| `No application encryption key` | Jalankan `php artisan key:generate`. |
| Login: "Tidak dapat terhubung ke server" | `php artisan serve` belum jalan, atau alamat di `VITE_API_URL` salah. |
| Browser menampilkan error CORS | Frontend dibuka lewat alamat yang tidak ada di `CORS_ALLOWED_ORIGINS` (misalnya `127.0.0.1:5173`). Tambahkan di `.env`, lalu `php artisan config:clear`. |
| Setelah mengubah `.env` tidak ada efek | Jalankan `php artisan config:clear`, lalu restart `php artisan serve`. |
| Upload gagal "melebihi batas server" | Naikkan `upload_max_filesize` dan `post_max_size` di `php.ini`, lalu restart `php artisan serve`. |
| Gambar tidak tampil di landing | Buka alamat gambarnya langsung. Pastikan `Backend/public/uploads/heroes/` berisi file dan backend masih jalan. |
| Lupa password admin | Ubah `ADMIN_PASSWORD` di `.env`, lalu `php artisan config:clear` dan `php artisan db:seed` (password direset). |
| Error 500 tanpa penjelasan | Lihat `Backend/storage/logs/laravel.log` (baris paling bawah). |

---

## H. Sebelum website dipublikasikan (hosting)

- Ganti `ADMIN_PASSWORD` dengan password yang kuat. Jangan pakai `admin12345`.
- Di `.env` server: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://domain-api-anda`.
- Isi `CORS_ALLOWED_ORIGINS` dengan alamat website Anda saja, misalnya `https://namabrand.com`.
- Di Frontend, isi `VITE_API_URL=https://domain-api-anda`, lalu `npm run build`.
- Arahkan *document root* domain API ke folder `Backend/public`.
- Di server: `composer install --no-dev --optimize-autoloader`, lalu `php artisan migrate --force`.
- Pastikan `storage/`, `bootstrap/cache/`, dan `public/uploads/` bisa ditulis oleh server.
- Pakai HTTPS. Token login dikirim di header, jadi wajib lewat koneksi terenkripsi.

---

## I. Apa yang sudah dan belum diuji

**Sudah diuji:**
- Seluruh kode frontend: build dan lint bersih. Alur login, tambah, ubah, hapus, validasi form, tampil di landing page (termasuk slide tanpa CTA, slide disembunyikan, dan logout otomatis saat token ditolak) diuji di browser. 32 skenario lulus.
- Seluruh file PHP lolos pemeriksaan sintaks.

**Belum diuji:**
- Backend Laravel belum pernah dijalankan (lingkungan tempat kode ini dibuat tidak bisa mengunduh paket Composer), jadi pengujian frontend memakai server tiruan yang meniru kontrak API di atas. Kode Laravel mengikuti konvensi standar, tetapi langkah B di atas adalah uji pertamanya. Jika ada pesan error saat `composer install`, `migrate`, atau `serve`, kirim pesannya apa adanya dan akan mudah diperbaiki.

## Update Tentang Kami (landing page)

Versi ini menambahkan CRUD **Tentang Kami** di menu Admin > Hero > Tentang Kami.
Setelah mengganti project ke versi ini jalankan:

```powershell
cd "C:\Project 1\backend"
php artisan migrate
php artisan db:seed --class=Database\Seeders\SectionSeeder
php artisan serve
```

Seeder memakai `firstOrCreate`, sehingga data Tentang Kami yang sudah diedit admin tidak ditimpa ketika seeder dijalankan ulang.
Gambar Tentang Kami disimpan di `backend/public/uploads/about`.

## Update Produk Kami — Card 1 & Card 2

Versi ini menambahkan pengelolaan **Produk Kami** di **Admin > Hero > Produk**. Tidak ada menu sidebar baru.

Setelah mengganti project, jalankan:

```powershell
cd "C:\Project 1\backend"
php artisan migrate
php artisan db:seed --class=Database\Seeders\SectionSeeder
php artisan serve
```

### Fitur Produk

- CRUD produk: tambah, ubah, hapus.
- Gambar produk opsional; jika kosong, landing page memakai gambar dummy.
- Setiap produk dapat memilih **Card 1** atau **Card 2**.
- Masing-masing opsi memiliki tombol **Preview**.
- Preview dibuat sebagai wireframe sederhana agar bentuk layout mudah dipahami sebelum memilih.
- Isi produk dapat memiliki banyak item berupa judul + keterangan.
- Ada urutan tampil dan status tampil/sembunyikan.
- Judul section **Produk Kami** juga dapat diedit dari editor judul section.
- Landing page membaca produk aktif dari `GET /api/products` dan memakai data contoh lama sebagai fallback jika API belum memiliki produk.

### API Produk

| Metode | Alamat | Login? | Fungsi |
|---|---|---|---|
| GET | `/api/products` | tidak | Produk aktif untuk landing page |
| GET | `/api/admin/products` | ya | Semua produk |
| POST | `/api/admin/products` | ya | Tambah produk (`multipart/form-data`) |
| POST | `/api/admin/products/{id}` + `_method=PUT` | ya | Ubah produk |
| DELETE | `/api/admin/products/{id}` | ya | Hapus produk |

Gambar produk disimpan di `backend/public/uploads/products`.

> Catatan pemeriksaan versi ini: seluruh file PHP yang ada di project telah lolos `php -l`. Build Vite penuh tidak dijalankan di environment pemeriksaan karena instalasi `node_modules` tidak selesai akibat timeout jaringan; jalankan `npm install`/`npm ci` di komputer Windows Anda sebelum `npm run dev`.
