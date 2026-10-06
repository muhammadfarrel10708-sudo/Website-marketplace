<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class NusatronSeeder extends Seeder
{
    public function run(): void
    {
        // Seeder ini sengaja hanya menambahkan dummy Nusatron saat tenant Nusatron kosong.
        // Tidak pernah membaca, menyalin, mengubah, atau menghapus data Dzikround.
        $tables = [
            'heroes', 'sections', 'work_steps', 'services', 'about_contents', 'products',
            'articles', 'advantages', 'company_stats', 'service_areas', 'about_page_items',
            'portfolio_items', 'portfolio_brands',
        ];

        $hasAny = false;
        foreach ($tables as $table) {
            if (Schema::hasTable($table) && DB::table($table)->where('site_key', 'nusatron')->exists()) {
                $hasAny = true;
                break;
            }
        }

        $this->command?->info($hasAny
            ? 'Nusatron sudah memiliki data; tidak menimpa data yang ada.'
            : 'Dummy Nusatron dibuat oleh migration 2026_10_05_000003_seed_nusatron_dummy_content.');
    }
}
