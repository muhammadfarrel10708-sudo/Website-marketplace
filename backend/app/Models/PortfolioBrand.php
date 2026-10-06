<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSite;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class PortfolioBrand extends Model
{
    use BelongsToSite;

    protected $fillable = ['image_path', 'shape', 'zoom', 'position_x', 'position_y', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return [
            'zoom' => 'float', 'position_x' => 'float', 'position_y' => 'float',
            'sort_order' => 'integer', 'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder { return $query->where('is_active', true); }
    public function scopeOrdered(Builder $query): Builder { return $query->orderBy('sort_order')->orderBy('id'); }
}
