<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AboutContent */
class AboutContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'paragraph_one' => $this->paragraph_one,
            'paragraph_two' => $this->paragraph_two,
            'image_url' => $this->image_path ? asset('uploads/'.$this->image_path) : null,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
