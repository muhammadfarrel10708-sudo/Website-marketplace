<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    public function up(): void
    {
        $dir = public_path('uploads/nusatron/dummy');
        File::ensureDirectoryExists($dir);

        $assets = [
            'hero-1.svg' => ['NUSATRON', 'Solusi LED untuk Bisnis'],
            'hero-2.svg' => ['NUSATRON', 'Videotron & Running Text'],
            'about.svg' => ['NUSATRON', 'Tentang Kami'],
            'service-1.svg' => ['INDOOR', 'Videotron Indoor'],
            'service-2.svg' => ['OUTDOOR', 'Videotron Outdoor'],
            'service-3.svg' => ['RUNNING TEXT', 'Digital Display'],
            'product-1.svg' => ['PRODUCT 01', 'P1.8 Indoor'],
            'product-2.svg' => ['PRODUCT 02', 'P4 Outdoor'],
            'product-3.svg' => ['PRODUCT 03', 'Running Text'],
            'article-1.svg' => ['INFO 01', 'Mengenal Videotron'],
            'article-2.svg' => ['INFO 02', 'Tips Running Text'],
            'article-3.svg' => ['INFO 03', 'Perawatan LED Display'],
            'project.svg' => ['PROJECT', 'Nusatron Project'],
            'brand-1.svg' => ['BRAND A', 'Partner Nusatron'],
            'brand-2.svg' => ['BRAND B', 'Partner Nusatron'],
            'brand-3.svg' => ['BRAND C', 'Partner Nusatron'],
        ];

        foreach ($assets as $filename => [$eyebrow, $title]) {
            $path = $dir.DIRECTORY_SEPARATOR.$filename;
            if (File::exists($path)) {
                continue;
            }

            $safeEyebrow = htmlspecialchars($eyebrow, ENT_QUOTES, 'UTF-8');
            $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
            $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#facc15"/><stop offset="1" stop-color="#ca8a04"/></linearGradient></defs>
<rect width="1200" height="700" rx="36" fill="#17130a"/><rect x="32" y="32" width="1136" height="636" rx="28" fill="url(#g)" opacity=".94"/>
<circle cx="1010" cy="150" r="120" fill="#fff" opacity=".18"/><circle cx="1040" cy="520" r="180" fill="#fff" opacity=".10"/>
<text x="90" y="250" font-family="Arial,Helvetica,sans-serif" font-size="42" font-weight="700" fill="#17130a">$safeEyebrow</text>
<text x="90" y="330" font-family="Arial,Helvetica,sans-serif" font-size="58" font-weight="800" fill="#17130a">$safeTitle</text>
<text x="90" y="410" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="#2b250f">Dummy content Nusatron — siap diedit dari dashboard.</text>
<rect x="90" y="480" width="260" height="62" rx="31" fill="#17130a"/><text x="220" y="522" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" fill="#fff">NUSATRON</text>
</svg>
SVG;
            File::put($path, $svg);
        }
    }

    public function down(): void
    {
        // Jangan menghapus aset tenant saat rollback.
    }
};
