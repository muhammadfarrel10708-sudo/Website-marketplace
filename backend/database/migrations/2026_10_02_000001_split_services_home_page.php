<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('placement', 20)->default('home')->after('is_active');
            $table->index(['placement', 'is_active', 'sort_order']);
        });

        // Data layanan yang sudah ada tetap dipertahankan. Setiap data lama
        // menjadi data Home sekaligus disalin ke halaman Layanan agar pemisahan
        // tidak membuat konten yang sebelumnya tampil menjadi hilang.
        $existing = DB::table('services')
            ->where('placement', 'home')
            ->get();

        foreach ($existing as $service) {
            DB::table('services')->insert([
                'title' => $service->title,
                'text' => $service->text,
                'image_path' => $service->image_path,
                'sort_order' => $service->sort_order,
                'is_active' => $service->is_active,
                'placement' => 'page',
                'created_at' => $service->created_at,
                'updated_at' => $service->updated_at,
            ]);
        }

        if (!DB::table('sections')->where('key', 'layanan_home')->exists()) {
            $pageSection = DB::table('sections')->where('key', 'layanan')->first();

            DB::table('sections')->insert([
                'key' => 'layanan_home',
                'title' => $pageSection?->title ?? 'Layanan Kami',
                'subtitle' => $pageSection?->subtitle,
                'created_at' => $pageSection?->created_at ?? now(),
                'updated_at' => $pageSection?->updated_at ?? now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('services')->where('placement', 'page')->delete();
        DB::table('sections')->where('key', 'layanan_home')->delete();

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['placement', 'is_active', 'sort_order']);
            $table->dropColumn('placement');
        });
    }
};
