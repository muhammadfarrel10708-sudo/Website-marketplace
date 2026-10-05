<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkStepRequest;
use App\Http\Resources\WorkStepResource;
use App\Models\WorkStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/** CRUD langkah "Cara Kerja" untuk dashboard admin. */
class WorkStepController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return WorkStepResource::collection(WorkStep::ordered()->get());
    }

    public function store(WorkStepRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) WorkStep::max('sort_order') + 1);

        $step = WorkStep::create($data);

        return (new WorkStepResource($step))->response()->setStatusCode(201);
    }

    public function update(WorkStepRequest $request, WorkStep $workStep): WorkStepResource
    {
        $data = $request->validated();

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $workStep->update($data);

        return new WorkStepResource($workStep->refresh());
    }

    public function destroy(WorkStep $workStep): Response
    {
        $workStep->delete();

        return response()->noContent();
    }
}
