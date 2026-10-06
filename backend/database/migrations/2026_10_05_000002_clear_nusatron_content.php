<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    private array $tables = [
        'heroes',
        'sections',
        'work_steps',
        'services',
        'about_contents',
        'products',
        'articles',
        'advantages',
        'company_stats',
        'service_areas',
        'about_page_items',
        'portfolio_items',
        'portfolio_brands',
    ];

    public function up(): void
    {
        // Nusatron sebelumnya sempat dibuat sebagai salinan Dzikround.
        // Hapus hanya tenant Nusatron; data Dzikround tidak disentuh.
        foreach ($this->tables as $table) {
            if (DB::getSchemaBuilder()->hasColumn($table, 'site_key')) {
                DB::table($table)->where('site_key', 'nusatron')->delete();
            }
        }

        // Hapus juga file upload khusus Nusatron yang merupakan hasil salinan.
        $nusatronUploads = public_path('uploads/nusatron');
        if (File::isDirectory($nusatronUploads)) {
            File::deleteDirectory($nusatronUploads);
        }
    }

    public function down(): void
    {
        // Tidak mengembalikan salinan Dzikround. Konten Nusatron memang harus kosong.
    }
};
