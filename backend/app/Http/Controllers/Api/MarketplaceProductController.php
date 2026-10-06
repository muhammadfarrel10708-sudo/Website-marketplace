<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MarketplaceProductResource;
use App\Models\MarketplaceProduct;
use App\Support\SiteContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MarketplaceProductController extends Controller
{
    private function query()
    {
        abort_unless(SiteContext::key() === SiteContext::NUSATRON, 404);

        return MarketplaceProduct::active()->withCount('reviews')->withAvg('reviews', 'rating');
    }

    public function index(): AnonymousResourceCollection
    {
        if (SiteContext::key() !== SiteContext::NUSATRON) {
            return MarketplaceProductResource::collection(collect());
        }

        return MarketplaceProductResource::collection($this->query()->ordered()->get());
    }

    public function show(int $id): MarketplaceProductResource
    {
        $product = $this->query()->whereKey($id)->firstOrFail();
        $product->load(['reviews' => fn ($q) => $q->latest()->limit(200)]);

        return new MarketplaceProductResource($product);
    }

    public function storeReview(Request $request, int $id): JsonResponse
    {
        $product = $this->query()->whereKey($id)->firstOrFail();

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:40'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'min:5', 'max:500'],
        ]);

        $review = $product->reviews()->create([
            'name' => trim($data['name'] ?? '') ?: 'Pembeli',
            'rating' => $data['rating'],
            'comment' => trim($data['comment']),
        ]);

        return response()->json(['data' => [
            'id' => $review->id,
            'name' => $review->name,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'date' => $review->created_at->toIso8601String(),
        ]], 201);
    }
}
