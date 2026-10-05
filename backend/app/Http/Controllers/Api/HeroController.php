<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeroResource;
use App\Models\Hero;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Daftar slide hero untuk landing page (publik, hanya yang aktif). */
class HeroController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return HeroResource::collection(Hero::active()->ordered()->get());
    }
}
