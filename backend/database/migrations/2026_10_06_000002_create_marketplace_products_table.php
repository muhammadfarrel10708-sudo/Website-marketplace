<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketplace_products', function (Blueprint $table) {
            $table->id();
            $table->string('site_key', 32)->index();
            $table->string('name', 160);
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['site_key', 'is_active', 'sort_order']);
        });

        $dummy = [
            ['Modul LED P2.5 Indoor Full Color', 'Modul LED indoor dengan warna tajam dan refresh rate tinggi untuk kebutuhan display profesional.', 'nusatron/marketplace/modul-p25.svg'],
            ['Power Supply 5V 60A Outdoor', 'Power supply stabil dengan proteksi arus lebih untuk kabinet LED outdoor.', 'nusatron/marketplace/power-5v60a.svg'],
            ['Receiving Card 512x384 Pixel', 'Receiving card untuk mengatur modul LED dengan instalasi yang rapi dan mudah.', 'nusatron/marketplace/receiving-card.svg'],
            ['Kabinet Aluminium Die Cast 500x500', 'Kabinet aluminium ringan dan presisi untuk tampilan videotron yang rata.', 'nusatron/marketplace/kabinet-aluminium.svg'],
            ['Running Text P10 Full Color', 'Running text full color untuk promosi, informasi, dan papan nama toko.', 'nusatron/marketplace/running-text-p10.svg'],
            ['Kabel Data HUB75 30cm', 'Kabel data HUB75 untuk koneksi modul LED yang praktis dan rapi.', 'nusatron/marketplace/kabel-hub75.svg'],
        ];

        foreach ($dummy as $i => [$name, $description, $image]) {
            \DB::table('marketplace_products')->insert([
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
        Schema::dropIfExists('marketplace_products');
    }
};
