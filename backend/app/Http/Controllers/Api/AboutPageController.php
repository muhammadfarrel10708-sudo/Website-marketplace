<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AboutPageItemResource;
use App\Models\AboutPageItem;
use Illuminate\Http\JsonResponse;

class AboutPageController extends Controller
{
    public function index(): JsonResponse
    {
        $items = AboutPageItem::active()->ordered()->get()->map(fn ($item) => (new AboutPageItemResource($item))->resolve())->groupBy('section_key');

        return response()->json([
            'intro' => $items->get('intro', collect())->values(),
            'testimonials' => $items->get('testimonials', collect())->values(),
            'projects' => $items->get('projects', collect())->values(),
            'brands' => $items->get('brands', collect())->values(),
        ]);
    }
}
