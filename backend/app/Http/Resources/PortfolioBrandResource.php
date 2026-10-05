<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioBrandResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // Upload brand berada di backend public/uploads. Gunakan URL langsung
            // supaya browser tidak perlu melewati endpoint image yang sebelumnya 500.
            'image_url' => $this->image_path
                ? $request->getSchemeAndHttpHost() . '/uploads/' . ltrim($this->image_path, '/')
                : null,
            'shape' => $this->shape,
            'zoom' => (float) $this->zoom,
            'position_x' => (float) $this->position_x,
            'position_y' => (float) $this->position_y,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
