<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketplaceReview extends Model
{
    protected $table = 'marketplace_reviews';

    protected $fillable = ['marketplace_product_id', 'name', 'rating', 'comment'];

    protected $casts = ['rating' => 'integer'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(MarketplaceProduct::class, 'marketplace_product_id');
    }
}
