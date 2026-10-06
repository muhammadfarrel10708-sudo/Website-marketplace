<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// "site_settings" menyimpan pengaturan website yang bisa diedit admin
// (nomor WhatsApp tujuan, isi halaman Kontak + Kalkulator).
// Satu baris per (site_key, key); isinya JSON. Terpisah untuk Dzikround & Nusatron.
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('site_settings')) {
            return;
        }

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_key', 30)->default('dzikround')->index();
            $table->string('key', 60);
            $table->json('value')->nullable();
            $table->timestamps();

            $table->unique(['site_key', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
