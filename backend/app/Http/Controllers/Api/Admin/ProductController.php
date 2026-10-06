<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Support\SiteContext;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private const DISK = 'uploads';

    public function index(): AnonymousResourceCollection
    {
        return ProductResource::collection(Product::ordered()->get());
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store(SiteContext::uploadPath('products'), self::DISK);
        }
        $data['items'] = $data['items'] ?? [];
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) Product::max('sort_order') + 1);

        $product = Product::create($data);
        return (new ProductResource($product))->response()->setStatusCode(201);
    }

    public function update(ProductRequest $request, Product $product): ProductResource
    {
        $data = $request->safe()->except(['image']);
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $product->image_path;
            $data['image_path'] = $request->file('image')->store(SiteContext::uploadPath('products'), self::DISK);
        }
        $product->update($data);
        if ($oldImage) {
            Storage::disk(self::DISK)->delete($oldImage);
        }
        return new ProductResource($product->refresh());
    }

    public function destroy(Product $product): Response
    {
        $imagePath = $product->image_path;
        $product->delete();
        if ($imagePath) {
            Storage::disk(self::DISK)->delete($imagePath);
        }
        return response()->noContent();
    }
}
