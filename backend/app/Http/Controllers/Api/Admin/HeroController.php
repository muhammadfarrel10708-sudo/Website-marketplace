<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HeroRequest;
use App\Http\Resources\HeroResource;
use App\Models\Hero;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/** CRUD slide hero untuk dashboard admin. */
class HeroController extends Controller
{
    private const DISK = 'uploads';

    /** Semua slide, termasuk yang disembunyikan. */
    public function index(): AnonymousResourceCollection
    {
        return HeroResource::collection(Hero::ordered()->get());
    }

    public function show(Hero $hero): HeroResource
    {
        return new HeroResource($hero);
    }

    public function store(HeroRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);

        $data['image_path'] = $request->file('image')->store('heroes', self::DISK);
        $data['is_active'] = $request->boolean('is_active', true);

        // Urutan kosong -> taruh di paling akhir
        $data['sort_order'] = $data['sort_order'] ?? ((int) Hero::max('sort_order') + 1);

        $hero = Hero::create($data);

        return (new HeroResource($hero))->response()->setStatusCode(201);
    }

    public function update(HeroRequest $request, Hero $hero): HeroResource
    {
        $data = $request->safe()->except(['image']);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        // Urutan kosong -> biarkan seperti semula
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $oldImage = null;

        if ($request->hasFile('image')) {
            $oldImage = $hero->image_path;
            $data['image_path'] = $request->file('image')->store('heroes', self::DISK);
        }

        $hero->update($data);

        // File lama baru dihapus setelah data berhasil disimpan
        if ($oldImage) {
            Storage::disk(self::DISK)->delete($oldImage);
        }

        return new HeroResource($hero->refresh());
    }

    public function destroy(Hero $hero): Response
    {
        $imagePath = $hero->image_path;

        $hero->delete();

        Storage::disk(self::DISK)->delete($imagePath);

        return response()->noContent();
    }
}
