<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE portfolio_brands MODIFY zoom DOUBLE NOT NULL DEFAULT 1, MODIFY position_x DOUBLE NOT NULL DEFAULT 50, MODIFY position_y DOUBLE NOT NULL DEFAULT 50");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE portfolio_brands MODIFY zoom DECIMAL(4,2) NOT NULL DEFAULT 1, MODIFY position_x DECIMAL(5,2) NOT NULL DEFAULT 50, MODIFY position_y DECIMAL(5,2) NOT NULL DEFAULT 50");
    }
};
