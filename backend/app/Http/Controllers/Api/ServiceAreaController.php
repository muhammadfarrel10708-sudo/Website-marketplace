<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceAreaResource;
use App\Models\ServiceArea;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Daftar area layanan (accordion "Area Layanan ...") untuk landing page (publik, hanya yang aktif). */
class ServiceAreaController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ServiceAreaResource::collection(ServiceArea::active()->ordered()->get());
    }
}
