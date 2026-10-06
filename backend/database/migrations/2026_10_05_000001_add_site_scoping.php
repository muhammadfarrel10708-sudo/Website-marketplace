<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'heroes', 'sections', 'work_steps', 'services', 'about_contents', 'products',
        'articles', 'advantages', 'company_stats', 'service_areas', 'about_page_items',
        'portfolio_items', 'portfolio_brands',
    ];

    private array $textColumns = [
        'heroes' => ['title', 'subtitle', 'cta_label', 'cta_url'],
        'sections' => ['key', 'title', 'subtitle'],
        'work_steps' => ['title', 'text'],
        'services' => ['title', 'text'],
        'about_contents' => ['title', 'paragraph_one', 'paragraph_two'],
        'products' => ['title', 'description'],
        'articles' => ['title', 'slug', 'excerpt', 'body'],
        'advantages' => ['title', 'description'],
        'company_stats' => ['value', 'label'],
        'service_areas' => ['title', 'text'],
        'about_page_items' => ['section_key', 'title', 'subtitle', 'content_one', 'content_two', 'meta_one', 'meta_two'],
        'portfolio_items' => ['title', 'city', 'type'],
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

        // Site key menjadi bagian dari uniqueness karena setiap website punya konten sendiri.
        if (! $this->hasIndex('sections', 'sections_site_key_key_unique')) {
            if ($this->hasIndex('sections', 'sections_key_unique')) {
                Schema::table('sections', function (Blueprint $table) {
                    $table->dropUnique('sections_key_unique');
                });
            }
            Schema::table('sections', function (Blueprint $table) {
                $table->unique(['site_key', 'key']);
            });
        }

        if (! $this->hasIndex('articles', 'articles_site_key_placement_slug_unique')) {
            if ($this->hasIndex('articles', 'articles_placement_slug_unique')) {
                Schema::table('articles', function (Blueprint $table) {
                    $table->dropUnique('articles_placement_slug_unique');
                });
            }
            Schema::table('articles', function (Blueprint $table) {
                $table->unique(['site_key', 'placement', 'slug']);
            });
        }

        DB::table('users')->whereNull('site_key')->update(['site_key' => 'dzikround']);
        foreach ($this->tables as $tableName) {
            DB::table($tableName)->whereNull('site_key')->update(['site_key' => 'dzikround']);
        }

        $this->prepareUploads();
        $this->renameExistingBrandText();
        $this->duplicateSiteData();
    }

    private function prepareUploads(): void
    {
        $uploadsRoot = public_path('uploads');
        if (! File::isDirectory($uploadsRoot)) {
            return;
        }

        foreach (File::directories($uploadsRoot) as $directory) {
            $folder = basename($directory);
            if (in_array($folder, ['dzikround', 'nusatron'], true)) {
                continue;
            }

            foreach (File::allFiles($directory) as $file) {
                $relative = ltrim(str_replace($uploadsRoot, '', $file->getPathname()), DIRECTORY_SEPARATOR);
                foreach (['dzikround', 'nusatron'] as $site) {
                    $destination = $uploadsRoot.DIRECTORY_SEPARATOR.$site.DIRECTORY_SEPARATOR.$relative;
                    File::ensureDirectoryExists(dirname($destination));
                    if (! File::exists($destination)) {
                        File::copy($file->getPathname(), $destination);
                    }
                }
            }
        }

        foreach ($this->tables as $tableName) {
            $imageColumn = match ($tableName) {
                'heroes', 'about_contents', 'products', 'articles', 'about_page_items', 'portfolio_items', 'portfolio_brands', 'services' => 'image_path',
                default => null,
            };
            if (! $imageColumn) continue;

            DB::table($tableName)
                ->whereNotNull($imageColumn)
                ->where($imageColumn, 'not like', 'dzikround/%')
                ->where($imageColumn, 'not like', 'nusatron/%')
                ->update([$imageColumn => DB::raw("CONCAT('dzikround/', {$imageColumn})")]);
        }
    }

    private function renameExistingBrandText(): void
    {
        foreach ($this->textColumns as $tableName => $columns) {
            foreach ($columns as $column) {
                DB::table($tableName)
                    ->where('site_key', 'dzikround')
                    ->where($column, 'like', '%Nama Brand%')
                    ->update([$column => DB::raw("REPLACE(`{$column}`, 'Nama Brand', 'Dzikround')")]);
            }
        }
    }

    private function duplicateSiteData(): void
    {
        // NusatronSeeder may have already created the isolated copy if this
        // migration previously failed after the schema changes were applied.
        // Never duplicate an existing Nusatron dataset.
        foreach ($this->tables as $tableName) {
            if (DB::table($tableName)->where('site_key', 'nusatron')->exists()) {
                return;
            }
        }

        $now = now();

        foreach ($this->tables as $tableName) {
            $rows = DB::table($tableName)->where('site_key', 'dzikround')->get();
            foreach ($rows as $row) {
                $copy = (array) $row;
                unset($copy['id']);
                $copy['site_key'] = 'nusatron';
                $copy['created_at'] = $copy['created_at'] ?? $now;
                $copy['updated_at'] = $now;

                foreach ($this->textColumns[$tableName] ?? [] as $column) {
                    if (isset($copy[$column]) && is_string($copy[$column])) {
                        $copy[$column] = str_replace(['Dzikround', 'Nama Brand'], 'Nusatron', $copy[$column]);
                    }
                }

                if (isset($copy['image_path']) && is_string($copy['image_path']) && str_starts_with($copy['image_path'], 'dzikround/')) {
                    $copy['image_path'] = 'nusatron/'.substr($copy['image_path'], strlen('dzikround/'));
                }

                DB::table($tableName)->insert($copy);
            }
        }
    }

    private function hasIndex(string $table, string $index): bool
    {
        $rows = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [$index]);
        return count($rows) > 0;
    }

    public function down(): void
    {
        // Migration ini intentionally does not merge tenant data back together.
        // Removing it would risk deleting or overwriting content that belongs to either site.
        Schema::table('articles', function (Blueprint $table) {
            $table->dropUnique(['site_key', 'placement', 'slug']);
            $table->unique(['placement', 'slug']);
        });

        Schema::table('sections', function (Blueprint $table) {
            $table->dropUnique(['site_key', 'key']);
            $table->unique('key');
        });

        foreach (array_reverse($this->tables) as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropIndex(['site_key']);
                $table->dropColumn('site_key');
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['site_key']);
            $table->dropColumn('site_key');
        });
    }
};
