<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioItemRequest;
use App\Http\Resources\PortfolioItemResource;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class PortfolioItemController extends Controller
{
    private const DISK = 'uploads';

    public function index(): AnonymousResourceCollection { return PortfolioItemResource::collection(PortfolioItem::ordered()->get()); }

    public function store(PortfolioItemRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);
        if ($request->hasFile('image')) $data['image_path'] = $request->file('image')->store('portfolio', self::DISK);
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) PortfolioItem::max('sort_order') + 1);
        return (new PortfolioItemResource(PortfolioItem::create($data)))->response()->setStatusCode(201);
    }

    public function update(PortfolioItemRequest $request, PortfolioItem $portfolioItem): PortfolioItemResource
    {
        $data = $request->safe()->except(['image']);
        if ($request->has('is_active')) $data['is_active'] = $request->boolean('is_active');
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) unset($data['sort_order']);
        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $portfolioItem->image_path;
            $data['image_path'] = $request->file('image')->store('portfolio', self::DISK);
        }
        $portfolioItem->update($data);
        if ($oldImage) Storage::disk(self::DISK)->delete($oldImage);
        return new PortfolioItemResource($portfolioItem->refresh());
    }

    public function destroy(PortfolioItem $portfolioItem): Response
    {
        $image = $portfolioItem->image_path;
        $portfolioItem->delete();
        if ($image) Storage::disk(self::DISK)->delete($image);
        return response()->noContent();
    }
}
