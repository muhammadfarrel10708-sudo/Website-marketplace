<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/** CRUD layanan untuk dashboard admin. */
class ServiceController extends Controller
{
    private const DISK = 'uploads';

    public function index(Request $request): AnonymousResourceCollection
    {
        $placement = $request->query('placement', 'page');
        if (!in_array($placement, ['home', 'page'], true)) {
            $placement = 'page';
        }

        return ServiceResource::collection(
            Service::where('placement', $placement)->ordered()->get(),
        );
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);
        $data['placement'] = $data['placement'] ?? 'page';

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('services', self::DISK);
        }
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? ((int) Service::where('placement', $data['placement'])->max('sort_order') + 1);

        $service = Service::create($data);

        return (new ServiceResource($service))->response()->setStatusCode(201);
    }

    public function update(ServiceRequest $request, Service $service): ServiceResource
    {
        $data = $request->safe()->except(['image']);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }
        if (array_key_exists('sort_order', $data) && $data['sort_order'] === null) {
            unset($data['sort_order']);
        }

        $oldImage = null;

        if ($request->hasFile('image')) {
            $oldImage = $service->image_path;
            $data['image_path'] = $request->file('image')->store('services', self::DISK);
        }

        $service->update($data);

        if ($oldImage && !Service::where('image_path', $oldImage)->where('id', '<>', $service->id)->exists()) {
            Storage::disk(self::DISK)->delete($oldImage);
        }

        return new ServiceResource($service->refresh());
    }

    public function destroy(Service $service): Response
    {
        $imagePath = $service->image_path;

        $service->delete();

        if ($imagePath && !Service::where('image_path', $imagePath)->exists()) {
            Storage::disk(self::DISK)->delete($imagePath);
        }

        return response()->noContent();
    }
}
