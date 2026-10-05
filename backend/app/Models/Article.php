<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title', 'slug', 'placement', 'published_at', 'excerpt', 'body', 'image_path', 'image_zoom', 'image_position_x', 'image_position_y', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'published_at' => 'date',
        'sort_order' => 'integer',
        'image_zoom' => 'float',
        'image_position_x' => 'float',
        'image_position_y' => 'float',
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderBy('sort_order')->orderByDesc('id');
    }
}
