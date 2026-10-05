<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('city', 120);
            $table->string('type', 40);
            $table->string('image_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('portfolio_brands', function (Blueprint $table) {
            $table->id();
            $table->string('image_path')->nullable();
            $table->enum('shape', ['circle', 'square'])->default('circle');
            $table->decimal('zoom', 4, 2)->default(1);
            $table->decimal('position_x', 5, 2)->default(50);
            $table->decimal('position_y', 5, 2)->default(50);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_brands');
        Schema::dropIfExists('portfolio_items');
    }
};
