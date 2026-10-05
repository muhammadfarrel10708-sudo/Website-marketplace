<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutPageItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'section_key' => $this->section_key,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'content_one' => $this->content_one,
            'content_two' => $this->content_two,
            'meta_one' => $this->meta_one,
            'meta_two' => $this->meta_two,
            'image_url' => $this->image_path ? asset('uploads/'.$this->image_path) : null,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
