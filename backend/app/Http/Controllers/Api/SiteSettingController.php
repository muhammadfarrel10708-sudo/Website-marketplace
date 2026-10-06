<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

/** Pengaturan website (publik, hanya baca): nomor WhatsApp tujuan & isi halaman Kontak. */
class SiteSettingController extends Controller
{
    public function show(string $key): JsonResponse
    {
        abort_unless(in_array($key, SiteSetting::KEYS, true), 404);

        $setting = SiteSetting::where('key', $key)->first();

        // null = belum pernah diatur admin; frontend memakai nilai bawaan.
        return response()->json(['data' => $setting?->value]);
    }
}
