<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Memastikan marketplace Nusatron tidak kosong: isi dummy hanya jika belum ada satu pun produk.
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('marketplace_products')) {
            return;
        }
        if (DB::table('marketplace_products')->where('site_key', 'nusatron')->exists()) {
            return;
        }

        $dummy = [
            ['Modul LED P2.5 Indoor Full Color', 'Modul LED indoor dengan warna tajam dan refresh rate tinggi untuk kebutuhan display profesional.', 'nusatron/marketplace/modul-p25.svg'],
            ['Power Supply 5V 60A Outdoor', 'Power supply stabil dengan proteksi arus lebih untuk kabinet LED outdoor.', 'nusatron/marketplace/power-5v60a.svg'],
            ['Receiving Card 512x384 Pixel', 'Receiving card untuk mengatur modul LED dengan instalasi yang rapi dan mudah.', 'nusatron/marketplace/receiving-card.svg'],
            ['Kabinet Aluminium Die Cast 500x500', 'Kabinet aluminium ringan dan presisi untuk tampilan videotron yang rata.', 'nusatron/marketplace/kabinet-aluminium.svg'],
            ['Running Text P10 Full Color', 'Running text full color untuk promosi, informasi, dan papan nama toko.', 'nusatron/marketplace/running-text-p10.svg'],
            ['Kabel Data HUB75 30cm', 'Kabel data HUB75 untuk koneksi modul LED yang praktis dan rapi.', 'nusatron/marketplace/kabel-hub75.svg'],
        ];

        foreach ($dummy as $i => [$name, $description, $image]) {
            DB::table('marketplace_products')->insert([
                'site_key' => 'nusatron',
                'name' => $name,
                'description' => $description,
                'image_path' => $image,
                'sort_order' => $i + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        // Data produk tidak dihapus saat rollback.
    }
};
