<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        if (Article::count() > 0) return;

        $items = [
            ['videotron-gathering', '18 September 2026', 'Videotron Gathering untuk Event Indoor dan Outdoor Sesuai Kebutuhan', 'Videotron gathering membuat acara perusahaan, komunitas, maupun organisasi tampil lebih hidup dan profesional. Layar LED bisa menampilkan logo, video pembuka, presentasi, hingga agenda acara […]', [
                'Videotron gathering menjadi pilihan agar acara perusahaan, komunitas, dan organisasi tampil lebih hidup. Layar LED dapat dipakai untuk logo, video pembuka, presentasi, dokumentasi, live camera, hingga agenda acara.',
                'Kunci utamanya adalah perencanaan ukuran dan resolusi. Jarak pandang peserta dan ukuran ruangan menentukan pixel pitch yang tepat, sehingga teks tetap terbaca dan gambar tetap tajam.',
                'Untuk kebutuhan acara, pastikan juga ada jadwal pemasangan, teknisi standby, dan konten yang sudah disiapkan dalam resolusi layar.',
            ]],
            ['solusi-led', '21 August 2026', 'Solusi LED untuk Videotron, LED Display, dan Running Text', 'Mencari solusi LED untuk promosi, informasi, branding, hingga tampilan visual profesional? Kami menyediakan pengadaan dan instalasi LED videotron indoor maupun outdoor […]', [
                'Solusi LED mencakup videotron, LED display, dan running text yang disesuaikan dengan lokasi, jarak pandang, ukuran, dan kebutuhan pengguna.',
                'Kami tidak hanya menyediakan produk, tetapi juga membantu menentukan spesifikasi yang tepat sejak tahap perencanaan hingga pemasangan.',
                'Gunakan kalkulator videotron di website ini untuk mendapatkan gambaran awal pixel pitch dan resolusi yang dibutuhkan.',
            ]],
            ['teknisi-videotron', '14 July 2026', 'Teknisi Videotron | Perbaikan Videotron Indoor Outdoor', 'Videotron yang bermasalah dapat mengganggu promosi maupun penyampaian informasi. Layar berkedip, warna tidak merata, atau mati sebagian menjadi tanda perlu penanganan segera […]', [
                'Layar berkedip, warna tidak merata, atau mati sebagian adalah tanda videotron membutuhkan penanganan. Teknisi berpengalaman dapat menemukan penyebab kerusakan sejak awal.',
                'Perawatan berkala membantu memperpanjang umur modul LED, power supply, dan receiving card, terutama untuk videotron outdoor yang terpapar cuaca.',
                'Hubungi kami untuk jadwal service atau panggilan langsung.',
            ]],
            ['videotron-event', '2 June 2026', 'Videotron Event untuk Acara Indoor dan Outdoor Lebih Modern', 'Videotron event membantu menampilkan konten acara dengan visual besar dan terang, cocok untuk konser, wisuda, pernikahan, dan pameran […]', [
                'Videotron event cocok untuk konser, wisuda, pernikahan, dan pameran karena mampu menampilkan konten dengan visual besar dan terang.',
                'Pilih modul yang sesuai lokasi: indoor untuk ruangan tertutup, outdoor untuk area terbuka dengan tingkat kecerahan lebih tinggi.',
            ]],
            ['videotron-gereja', '20 May 2026', 'Videotron Gereja: Tampilan Jelas untuk Ibadah dan Kegiatan Jemaat', 'Videotron gereja menampilkan lirik lagu, ayat firman, dan informasi kegiatan agar jemaat mengikuti ibadah dengan lebih nyaman […]', [
                'Videotron gereja membantu menampilkan lirik lagu, ayat firman, dan pengumuman secara jelas untuk seluruh jemaat.',
                'Ukuran dan pixel pitch dipilih berdasarkan luas ruangan dan jarak jemaat terdekat, agar teks nyaman dibaca dari bangku mana pun.',
            ]],
            ['distributor-videotron', '5 April 2026', 'Distributor Videotron dan Penjualan Part LED untuk Wilayah Luas', 'Selain jasa pemasangan, kami juga melayani distribusi videotron dan penjualan part LED untuk kebutuhan proyek di berbagai kota […]', [
                'Kami melayani distribusi videotron serta penjualan spare-part seperti modul LED, power supply, dan controller untuk berbagai kota.',
                'Konsultasikan kebutuhan proyek Anda agar kami dapat merekomendasikan spesifikasi dan estimasi pengiriman.',
            ]],
        ];

        foreach ($items as $i => [$slug, $date, $title, $excerpt, $body]) {
            Article::create([
                'title' => $title,
                'slug' => $slug,
                'published_at' => date('Y-m-d', strtotime($date)),
                'excerpt' => $excerpt,
                'body' => implode("\n\n", $body),
                'sort_order' => $i + 1,
                'is_active' => true,
            ]);
        }
    }
}
