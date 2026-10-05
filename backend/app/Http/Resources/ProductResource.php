<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Product */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_path ? asset('uploads/'.$this->image_path) : null,
            'layout_variant' => $this->layout_variant,
            'items' => $this->items ?: [],
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
