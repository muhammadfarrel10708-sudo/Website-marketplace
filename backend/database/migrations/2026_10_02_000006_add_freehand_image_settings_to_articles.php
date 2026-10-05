<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->double('image_zoom')->default(1)->after('image_path');
            $table->double('image_position_x')->default(0)->after('image_zoom');
            $table->double('image_position_y')->default(0)->after('image_position_x');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['image_zoom', 'image_position_x', 'image_position_y']);
        });
    }
};
