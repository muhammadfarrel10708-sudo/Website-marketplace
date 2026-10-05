<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Daftar layanan untuk landing page & halaman /layanan (publik, hanya yang aktif). */
class ServiceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $placement = $request->query('placement', 'page');
        if (!in_array($placement, ['home', 'page'], true)) {
            $placement = 'page';
        }

        return ServiceResource::collection(
            Service::active()->where('placement', $placement)->ordered()->get(),
        );
    }
}
