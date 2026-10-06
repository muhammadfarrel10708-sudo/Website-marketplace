<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSite;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketplaceProduct extends Model
{
    use BelongsToSite;

    protected $table = 'marketplace_products';

    protected $fillable = ['name', 'description', 'price', 'category', 'sold', 'image_path', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean', 'sort_order' => 'integer', 'price' => 'integer', 'sold' => 'integer'];

    public function reviews(): HasMany
    {
        return $this->hasMany(MarketplaceReview::class, 'marketplace_product_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
