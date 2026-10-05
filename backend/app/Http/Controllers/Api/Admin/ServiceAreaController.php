<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceAreaRequest;
use App\Http\Resources\ServiceAreaResource;
use App\Models\ServiceArea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** CRUD area layanan untuk dashboard admin. */
class ServiceAreaController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ServiceAreaResource::collection(ServiceArea::ordered()->get());
    }

    public function store(ServiceAreaRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) ServiceArea::max('sort_order') + 1);

        $area = ServiceArea::create($data);

        return (new ServiceAreaResource($area))->response()->setStatusCode(201);
    }

    public function update(ServiceAreaRequest $request, ServiceArea $serviceArea): ServiceAreaResource
    {
        $data = $request->validated();

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $serviceArea->update($data);

        return new ServiceAreaResource($serviceArea->refresh());
    }

    public function destroy(ServiceArea $serviceArea): Response
    {
        $serviceArea->delete();

        return response()->noContent();
    }
}
