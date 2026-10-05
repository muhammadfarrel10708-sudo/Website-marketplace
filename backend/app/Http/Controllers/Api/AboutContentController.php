<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AboutContentResource;
use App\Models\AboutContent;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Konten Tentang Kami yang tampil di landing page (publik, hanya yang aktif). */
class AboutContentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AboutContentResource::collection(AboutContent::active()->ordered()->get());
    }
}
