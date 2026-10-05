<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('placement', 20)->default('home')->after('slug');
            $table->index(['placement', 'is_active', 'published_at']);
            $table->dropUnique('articles_slug_unique');
            $table->unique(['placement', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropUnique(['placement', 'slug']);
            $table->dropIndex(['placement', 'is_active', 'published_at']);
            $table->unique('slug');
            $table->dropColumn('placement');
        });
    }
};
