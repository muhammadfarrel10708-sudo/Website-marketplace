<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SectionResource;
use App\Models\Section;
use Illuminate\Http\JsonResponse;

/** Judul & subjudul blok konten landing page (publik). */
class SectionController extends Controller
{
    public function show(string $key): JsonResponse
    {
        $section = Section::where('key', $key)->first();

        if (! $section) {
            // Belum diseed / key salah ketik: frontend memakai judul bawaan.
            return response()->json(['data' => null], 404);
        }

        return response()->json(['data' => new SectionResource($section)]);
    }
}
