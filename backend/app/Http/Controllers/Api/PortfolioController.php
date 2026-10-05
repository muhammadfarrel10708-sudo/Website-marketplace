<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioBrandResource;
use App\Http\Resources\PortfolioItemResource;
use App\Models\PortfolioBrand;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class PortfolioController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'items' => PortfolioItemResource::collection(PortfolioItem::active()->ordered()->get())->resolve(),
            'brands' => PortfolioBrandResource::collection(PortfolioBrand::active()->ordered()->get())->resolve(),
        ]);
    }

    public function brands(): JsonResponse
    {
        return response()->json([
            'data' => PortfolioBrandResource::collection(PortfolioBrand::active()->ordered()->get())->resolve(),
        ]);
    }

    public function brandImage(PortfolioBrand $portfolioBrand): Response
    {
        abort_unless($portfolioBrand->is_active && $portfolioBrand->image_path, 404);

        // Brand uploads are stored under public/uploads by the admin upload disk.
        // Resolve the file directly from the public path so the image endpoint does
        // not depend on a configured filesystem disk at request time.
        $relativePath = ltrim(str_replace(['\\', '..'], ['/', ''], $portfolioBrand->image_path), '/');
        $path = public_path('uploads/' . $relativePath);

        abort_unless(is_file($path), 404);

        return response()->file($path);
    }
}
