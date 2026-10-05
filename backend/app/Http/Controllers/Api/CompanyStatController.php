<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyStatResource;
use App\Models\CompanyStat;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CompanyStatController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CompanyStatResource::collection(CompanyStat::active()->ordered()->get());
    }
}
