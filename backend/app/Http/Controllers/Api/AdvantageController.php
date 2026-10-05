<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdvantageResource;
use App\Models\Advantage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdvantageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdvantageResource::collection(Advantage::active()->ordered()->get());
    }
}
