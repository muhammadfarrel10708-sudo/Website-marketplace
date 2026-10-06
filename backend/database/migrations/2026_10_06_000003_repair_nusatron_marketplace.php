<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('marketplace_products')) {
            return;
        }

        $rows = [
            ['Modul LED P2.5 Indoor Full Color', 'Modul LED indoor dengan warna tajam dan refresh rate tinggi untuk kebutuhan display profesional.', 'nusatron/marketplace/modul-p25.svg', 1],
            ['Power Supply 5V 60A Outdoor', 'Power supply stabil dengan proteksi arus lebih untuk kabinet LED outdoor.', 'nusatron/marketplace/power-5v60a.svg', 2],
            ['Receiving Card 512x384 Pixel', 'Receiving card untuk mengatur modul LED dengan instalasi yang rapi dan mudah.', 'nusatron/marketplace/receiving-card.svg', 3],
            ['Kabinet Aluminium Die Cast 500x500', 'Kabinet aluminium ringan dan presisi untuk tampilan videotron yang rata.', 'nusatron/marketplace/kabinet-aluminium.svg', 4],
            ['Running Text P10 Full Color', 'Running text full color untuk promosi, informasi, dan papan nama toko.', 'nusatron/marketplace/running-text-p10.svg', 5],
            ['Kabel Data HUB75 30cm', 'Kabel data HUB75 untuk koneksi modul LED yang praktis dan rapi.', 'nusatron/marketplace/kabel-hub75.svg', 6],
        ];

        foreach ($rows as [$name, $description, $image, $sort]) {
            $exists = DB::table('marketplace_products')
                ->where('site_key', 'nusatron')
                ->where('name', $name)
                ->exists();

            if (! $exists) {
                DB::table('marketplace_products')->insert([
                    'site_key' => 'nusatron',
                    'name' => $name,
                    'description' => $description,
                    'image_path' => $image,
                    'sort_order' => $sort,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Intentionally empty: these are safe Nusatron-only recovery rows.
    }
};
