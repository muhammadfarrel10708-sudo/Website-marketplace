<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSite;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    use BelongsToSite;

    protected $table = 'heroes';

    protected $fillable = [
        'title',
        'subtitle',
        'cta_label',
        'cta_url',
        'image_path',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** Hanya slide yang ditampilkan di website. */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /** Urutan tampil: angka kecil lebih dulu, lalu yang lebih dulu dibuat. */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
