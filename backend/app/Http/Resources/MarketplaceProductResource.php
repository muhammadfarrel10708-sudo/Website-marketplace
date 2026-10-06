<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketplaceProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $avg = $this->reviews_avg_rating;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (int) $this->price,
            'category' => $this->category,
            'sold' => (int) $this->sold,
            'rating' => $avg !== null ? round((float) $avg, 1) : null,
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'image_url' => $this->image_path ? asset('uploads/'.$this->image_path) : null,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'reviews' => $this->whenLoaded('reviews', fn () => $this->reviews->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'date' => $r->created_at?->toIso8601String(),
            ])->values()),
        ];
    }
}
