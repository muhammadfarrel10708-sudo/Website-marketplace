<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioBrandRequest;
use App\Http\Resources\PortfolioBrandResource;
use App\Models\PortfolioBrand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class PortfolioBrandController extends Controller
{
    private const DISK = 'uploads';

    public function index(): AnonymousResourceCollection { return PortfolioBrandResource::collection(PortfolioBrand::ordered()->get()); }

    public function store(PortfolioBrandRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);
        if ($request->hasFile('image')) $data['image_path'] = $request->file('image')->store('portfolio-brands', self::DISK);
        $data['zoom'] = $data['zoom'] ?? 1;
        $data['position_x'] = $data['position_x'] ?? 50;
        $data['position_y'] = $data['position_y'] ?? 50;
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) PortfolioBrand::max('sort_order') + 1);
        return (new PortfolioBrandResource(PortfolioBrand::create($data)))->response()->setStatusCode(201);
    }

    public function update(PortfolioBrandRequest $request, PortfolioBrand $portfolioBrand): PortfolioBrandResource
    {
        $data = $request->safe()->except(['image']);
        if ($request->has('is_active')) $data['is_active'] = $request->boolean('is_active');
        foreach (['zoom', 'position_x', 'position_y'] as $key) if (array_key_exists($key, $data) && $data[$key] === null) unset($data[$key]);
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) unset($data['sort_order']);
        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $portfolioBrand->image_path;
            $data['image_path'] = $request->file('image')->store('portfolio-brands', self::DISK);
        }
        $portfolioBrand->update($data);
        if ($oldImage) Storage::disk(self::DISK)->delete($oldImage);
        return new PortfolioBrandResource($portfolioBrand->refresh());
    }

    public function destroy(PortfolioBrand $portfolioBrand): Response
    {
        $image = $portfolioBrand->image_path;
        $portfolioBrand->delete();
        if ($image) Storage::disk(self::DISK)->delete($image);
        return response()->noContent();
    }
}
