<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'heroes', 'sections', 'work_steps', 'services', 'about_contents', 'products',
        'articles', 'advantages', 'company_stats', 'service_areas', 'about_page_items',
    ];

    public function up(): void
    {
        if (! Schema::hasColumn('users', 'site_key')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('site_key', 30)->default('dzikround')->after('username')->index();
            });
        }

        foreach ($this->tables as $tableName) {
            if (! Schema::hasColumn($tableName, 'site_key')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->string('site_key', 30)->default('dzikround')->after('id')->index();
                });
            }
        }

        if (Schema::hasTable('sections')) {
            $hasComposite = $this->hasIndex('sections', 'sections_site_key_key_unique');
            if (! $hasComposite) {
                if ($this->hasIndex('sections', 'sections_key_unique')) {
                    Schema::table('sections', function (Blueprint $table) {
                        $table->dropUnique('sections_key_unique');
                    });
                }
                Schema::table('sections', function (Blueprint $table) {
                    $table->unique(['site_key', 'key']);
                });
            }
        }
    }

    private function hasIndex(string $table, string $index): bool
    {
        $rows = Schema::getIndexes($table);
        foreach ($rows as $row) {
            if (($row['name'] ?? null) === $index) return true;
        }
        return false;
    }

    public function down(): void
    {
        if (Schema::hasTable('sections')) {
            if ($this->hasIndex('sections', 'sections_site_key_key_unique')) {
                Schema::table('sections', function (Blueprint $table) {
                    $table->dropUnique('sections_site_key_key_unique');
                });
            }
            if (! $this->hasIndex('sections', 'sections_key_unique')) {
                Schema::table('sections', function (Blueprint $table) {
                    $table->unique('key');
                });
            }
        }

        foreach (array_reverse($this->tables) as $tableName) {
            if (Schema::hasColumn($tableName, 'site_key')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropIndex(['site_key']);
                    $table->dropColumn('site_key');
                });
            }
        }

        if (Schema::hasColumn('users', 'site_key')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropIndex(['site_key']);
                $table->dropColumn('site_key');
            });
        }
    }
};
