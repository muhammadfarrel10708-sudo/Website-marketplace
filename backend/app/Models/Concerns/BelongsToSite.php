<?php

namespace App\Models\Concerns;

use App\Support\SiteContext;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToSite
{
    protected static function bootBelongsToSite(): void
    {
        static::addGlobalScope('site', function (Builder $builder): void {
            $builder->where($builder->getModel()->getTable().'.site_key', SiteContext::key());
        });

        static::creating(function ($model): void {
            if (blank($model->site_key)) {
                $model->site_key = SiteContext::key();
            }
        });
    }
}
