<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SectionRequest;
use App\Http\Resources\SectionResource;
use App\Models\Section;

/** Ubah judul & subjudul blok konten (admin). Baris section dibuat lewat seeder, bukan lewat sini. */
class SectionController extends Controller
{
    public function update(SectionRequest $request, string $key): SectionResource
    {
        $section = Section::firstOrCreate(
            ['key' => $key],
            ['title' => $request->validated()['title'], 'subtitle' => $request->validated()['subtitle'] ?? null],
        );

        if (! $section->wasRecentlyCreated) {
            $section->update($request->validated());
        }

        return new SectionResource($section);
    }
}
