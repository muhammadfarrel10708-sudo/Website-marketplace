<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Article */
class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'placement' => $this->placement,
            'date' => $this->published_at?->locale('id')->translatedFormat('d F Y'),
            'published_at' => $this->published_at?->format('Y-m-d'),
            'excerpt' => $this->excerpt,
            'body' => $this->body ? preg_split('/\r?\n\s*\r?\n/', trim($this->body)) : [],
            'image_url' => $this->image_path ? asset('uploads/'.$this->image_path) : null,
            'image_zoom' => (float) ($this->image_zoom ?? 1),
            'image_position_x' => (float) ($this->image_position_x ?? 0),
            'image_position_y' => (float) ($this->image_position_y ?? 0),
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
