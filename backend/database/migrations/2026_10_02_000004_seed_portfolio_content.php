<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $sections = [
            'portofolio' => ['Portofolio Kami', null],
            'portfolio_project' => ['120+ Project', 'Hasil project Surabaya Videotron lebih dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.'],
            'portfolio_brand' => ['80+ Brand', 'Survey kepuasan dari banyaknya brand yang telah bekerja sama dengan Surabaya Videotron.'],
        ];
        foreach ($sections as $key => [$title, $subtitle]) {
            DB::table('sections')->updateOrInsert(['key' => $key], [
                'title' => $title, 'subtitle' => $subtitle, 'created_at' => $now, 'updated_at' => $now,
            ]);
        }

        if (DB::table('portfolio_items')->count() === 0) {
            $items = [
                ['Real X Club', 'Surabaya', 'P2.5'], ['Sekolah Contoh', 'Malang', 'P2.5'], ['Kebun Binatang', 'Surabaya', 'P4'],
                ['Gedung Serbaguna', 'Sidoarjo', 'P3'], ['Koarmada II', 'Surabaya', 'P2.5'], ['Hotel Bintang', 'Surabaya', 'P1.86'],
                ['Masjid Agung', 'Gresik', 'P4'], ['Kampus Contoh', 'Surabaya', 'P2'], ['Mall Contoh', 'Malang', 'P3'],
                ['Gereja Contoh', 'Surabaya', 'P2.5'], ['Kantor Pemda', 'Mojokerto', 'P4'], ['Ballroom Contoh', 'Surabaya', 'P1.53'],
                ['SPBU Contoh', 'Sidoarjo', 'P6'], ['Cafe Contoh', 'Surabaya', 'P2.5'],
            ];
            DB::table('portfolio_items')->insert(array_map(fn ($item, $i) => [
                'title' => $item[0], 'city' => $item[1], 'type' => $item[2], 'image_path' => null,
                'sort_order' => $i, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ], $items, array_keys($items)));
        }

        if (DB::table('portfolio_brands')->count() === 0) {
            DB::table('portfolio_brands')->insert(array_map(fn ($i) => [
                'image_path' => null, 'shape' => 'circle', 'zoom' => 1, 'position_x' => 50, 'position_y' => 50,
                'sort_order' => $i, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ], range(0, 11)));
        }
    }

    public function down(): void
    {
        DB::table('portfolio_brands')->delete();
        DB::table('portfolio_items')->delete();
        DB::table('sections')->whereIn('key', ['portofolio', 'portfolio_project', 'portfolio_brand'])->delete();
    }
};
