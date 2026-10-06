<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSite;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use BelongsToSite;

    protected $fillable = ['key', 'title', 'subtitle'];
}
