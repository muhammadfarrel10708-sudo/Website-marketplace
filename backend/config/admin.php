<?php

// Pengaturan akun admin. Nilainya diambil dari file .env
return [
    'name' => env('ADMIN_NAME', 'Administrator'),
    'username' => env('ADMIN_USERNAME', 'admin'),
    'email' => env('ADMIN_EMAIL', 'admin@example.com'),
    'password' => env('ADMIN_PASSWORD'),
    'token_hours' => (int) env('ADMIN_TOKEN_HOURS', 8),
    'nusatron' => [
        'name' => env('NUSATRON_ADMIN_NAME', 'Admin Nusatron'),
        'username' => env('NUSATRON_ADMIN_USERNAME', 'nusatron'),
        'email' => env('NUSATRON_ADMIN_EMAIL', 'nusatron@example.com'),
        'password' => env('NUSATRON_ADMIN_PASSWORD', 'admin12345'),
    ],
];
