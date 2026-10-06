<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AboutPageItemRequest;
use App\Http\Resources\AboutPageItemResource;
use App\Support\SiteContext;
use App\Models\AboutPageItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class AboutPageItemController extends Controller
{
    private const DISK = 'uploads';

    public function index(): AnonymousResourceCollection
    {
        $query = AboutPageItem::ordered();
        if (request()->filled('section')) $query->where('section_key', request('section'));
        return AboutPageItemResource::collection($query->get());
    }

    public function store(AboutPageItemRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);
        if ($request->hasFile('image')) $data['image_path'] = $request->file('image')->store(SiteContext::uploadPath('about-page'), self::DISK);
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) AboutPageItem::where('section_key', $data['section_key'])->max('sort_order') + 1);
        $item = AboutPageItem::create($data);
        return (new AboutPageItemResource($item))->response()->setStatusCode(201);
    }

    public function update(AboutPageItemRequest $request, AboutPageItem $aboutPageItem): AboutPageItemResource
    {
        $data = $request->safe()->except(['image']);
        if ($request->has('is_active')) $data['is_active'] = $request->boolean('is_active');
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) unset($data['sort_order']);

        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $aboutPageItem->image_path;
            $data['image_path'] = $request->file('image')->store(SiteContext::uploadPath('about-page'), self::DISK);
        }

        $aboutPageItem->update($data);
        if ($oldImage) Storage::disk(self::DISK)->delete($oldImage);
        return new AboutPageItemResource($aboutPageItem->refresh());
    }

    public function destroy(AboutPageItem $aboutPageItem): Response
    {
        $image = $aboutPageItem->image_path;
        $aboutPageItem->delete();
        if ($image) Storage::disk(self::DISK)->delete($image);
        return response()->noContent();
    }
}
