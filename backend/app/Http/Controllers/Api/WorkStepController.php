<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkStepResource;
use App\Models\WorkStep;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Daftar langkah "Cara Kerja" untuk landing page (publik, hanya yang aktif). */
class WorkStepController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return WorkStepResource::collection(WorkStep::active()->ordered()->get());
    }
}
