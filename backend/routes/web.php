<?php

use Illuminate\Support\Facades\Route;

// Halaman ini hanya penanda bahwa backend hidup. Website ada di project React.
Route::get('/', fn () => response()->json([
    'app' => config('app.name'),
    'status' => 'ok',
    'heroes' => url('/api/heroes'),
]));
