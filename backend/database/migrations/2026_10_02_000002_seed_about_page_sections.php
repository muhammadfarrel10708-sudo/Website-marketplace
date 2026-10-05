<?php

use App\Models\Section;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $sections = [
            'tentang_kami_intro' => ['title' => 'Tentang Kami', 'subtitle' => null],
            'tentang_kami_testimonials' => ['title' => 'Pendapat Customer Kami', 'subtitle' => null],
            'tentang_kami_projects' => [
                'title' => 'Project',
                'subtitle' => 'Hasil project yang telah dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.',
            ],
            'tentang_kami_brands' => ['title' => 'Brand', 'subtitle' => null],
        ];

        foreach ($sections as $key => $values) {
            Section::firstOrCreate(['key' => $key], $values);
        }
    }

    public function down(): void
    {
        Section::whereIn('key', [
            'tentang_kami_intro',
            'tentang_kami_testimonials',
            'tentang_kami_projects',
            'tentang_kami_brands',
        ])->delete();
    }
};
