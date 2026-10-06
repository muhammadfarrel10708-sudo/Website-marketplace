<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Menambah harga, kategori, jumlah terjual, dan tabel ulasan untuk marketplace Nusatron.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketplace_products', function (Blueprint $table) {
            if (! Schema::hasColumn('marketplace_products', 'price')) {
                $table->unsignedBigInteger('price')->default(0)->after('description');
            }
            if (! Schema::hasColumn('marketplace_products', 'category')) {
                $table->string('category', 80)->nullable()->after('price');
            }
            if (! Schema::hasColumn('marketplace_products', 'sold')) {
                $table->unsignedInteger('sold')->default(0)->after('category');
            }
        });

        if (! Schema::hasTable('marketplace_reviews')) {
            Schema::create('marketplace_reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('marketplace_product_id')->constrained('marketplace_products')->cascadeOnDelete();
                $table->string('name', 40);
                $table->unsignedTinyInteger('rating');
                $table->string('comment', 500);
                $table->timestamps();
                $table->index(['marketplace_product_id', 'created_at']);
            });
        }

        // Data dummy untuk 6 produk bawaan (hanya yang harganya masih kosong).
        $dummy = [
            'Modul LED P2.5 Indoor Full Color' => [185000, 'Modul LED', 128],
            'Power Supply 5V 60A Outdoor' => [365000, 'Power Supply', 96],
            'Receiving Card 512x384 Pixel' => [340000, 'Controller & Card', 74],
            'Kabinet Aluminium Die Cast 500x500' => [780000, 'Kabinet & Frame', 41],
            'Running Text P10 Full Color' => [1450000, 'Running Text', 33],
            'Kabel Data HUB75 30cm' => [60000, 'Kabel & Aksesoris', 215],
        ];
        $reviews = [
            [5, 'Budi S.', 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!'],
            [4, 'Rina A.', 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.'],
            [5, 'Agus W.', 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.'],
        ];

        foreach ($dummy as $name => [$price, $category, $sold]) {
            $row = DB::table('marketplace_products')
                ->where('site_key', 'nusatron')->where('name', $name)->first();
            if (! $row) {
                continue;
            }
            if ((int) $row->price === 0) {
                DB::table('marketplace_products')->where('id', $row->id)
                    ->update(['price' => $price, 'category' => $category, 'sold' => $sold]);
            }
            if (! DB::table('marketplace_reviews')->where('marketplace_product_id', $row->id)->exists()) {
                foreach ($reviews as $i => [$rating, $who, $comment]) {
                    DB::table('marketplace_reviews')->insert([
                        'marketplace_product_id' => $row->id,
                        'name' => $who,
                        'rating' => $rating,
                        'comment' => $comment,
                        'created_at' => now()->subDays(3 + $i * 6),
                        'updated_at' => now()->subDays(3 + $i * 6),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('marketplace_reviews');
        Schema::table('marketplace_products', function (Blueprint $table) {
            foreach (['price', 'category', 'sold'] as $col) {
                if (Schema::hasColumn('marketplace_products', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
