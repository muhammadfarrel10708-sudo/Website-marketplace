<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// "sections" menyimpan judul & subjudul yang bisa diedit untuk blok-blok konten
// di landing page (Cara Kerja, dan nanti Layanan/Produk/Info Terbaru).
// Satu baris per "key". Baris dibuat lewat seeder, bukan lewat form tambah.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('key', 40)->unique();
            $table->string('title', 120);
            $table->string('subtitle', 300)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
