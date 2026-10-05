<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdvantageRequest;
use App\Http\Resources\AdvantageResource;
use App\Models\Advantage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class AdvantageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdvantageResource::collection(Advantage::ordered()->get());
    }

    public function store(AdvantageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['sort_order'] = $data['sort_order'] ?? ((int) Advantage::max('sort_order') + 1);
        $data['is_active'] = $request->boolean('is_active', true);

        return (new AdvantageResource(Advantage::create($data)))->response()->setStatusCode(201);
    }

    public function update(AdvantageRequest $request, Advantage $advantage): AdvantageResource
    {
        $data = $request->validated();
        if (array_key_exists('is_active', $data)) {
            $data['is_active'] = $request->boolean('is_active');
        }
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $advantage->update($data);
        return new AdvantageResource($advantage->refresh());
    }

    public function destroy(Advantage $advantage): Response
    {
        $advantage->delete();
        return response()->noContent();
    }
}
