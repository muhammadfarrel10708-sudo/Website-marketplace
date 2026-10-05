<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'city' => $this->city,
            'type' => $this->type,
            'image_url' => $this->image_path ? asset('uploads/'.$this->image_path) : null,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
