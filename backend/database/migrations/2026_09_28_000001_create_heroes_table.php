<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('heroes', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->string('subtitle', 400)->nullable();   // opsional
            $table->string('cta_label', 40)->nullable();   // opsional: teks tombol
            $table->string('cta_url', 255)->nullable();    // opsional: tujuan tombol
            $table->string('image_path');                  // lokasi file di public/uploads
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heroes');
    }
};
