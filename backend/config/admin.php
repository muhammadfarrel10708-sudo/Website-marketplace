<?php

// Pengaturan akun admin. Nilainya diambil dari file .env
return [
    'name' => env('ADMIN_NAME', 'Administrator'),
    'username' => env('ADMIN_USERNAME', 'admin'),
    'email' => env('ADMIN_EMAIL', 'admin@example.com'),
    'password' => env('ADMIN_PASSWORD'),
    'token_hours' => (int) env('ADMIN_TOKEN_HOURS', 8),
];
