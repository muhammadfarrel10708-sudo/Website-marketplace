<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MarketplaceProductRequest;
use App\Http\Resources\MarketplaceProductResource;
use App\Models\MarketplaceProduct;
use App\Support\SiteContext;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MarketplaceProductController extends Controller
{
    private const DISK = 'uploads';

    public function index(): AnonymousResourceCollection
    {
        abort_unless(SiteContext::key() === SiteContext::NUSATRON, 403);
        return MarketplaceProductResource::collection(MarketplaceProduct::withCount('reviews')->withAvg('reviews', 'rating')->ordered()->get());
    }

    public function store(MarketplaceProductRequest $request): JsonResponse
    {
        abort_unless(SiteContext::key() === SiteContext::NUSATRON, 403);
        $data = $request->safe()->except(['image']);
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store(SiteContext::uploadPath('marketplace'), self::DISK);
        }
        $data['is_active'] = $request->boolean('is_active', true);
        $data['price'] = (int) ($data['price'] ?? 0);
        $data['sold'] = (int) ($data['sold'] ?? 0);
        $data['sort_order'] = $data['sort_order'] ?? ((int) MarketplaceProduct::max('sort_order') + 1);
        $product = MarketplaceProduct::create($data);
        return (new MarketplaceProductResource($product))->response()->setStatusCode(201);
    }

    public function update(MarketplaceProductRequest $request, int $marketplaceProduct): MarketplaceProductResource
    {
        abort_unless(SiteContext::key() === SiteContext::NUSATRON, 403);
        $marketplaceProduct = MarketplaceProduct::query()->whereKey($marketplaceProduct)->firstOrFail();
        $data = $request->safe()->except(['image']);
        if ($request->has('is_active')) $data['is_active'] = $request->boolean('is_active');
        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $marketplaceProduct->image_path;
            $data['image_path'] = $request->file('image')->store(SiteContext::uploadPath('marketplace'), self::DISK);
        }
        foreach (['price', 'sold'] as $k) { if (array_key_exists($k, $data)) $data[$k] = (int) ($data[$k] ?? 0); }
        $marketplaceProduct->update($data);
        if ($oldImage) Storage::disk(self::DISK)->delete($oldImage);
        return new MarketplaceProductResource($marketplaceProduct->refresh()->loadCount('reviews')->loadAvg('reviews', 'rating'));
    }

    public function destroy(int $marketplaceProduct): Response
    {
        abort_unless(SiteContext::key() === SiteContext::NUSATRON, 403);
        $marketplaceProduct = MarketplaceProduct::query()->whereKey($marketplaceProduct)->firstOrFail();
        $imagePath = $marketplaceProduct->image_path;
        $marketplaceProduct->delete();
        if ($imagePath) Storage::disk(self::DISK)->delete($imagePath);
        return response()->noContent();
    }
}
