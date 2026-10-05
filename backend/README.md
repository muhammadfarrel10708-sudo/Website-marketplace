# Videotron Laravel Backend

Laravel 11 API backend for the existing React/Vite frontend.

## Requirements
- PHP 8.2.12 or newer within Laravel 11's supported range
- Composer
- MySQL (XAMPP)

## Install

```bash
composer install
copy .env.example .env
php artisan key:generate
```

Create a MySQL database named `videotron_db`, then set `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=videotron_db
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan optimize:clear
php artisan serve
```

Backend URL: `http://127.0.0.1:8000`

## Demo admin API credentials
- Email: `admin@example.com`
- Password: `admin123`

Change these before production.

## API

Public:
- `GET /api/heroes`
- `GET /api/heroes/active`
- `GET /api/heroes/{id}`
- `POST /api/login`

Authenticated with `Authorization: Bearer <token>`:
- `GET /api/me`
- `POST /api/logout`
- `POST /api/heroes`
- `POST /api/heroes/{id}` with `_method=PUT` for multipart updates
- `DELETE /api/heroes/{id}`

Hero image upload uses Laravel's `public` disk and stores files under `storage/app/public/heroes`.
