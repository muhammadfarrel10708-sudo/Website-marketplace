<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_page_items', function (Blueprint $table) {
            $table->id();
            $table->string('section_key', 40);
            $table->string('title', 180)->nullable();
            $table->string('subtitle', 180)->nullable();
            $table->text('content_one')->nullable();
            $table->text('content_two')->nullable();
            $table->string('meta_one', 120)->nullable();
            $table->string('meta_two', 180)->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['section_key', 'is_active', 'sort_order']);
        });

        DB::table('about_page_items')->insert([
            [
                'section_key' => 'intro',
                'title' => 'Tentang Kami',
                'subtitle' => null,
                'content_one' => 'Nama Brand telah melayani lebih dari 120+ customer di berbagai Provinsi di Indonesia',
                'content_two' => 'Berdiri sejak 2015, kami fokus pada pembuatan LED videotron, LED running text, dan advertising untuk instansi, perusahaan, sekolah, rumah ibadah, dan hotel.',
                'meta_one' => null,
                'meta_two' => null,
                'image_path' => null,
                'sort_order' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'section_key' => 'testimonials', 'title' => 'Budi Santoso', 'subtitle' => 'PT Media Vision',
                'content_one' => 'LED-nya keren, kualitasnya mantap! Pemasangannya gesit dan rapi. Sekarang videotron di tempat kami benar-benar terlihat profesional, terang, dan jernih.',
                'content_two' => null, 'meta_one' => 'P2.5', 'meta_two' => null, 'image_path' => null, 'sort_order' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'section_key' => 'testimonials', 'title' => 'Andi Pratama', 'subtitle' => 'Cafe & Resto Lumina',
                'content_one' => 'Pelayanan luar biasa! Proses pemasangan cepat, hasilnya rapi, dan kualitas LED-nya sangat memuaskan.',
                'content_two' => null, 'meta_one' => 'P2.5', 'meta_two' => null, 'image_path' => null, 'sort_order' => 1, 'is_active' => true, 'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'section_key' => 'testimonials', 'title' => 'Rina Wijaya', 'subtitle' => 'Hotel Contoh',
                'content_one' => 'Tim responsif dan hasil akhirnya sesuai harapan. Videotron ballroom kami tampil tajam untuk setiap acara.',
                'content_two' => null, 'meta_one' => 'P3', 'meta_two' => null, 'image_path' => null, 'sort_order' => 2, 'is_active' => true, 'created_at' => now(), 'updated_at' => now(),
            ],
            ...array_map(
                fn (array $item, int $i) => [
                    'section_key' => 'projects', 'title' => $item[0], 'subtitle' => $item[1], 'content_one' => null, 'content_two' => null,
                    'meta_one' => $item[2], 'meta_two' => null, 'image_path' => null, 'sort_order' => $i, 'is_active' => true, 'created_at' => now(), 'updated_at' => now(),
                ],
                [
                    ['Real X Club', 'Surabaya', 'P2.5'], ['Sekolah Contoh', 'Malang', 'P2.5'], ['Kebun Binatang', 'Surabaya', 'P4'],
                    ['Gedung Serbaguna', 'Sidoarjo', 'P3'], ['Koarmada II', 'Surabaya', 'P2.5'], ['Hotel Bintang', 'Surabaya', 'P1.86'],
                    ['Masjid Agung', 'Gresik', 'P4'], ['Kampus Contoh', 'Surabaya', 'P2'], ['Mall Contoh', 'Malang', 'P3'],
                    ['Gereja Contoh', 'Surabaya', 'P2.5'], ['Kantor Pemda', 'Mojokerto', 'P4'], ['Ballroom Contoh', 'Surabaya', 'P1.53'],
                    ['SPBU Contoh', 'Sidoarjo', 'P6'], ['Cafe Contoh', 'Surabaya', 'P2.5'],
                ],
                array_keys([0,1,2,3,4,5,6,7,8,9,10,11,12,13])
            ),
            ...array_map(
                fn (string $brand, int $i) => [
                    'section_key' => 'brands', 'title' => $brand, 'subtitle' => null, 'content_one' => null, 'content_two' => null,
                    'meta_one' => null, 'meta_two' => null, 'image_path' => null, 'sort_order' => $i, 'is_active' => true, 'created_at' => now(), 'updated_at' => now(),
                ],
                ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F', 'Brand G', 'Brand H', 'Brand I', 'Brand J', 'Brand K', 'Brand L'],
                array_keys([0,1,2,3,4,5,6,7,8,9,10,11])
            ),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('about_page_items');
    }
};
