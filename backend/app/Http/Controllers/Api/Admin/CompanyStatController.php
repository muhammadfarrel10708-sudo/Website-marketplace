<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyStatRequest;
use App\Http\Resources\CompanyStatResource;
use App\Models\CompanyStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CompanyStatController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CompanyStatResource::collection(CompanyStat::ordered()->get());
    }

    public function store(CompanyStatRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['sort_order'] = $data['sort_order'] ?? ((int) CompanyStat::max('sort_order') + 1);
        $data['is_active'] = $request->boolean('is_active', true);

        return (new CompanyStatResource(CompanyStat::create($data)))->response()->setStatusCode(201);
    }

    public function update(CompanyStatRequest $request, CompanyStat $companyStat): CompanyStatResource
    {
        $data = $request->validated();
        if (array_key_exists('is_active', $data)) {
            $data['is_active'] = $request->boolean('is_active');
        }
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $companyStat->update($data);
        return new CompanyStatResource($companyStat->refresh());
    }

    public function destroy(CompanyStat $companyStat): Response
    {
        $companyStat->delete();
        return response()->noContent();
    }
}
