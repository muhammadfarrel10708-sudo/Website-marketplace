<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    private string $site = 'nusatron';

    public function up(): void
    {
        $now = now();

        // Rapikan salinan Nusatron yang sebelumnya sempat dibuat dari Dzikround.
        // Hanya baris site_key=nusatron yang disentuh; data Dzikround tidak pernah dihapus.
        foreach ([
            'heroes', 'sections', 'work_steps', 'services', 'about_contents', 'products',
            'articles', 'advantages', 'company_stats', 'service_areas', 'about_page_items',
            'portfolio_items', 'portfolio_brands',
        ] as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'site_key')) {
                DB::table($table)->where('site_key', $this->site)->delete();
            }
        }

        $dummyUploads = public_path('uploads/nusatron');
        if (File::isDirectory($dummyUploads)) {
            File::deleteDirectory($dummyUploads);
        }

        $this->insertIfEmpty('sections', [
            ['key' => 'cara_kerja', 'title' => 'Cara Kerja Nusatron', 'subtitle' => 'Alur layanan sederhana dari konsultasi sampai pemasangan.'],
            ['key' => 'layanan', 'title' => 'Layanan Nusatron', 'subtitle' => 'Layanan LED dan videotron untuk berbagai kebutuhan.'],
            ['key' => 'tentang_kami_intro', 'title' => 'Tentang Nusatron', 'subtitle' => null],
            ['key' => 'tentang_kami_testimonials', 'title' => 'Pendapat Customer Kami', 'subtitle' => 'Contoh ulasan pelanggan Nusatron.'],
            ['key' => 'tentang_kami_projects', 'title' => 'Project', 'subtitle' => 'Contoh project Nusatron.'],
            ['key' => 'tentang_kami_brands', 'title' => 'Brand', 'subtitle' => 'Contoh brand yang bekerja sama dengan Nusatron.'],
            ['key' => 'area_layanan', 'title' => 'Area Layanan Nusatron', 'subtitle' => 'Wilayah layanan contoh.'],
            ['key' => 'produk', 'title' => 'Produk Nusatron', 'subtitle' => 'Contoh produk yang dapat dikelola dari admin.'],
            ['key' => 'info_terbaru', 'title' => 'Info Terbaru', 'subtitle' => 'Artikel dan informasi contoh Nusatron.'],
            ['key' => 'kenapa_pilih_kami', 'title' => 'Kenapa Harus Pilih Nusatron?', 'subtitle' => 'Keunggulan contoh untuk website Nusatron.'],
            ['key' => 'statistik_perusahaan', 'title' => 'Statistik Perusahaan Nusatron', 'subtitle' => null],
            ['key' => 'portofolio', 'title' => 'Portofolio Nusatron', 'subtitle' => 'Contoh portofolio.'],
            ['key' => 'portfolio_project', 'title' => 'Project', 'subtitle' => 'Contoh project Nusatron.'],
            ['key' => 'portfolio_brand', 'title' => 'Brand', 'subtitle' => 'Contoh brand Nusatron.'],
        ], $now);

        $this->insertIfEmpty('heroes', [
            ['title' => 'Nusatron — Solusi LED untuk Bisnis Anda', 'subtitle' => 'Konten dummy Nusatron. Silakan ubah melalui admin.', 'cta_label' => 'Konsultasi Sekarang', 'cta_url' => '#kontak', 'image_path' => 'nusatron/dummy/hero-1.svg', 'sort_order' => 1, 'is_active' => true],
            ['title' => 'Videotron dan Running Text Nusatron', 'subtitle' => 'Contoh slide kedua untuk website Nusatron.', 'cta_label' => 'Lihat Layanan', 'cta_url' => '/nusatron/layanan', 'image_path' => 'nusatron/dummy/hero-2.svg', 'sort_order' => 2, 'is_active' => true],
        ], $now);

        $this->insertIfEmpty('work_steps', [
            ['title' => 'Konsultasi', 'text' => 'Diskusikan kebutuhan ukuran, lokasi, dan spesifikasi LED yang dibutuhkan.', 'sort_order' => 1, 'is_active' => true],
            ['title' => 'Penawaran', 'text' => 'Nusatron menyiapkan rekomendasi dan estimasi berdasarkan kebutuhan Anda.', 'sort_order' => 2, 'is_active' => true],
            ['title' => 'Produksi & Instalasi', 'text' => 'Tim menyiapkan perangkat lalu melakukan pemasangan sesuai jadwal.', 'sort_order' => 3, 'is_active' => true],
            ['title' => 'Serah Terima', 'text' => 'Perangkat diuji dan diserahterimakan setelah seluruh fungsi berjalan.', 'sort_order' => 4, 'is_active' => true],
        ], $now);

        $this->insertIfEmpty('services', [
            ['title' => 'Videotron Indoor', 'text' => 'Contoh layanan videotron indoor untuk ruang dan event.', 'image_path' => 'nusatron/dummy/service-1.svg', 'sort_order' => 1, 'is_active' => true],
            ['title' => 'Videotron Outdoor', 'text' => 'Contoh layanan videotron outdoor untuk area terbuka.', 'image_path' => 'nusatron/dummy/service-2.svg', 'sort_order' => 2, 'is_active' => true],
            ['title' => 'Running Text', 'text' => 'Contoh layanan running text untuk informasi dan promosi.', 'image_path' => 'nusatron/dummy/service-3.svg', 'sort_order' => 3, 'is_active' => true],
        ], $now);

        $this->insertIfEmpty('about_contents', [
            ['title' => 'Tentang Nusatron', 'paragraph_one' => 'Nusatron adalah data dummy untuk website kedua. Konten ini sengaja dibuat terpisah dari Dzikround agar setiap akun dapat mengelola website masing-masing.', 'paragraph_two' => 'Semua teks dan gambar pada bagian ini dapat diganti dari dashboard Nusatron.', 'image_path' => 'nusatron/dummy/about.svg', 'sort_order' => 1, 'is_active' => true],
        ], $now);

        $this->insertIfEmpty('products', [
            ['title' => 'Videotron Indoor Nusatron', 'description' => 'Produk dummy untuk kebutuhan indoor.', 'image_path' => 'nusatron/dummy/product-1.svg', 'layout_variant' => 'card_1', 'items' => json_encode([['name' => 'P1.8 Indoor', 'text' => 'Contoh spesifikasi produk.'], ['name' => 'P2.5 Indoor', 'text' => 'Contoh spesifikasi produk.']]), 'sort_order' => 1, 'is_active' => true],
            ['title' => 'Videotron Outdoor Nusatron', 'description' => 'Produk dummy untuk kebutuhan outdoor.', 'image_path' => 'nusatron/dummy/product-2.svg', 'layout_variant' => 'card_1', 'items' => json_encode([['name' => 'P4 Outdoor', 'text' => 'Contoh spesifikasi produk.'], ['name' => 'P6 Outdoor', 'text' => 'Contoh spesifikasi produk.']]), 'sort_order' => 2, 'is_active' => true],
            ['title' => 'Running Text Nusatron', 'description' => 'Produk dummy untuk informasi digital.', 'image_path' => 'nusatron/dummy/product-3.svg', 'layout_variant' => 'card_2', 'items' => json_encode([['name' => 'Running Text Toko', 'text' => 'Contoh penggunaan.'], ['name' => 'Running Text Sekolah', 'text' => 'Contoh penggunaan.']]), 'sort_order' => 3, 'is_active' => true],
        ], $now);

        $articles = [
            ['title' => 'Mengenal Videotron untuk Kebutuhan Bisnis', 'slug' => 'nusatron-mengenal-videotron', 'published_at' => '2026-10-01', 'excerpt' => 'Artikel dummy Nusatron tentang penggunaan videotron.', 'body' => 'Ini adalah artikel dummy Nusatron. Isi artikel dapat diubah melalui dashboard.', 'image_path' => 'nusatron/dummy/article-1.svg', 'sort_order' => 1, 'is_active' => true],
            ['title' => 'Tips Memilih Running Text', 'slug' => 'nusatron-tips-running-text', 'published_at' => '2026-09-25', 'excerpt' => 'Artikel dummy Nusatron tentang running text.', 'body' => 'Ini adalah artikel dummy Nusatron. Silakan ganti dengan konten asli.', 'image_path' => 'nusatron/dummy/article-2.svg', 'sort_order' => 2, 'is_active' => true],
            ['title' => 'Perawatan LED Display', 'slug' => 'nusatron-perawatan-led-display', 'published_at' => '2026-09-18', 'excerpt' => 'Artikel dummy Nusatron tentang perawatan LED display.', 'body' => 'Ini adalah artikel dummy Nusatron.', 'image_path' => 'nusatron/dummy/article-3.svg', 'sort_order' => 3, 'is_active' => true],
        ];
        if (Schema::hasColumn('articles', 'placement')) {
            $articles[0]['placement'] = 'home';
            $articles[1]['placement'] = 'home';
            $articles[2]['placement'] = 'menu';
        }
        $this->insertIfEmpty('articles', $articles, $now);

        $this->insertIfEmpty('advantages', [
            ['icon' => 'shield', 'title' => 'Kualitas Terjaga', 'description' => 'Contoh keunggulan Nusatron untuk data awal.', 'sort_order' => 1, 'is_active' => true],
            ['icon' => 'money', 'title' => 'Harga Kompetitif', 'description' => 'Contoh keunggulan Nusatron untuk data awal.', 'sort_order' => 2, 'is_active' => true],
            ['icon' => 'wrench', 'title' => 'Dukungan Teknis', 'description' => 'Contoh keunggulan Nusatron untuk data awal.', 'sort_order' => 3, 'is_active' => true],
            ['icon' => 'clock', 'title' => 'Pengerjaan Terjadwal', 'description' => 'Contoh keunggulan Nusatron untuk data awal.', 'sort_order' => 4, 'is_active' => true],
        ], $now);

        $this->insertIfEmpty('company_stats', [
            ['value' => '2026', 'label' => 'Tahun Dummy', 'sort_order' => 1, 'is_active' => true],
            ['value' => '12+', 'label' => 'Project Contoh', 'sort_order' => 2, 'is_active' => true],
            ['value' => '8+', 'label' => 'Brand Contoh', 'sort_order' => 3, 'is_active' => true],
            ['value' => 'Nasional', 'label' => 'Cakupan Contoh', 'sort_order' => 4, 'is_active' => true],
        ], $now);

        $this->insertIfEmpty('service_areas', [
            ['title' => 'Surabaya', 'text' => 'Area dummy Nusatron.', 'sort_order' => 1, 'is_active' => true],
            ['title' => 'Sidoarjo', 'text' => 'Area dummy Nusatron.', 'sort_order' => 2, 'is_active' => true],
            ['title' => 'Malang', 'text' => 'Area dummy Nusatron.', 'sort_order' => 3, 'is_active' => true],
        ], $now);

        if (Schema::hasTable('about_page_items')) {
            $this->insertIfEmpty('about_page_items', [
                ['section_key' => 'intro', 'title' => 'Tentang Nusatron', 'subtitle' => 'Konten dummy', 'content_one' => 'Ini adalah konten dummy halaman Tentang Kami Nusatron.', 'content_two' => 'Konten ini terpisah dari Dzikround.', 'meta_one' => null, 'meta_two' => null, 'image_path' => 'nusatron/dummy/about.svg', 'sort_order' => 0, 'is_active' => true],
                ['section_key' => 'testimonials', 'title' => 'Customer Dummy 1', 'subtitle' => 'Perusahaan Contoh', 'content_one' => 'Ulasan dummy untuk Nusatron.', 'content_two' => null, 'meta_one' => 'P2.5', 'meta_two' => null, 'image_path' => null, 'sort_order' => 0, 'is_active' => true],
                ['section_key' => 'testimonials', 'title' => 'Customer Dummy 2', 'subtitle' => 'Toko Contoh', 'content_one' => 'Ulasan dummy kedua untuk Nusatron.', 'content_two' => null, 'meta_one' => 'P3', 'meta_two' => null, 'image_path' => null, 'sort_order' => 1, 'is_active' => true],
                ['section_key' => 'projects', 'title' => 'Project Dummy Nusatron', 'subtitle' => 'Surabaya', 'content_one' => null, 'content_two' => null, 'meta_one' => 'P2.5', 'meta_two' => null, 'image_path' => 'nusatron/dummy/project.svg', 'sort_order' => 0, 'is_active' => true],
                ['section_key' => 'projects', 'title' => 'Project Dummy Malang', 'subtitle' => 'Malang', 'content_one' => null, 'content_two' => null, 'meta_one' => 'P4', 'meta_two' => null, 'image_path' => 'nusatron/dummy/project.svg', 'sort_order' => 1, 'is_active' => true],
                ['section_key' => 'brands', 'title' => null, 'subtitle' => null, 'content_one' => null, 'content_two' => null, 'meta_one' => null, 'meta_two' => null, 'image_path' => 'nusatron/dummy/brand-1.svg', 'sort_order' => 0, 'is_active' => true],
                ['section_key' => 'brands', 'title' => null, 'subtitle' => null, 'content_one' => null, 'content_two' => null, 'meta_one' => null, 'meta_two' => null, 'image_path' => 'nusatron/dummy/brand-2.svg', 'sort_order' => 1, 'is_active' => true],
                ['section_key' => 'brands', 'title' => null, 'subtitle' => null, 'content_one' => null, 'content_two' => null, 'meta_one' => null, 'meta_two' => null, 'image_path' => 'nusatron/dummy/brand-3.svg', 'sort_order' => 2, 'is_active' => true],
            ], $now);
        }

        if (Schema::hasTable('portfolio_items')) {
            $this->insertIfEmpty('portfolio_items', [
                ['title' => 'Project Dummy Nusatron 1', 'city' => 'Surabaya', 'type' => 'P2.5', 'image_path' => 'nusatron/dummy/project.svg', 'sort_order' => 0, 'is_active' => true],
                ['title' => 'Project Dummy Nusatron 2', 'city' => 'Malang', 'type' => 'P4', 'image_path' => 'nusatron/dummy/project.svg', 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Project Dummy Nusatron 3', 'city' => 'Sidoarjo', 'type' => 'P3', 'image_path' => 'nusatron/dummy/project.svg', 'sort_order' => 2, 'is_active' => true],
            ], $now);
        }

        if (Schema::hasTable('portfolio_brands')) {
            $this->insertIfEmpty('portfolio_brands', [
                ['image_path' => 'nusatron/dummy/brand-1.svg', 'shape' => 'circle', 'zoom' => 1, 'position_x' => 50, 'position_y' => 50, 'sort_order' => 0, 'is_active' => true],
                ['image_path' => 'nusatron/dummy/brand-2.svg', 'shape' => 'square', 'zoom' => 1, 'position_x' => 50, 'position_y' => 50, 'sort_order' => 1, 'is_active' => true],
                ['image_path' => 'nusatron/dummy/brand-3.svg', 'shape' => 'circle', 'zoom' => 1, 'position_x' => 50, 'position_y' => 50, 'sort_order' => 2, 'is_active' => true],
            ], $now);
        }
    }

    private function insertIfEmpty(string $table, array $rows, $now): void
    {
        if (! Schema::hasTable($table)) return;
        if (DB::table($table)->where('site_key', $this->site)->exists()) return;

        $rows = array_map(function (array $row) use ($now) {
            $row['site_key'] = $this->site;
            $row['created_at'] = $now;
            $row['updated_at'] = $now;
            return $row;
        }, $rows);

        if ($rows) DB::table($table)->insert($rows);
    }

    public function down(): void
    {
        // Intentionally do not delete Nusatron data on rollback. The site is an independent tenant.
    }
};
