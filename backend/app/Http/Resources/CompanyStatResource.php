<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyStatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'label' => $this->label,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
