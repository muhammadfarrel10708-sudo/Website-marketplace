# Hero CMS - Laravel + MySQL

Frontend ini sudah memiliki halaman `/admin/hero` dan integrasi API untuk Laravel.

## Environment

- Windows + XAMPP
- PHP 8.2.12
- Laravel 11
- MySQL
- React + Vite frontend di `http://localhost:5173`
- Laravel API di `http://127.0.0.1:8000`

## 1. Buat database

Di phpMyAdmin buat database:

`videotron_db`

## 2. Buat Laravel

Dari folder project:

```bash
composer create-project laravel/laravel Backend
cd Backend
php artisan install:api
```

## 3. `.env`

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=videotron_db
DB_USERNAME=root
DB_PASSWORD=
```

## 4. Migration

Buat model:

```bash
php artisan make:model Hero -m
```

Migration `heroes`:

```php
Schema::create('heroes', function (Blueprint $table) {
    $table->id();
    $table->string('image');
    $table->string('title');
    $table->text('subtitle')->nullable();
    $table->string('cta')->nullable();
    $table->unsignedInteger('sort_order')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

Lalu:

```bash
php artisan migrate
php artisan storage:link
```

## 5. API yang dibutuhkan frontend

```text
GET    /api/heroes/active
GET    /api/heroes
GET    /api/heroes/{hero}
POST   /api/heroes
POST   /api/heroes/{hero}   # frontend mengirim _method=PUT untuk multipart upload
DELETE /api/heroes/{hero}
```

Endpoint public:

```text
GET /api/heroes/active
```

Endpoint CRUD admin nantinya wajib diberi middleware `auth:sanctum` setelah login backend disambungkan.

## 6. Frontend API URL

Copy `.env.example` menjadi `.env` di folder Frontend:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Setelah mengubah `.env`, restart Vite.

## 7. Jalankan

Terminal Laravel:

```bash
cd Backend
php artisan serve
```

Terminal frontend:

```bash
cd Frontend
npm install
npm run dev
```

## Catatan authentication

`/admin` pada frontend masih menggunakan authentication demo yang sudah ada di project. Itu belum menjadi keamanan backend. Setelah API login Laravel/Sanctum dibuat, `authService.js` perlu diubah agar login memperoleh token/session dari Laravel dan token tersebut dipakai oleh request CRUD Hero.
