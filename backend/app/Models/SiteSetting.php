<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSite;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use BelongsToSite;

    /** Key yang boleh disimpan/dibaca lewat API pengaturan. */
    public const KEYS = ['whatsapp', 'contact_page'];

    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['value' => 'array'];
    }
}
