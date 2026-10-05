<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AboutContentRequest;
use App\Http\Resources\AboutContentResource;
use App\Models\AboutContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/** CRUD blok Tentang Kami untuk dashboard admin. */
class AboutContentController extends Controller
{
    private const DISK = 'uploads';

    public function index(): AnonymousResourceCollection
    {
        return AboutContentResource::collection(AboutContent::ordered()->get());
    }

    public function store(AboutContentRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('about', self::DISK);
        }

        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) AboutContent::max('sort_order') + 1);

        $content = AboutContent::create($data);

        return (new AboutContentResource($content))->response()->setStatusCode(201);
    }

    public function update(AboutContentRequest $request, AboutContent $aboutContent): AboutContentResource
    {
        $data = $request->safe()->except(['image']);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $aboutContent->image_path;
            $data['image_path'] = $request->file('image')->store('about', self::DISK);
        }

        $aboutContent->update($data);

        if ($oldImage) {
            Storage::disk(self::DISK)->delete($oldImage);
        }

        return new AboutContentResource($aboutContent->refresh());
    }

    public function destroy(AboutContent $aboutContent): Response
    {
        $imagePath = $aboutContent->image_path;
        $aboutContent->delete();

        if ($imagePath) {
            Storage::disk(self::DISK)->delete($imagePath);
        }

        return response()->noContent();
    }
}
