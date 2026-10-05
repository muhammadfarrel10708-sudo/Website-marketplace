<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use App\Models\Advantage;
use App\Models\CompanyStat;
use App\Models\Section;
use App\Models\Product;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    /** Membuat baris judul section jika belum ada. Tidak menimpa judul yang sudah diedit admin. */
    public function run(): void
    {
        Section::firstOrCreate(
            ['key' => 'cara_kerja'],
            ['title' => 'Cara Kerja', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'layanan'],
            ['title' => 'Layanan Kami', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'tentang_kami_intro'],
            ['title' => 'Tentang Kami', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'tentang_kami_testimonials'],
            ['title' => 'Pendapat Customer Kami', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'tentang_kami_projects'],
            ['title' => 'Project', 'subtitle' => 'Hasil project yang telah dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.'],
        );

        Section::firstOrCreate(
            ['key' => 'tentang_kami_brands'],
            ['title' => 'Brand', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'area_layanan'],
            ['title' => 'Area Layanan Nama Brand', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'produk'],
            ['title' => 'Produk Kami', 'subtitle' => null],
        );

        Section::firstOrCreate(
            ['key' => 'info_terbaru'],
            ['title' => 'Info Terbaru', 'subtitle' => null],
        );

        // Produk awal mengikuti dua jenis card yang ada di landing page: card_1 untuk
        // kategori Videotron dan card_2 untuk Running Text. Seeder tidak menimpa data admin.
        if (Product::count() === 0) {
            Product::create([
                'title' => 'Videotron Indoor',
                'description' => 'Pilihan videotron indoor untuk kebutuhan ruang rapat, command center, studio, dan ruang kontrol.',
                'layout_variant' => 'card_1',
                'items' => [
                    ['name' => 'P1.25 Indoor', 'text' => 'Tampilan ultra tajam untuk ruang rapat, command center, studio, dan ruang kontrol.'],
                    ['name' => 'P1.53 Indoor', 'text' => 'Kualitas visual premium dengan detail gambar sangat jernih untuk kebutuhan profesional.'],
                    ['name' => 'P1.86 Indoor', 'text' => 'Pilihan ideal untuk auditorium, ballroom hotel, dan ruang presentasi modern.'],
                    ['name' => 'P2 Indoor', 'text' => 'Keseimbangan antara kualitas visual dan efisiensi anggaran untuk berbagai kebutuhan indoor.'],
                    ['name' => 'P2.5 Indoor', 'text' => 'Solusi indoor ekonomis dengan tampilan tetap tajam dan nyaman dilihat.'],
                ],
                'sort_order' => 1,
                'is_active' => true,
            ]);
            Product::create([
                'title' => 'Videotron Outdoor',
                'description' => 'Pilihan videotron outdoor untuk area terbuka dengan kebutuhan visual yang terang dan tahan cuaca.',
                'layout_variant' => 'card_1',
                'items' => [
                    ['name' => 'P3 Outdoor', 'text' => 'Cocok untuk area luar ruangan yang membutuhkan kualitas visual tinggi pada jarak dekat.'],
                    ['name' => 'P4 Outdoor', 'text' => 'Pilihan populer untuk papan informasi, reklame digital, dan media promosi luar ruang.'],
                    ['name' => 'P5 Outdoor', 'text' => 'Tahan cuaca dengan performa visual optimal untuk berbagai kebutuhan outdoor.'],
                    ['name' => 'P6 Outdoor', 'text' => 'Ideal untuk area jalan raya, gedung komersial, dan fasilitas publik.'],
                    ['name' => 'P8 Outdoor', 'text' => 'Solusi ekonomis untuk videotron berukuran besar dengan jarak pandang lebih jauh.'],
                ],
                'sort_order' => 2,
                'is_active' => true,
            ]);
            Product::create([
                'title' => 'Running Text',
                'description' => 'Running text untuk kebutuhan informasi, promosi, dan penyampaian pesan secara digital.',
                'layout_variant' => 'card_2',
                'items' => [
                    ['name' => 'Running Text Gereja', 'text' => 'Menampilkan jadwal ibadah, informasi kegiatan, dan pengumuman jemaat secara jelas.'],
                    ['name' => 'Running Text Masjid', 'text' => 'Menampilkan jadwal sholat, informasi kegiatan, dan pengumuman jamaah secara digital.'],
                    ['name' => 'Running Text Sekolah', 'text' => 'Media informasi sekolah yang praktis untuk siswa, guru, dan pengunjung.'],
                    ['name' => 'Running Text Toko', 'text' => 'Membantu promosi produk, diskon, dan informasi layanan secara menarik.'],
                    ['name' => 'Running Text Apotek', 'text' => 'Menyampaikan informasi layanan, jam operasional, dan promo kesehatan.'],
                    ['name' => 'Running Text Kantor', 'text' => 'Menyampaikan pengumuman internal dan informasi perusahaan.'],
                    ['name' => 'Running Text SPBU', 'text' => 'Menampilkan informasi layanan, harga BBM, dan pengumuman secara digital.'],
                ],
                'sort_order' => 3,
                'is_active' => true,
            ]);
        }


        Section::firstOrCreate(
            ['key' => 'kenapa_pilih_kami'],
            ['title' => 'Kenapa Harus Pilih Kami?', 'subtitle' => 'Jasa Videotron dan Jual LED Running Text'],
        );

        Section::firstOrCreate(
            ['key' => 'statistik_perusahaan'],
            ['title' => 'Statistik Perusahaan Kami', 'subtitle' => null],
        );

        if (Advantage::count() === 0) {
            $advantages = [
                ['icon' => 'shield', 'title' => 'Jaminan Kualitas', 'description' => 'Kualitas produk running text dan videotron kami terjaga, dan banyak klien yang puas dengan hasilnya.'],
                ['icon' => 'money', 'title' => 'Harga Terjangkau', 'description' => 'Harga videotron indoor dan outdoor per meter dengan biaya bersahabat, kualitas tetap terjamin.'],
                ['icon' => 'wrench', 'title' => 'Produk Bergaransi', 'description' => 'Garansi 3 bulan pertama untuk gratis biaya service dan penggantian sparepart.'],
                ['icon' => 'clock', 'title' => 'Layanan Tepat Waktu', 'description' => 'Dikerjakan cepat, tepat, dan rapi: dalam 3–5 hari videotron Anda siap tayang.'],
            ];
            foreach ($advantages as $i => $item) {
                Advantage::create($item + ['sort_order' => $i + 1, 'is_active' => true]);
            }
        }

        if (CompanyStat::count() === 0) {
            $stats = [
                ['value' => '2015', 'label' => 'Tahun Berdiri'],
                ['value' => '120+', 'label' => 'Project Selesai'],
                ['value' => '80+', 'label' => 'Brand Klien'],
                ['value' => 'Nasional', 'label' => 'Cakupan Layanan'],
            ];
            foreach ($stats as $i => $item) {
                CompanyStat::create($item + ['sort_order' => $i + 1, 'is_active' => true]);
            }
        }

        // Konten awal blok "Tentang Kami" di landing page.
        // firstOrCreate menjaga perubahan admin agar tidak ditimpa ketika seeder dijalankan lagi.
        AboutContent::firstOrCreate(
            ['sort_order' => 1],
            [
                'title' => 'Supplier Jual Running Text & Videotron Surabaya',
                'paragraph_one' => 'Lagi cari penyedia layanan pembuatan videotron yang aman, terpercaya, dan berpengalaman? Nama Brand siap jadi solusinya.',
                'paragraph_two' => 'Kami melayani pembuatan videotron/megatron untuk kebutuhan indoor maupun outdoor, serta jasa pembuatan LED running text. Sejak 2015, kami dipercaya berbagai instansi, perusahaan, sekolah, rumah ibadah, dan hotel.',
                'image_path' => null,
                'is_active' => true,
            ],
        );
    }
}
