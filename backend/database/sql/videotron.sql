-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Okt 2026 pada 12.01
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `videotron`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `about_contents`
--

DROP TABLE IF EXISTS `about_contents`;
CREATE TABLE `about_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(180) NOT NULL,
  `paragraph_one` text NOT NULL,
  `paragraph_two` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `about_contents`
--

INSERT INTO `about_contents` (`id`, `site_key`, `title`, `paragraph_one`, `paragraph_two`, `image_path`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Tentang Nusatron', 'Nusatron adalah data dummy untuk website kedua. Konten ini sengaja dibuat terpisah dari Dzikround agar setiap akun dapat mengelola website masing-masing.', 'Semua teks dan gambar pada bagian ini dapat diganti dari dashboard Nusatron.', 'nusatron/dummy/about.svg', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `about_page_items`
--

DROP TABLE IF EXISTS `about_page_items`;
CREATE TABLE `about_page_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `section_key` varchar(40) NOT NULL,
  `title` varchar(180) DEFAULT NULL,
  `subtitle` varchar(180) DEFAULT NULL,
  `content_one` text DEFAULT NULL,
  `content_two` text DEFAULT NULL,
  `meta_one` varchar(120) DEFAULT NULL,
  `meta_two` varchar(180) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `about_page_items`
--

INSERT INTO `about_page_items` (`id`, `site_key`, `section_key`, `title`, `subtitle`, `content_one`, `content_two`, `meta_one`, `meta_two`, `image_path`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'dzikround', 'intro', 'Tentang Kami', NULL, 'Dzikround telah melayani lebih dari 120+ customer di berbagai Provinsi di Indonesia', 'Berdiri sejak 2015, kami fokus pada pembuatan LED videotron, LED running text, dan advertising untuk instansi, perusahaan, sekolah, rumah ibadah, dan hotel.', NULL, NULL, NULL, 0, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(2, 'dzikround', 'testimonials', 'Budi Santoso', 'PT Media Vision', 'LED-nya keren, kualitasnya mantap! Pemasangannya gesit dan rapi. Sekarang videotron di tempat kami benar-benar terlihat profesional, terang, dan jernih.', NULL, 'P2.5', NULL, NULL, 0, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(3, 'dzikround', 'testimonials', 'Andi Pratama', 'Cafe & Resto Lumina', 'Pelayanan luar biasa! Proses pemasangan cepat, hasilnya rapi, dan kualitas LED-nya sangat memuaskan.', NULL, 'P2.5', NULL, NULL, 1, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(4, 'dzikround', 'testimonials', 'Rina Wijaya', 'Hotel Contoh', 'Tim responsif dan hasil akhirnya sesuai harapan. Videotron ballroom kami tampil tajam untuk setiap acara.', NULL, 'P3', NULL, NULL, 2, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(5, 'dzikround', 'projects', 'Real X Club', 'Surabaya', NULL, NULL, 'P2.5', NULL, NULL, 0, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(6, 'dzikround', 'projects', 'Sekolah Contoh', 'Malang', NULL, NULL, 'P2.5', NULL, NULL, 1, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(7, 'dzikround', 'projects', 'Kebun Binatang', 'Surabaya', NULL, NULL, 'P4', NULL, NULL, 2, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(8, 'dzikround', 'projects', 'Gedung Serbaguna', 'Sidoarjo', NULL, NULL, 'P3', NULL, NULL, 3, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(9, 'dzikround', 'projects', 'Koarmada II', 'Surabaya', NULL, NULL, 'P2.5', NULL, NULL, 4, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(10, 'dzikround', 'projects', 'Hotel Bintang', 'Surabaya', NULL, NULL, 'P1.86', NULL, NULL, 5, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(11, 'dzikround', 'projects', 'Masjid Agung', 'Gresik', NULL, NULL, 'P4', NULL, NULL, 6, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(12, 'dzikround', 'projects', 'Kampus Contoh', 'Surabaya', NULL, NULL, 'P2', NULL, NULL, 7, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(13, 'dzikround', 'projects', 'Mall Contoh', 'Malang', NULL, NULL, 'P3', NULL, NULL, 8, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(14, 'dzikround', 'projects', 'Gereja Contoh', 'Surabaya', NULL, NULL, 'P2.5', NULL, NULL, 9, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(15, 'dzikround', 'projects', 'Kantor Pemda', 'Mojokerto', NULL, NULL, 'P4', NULL, NULL, 10, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(16, 'dzikround', 'projects', 'Ballroom Contoh', 'Surabaya', NULL, NULL, 'P1.53', NULL, NULL, 11, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(17, 'dzikround', 'projects', 'SPBU Contoh', 'Sidoarjo', NULL, NULL, 'P6', NULL, NULL, 12, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(18, 'dzikround', 'projects', 'Cafe Contoh', 'Surabaya', NULL, NULL, 'P2.5', NULL, NULL, 13, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(19, 'dzikround', 'brands', 'Brand A', NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(20, 'dzikround', 'brands', 'Brand B', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(21, 'dzikround', 'brands', 'Brand C', NULL, NULL, NULL, NULL, NULL, NULL, 2, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(22, 'dzikround', 'brands', 'Brand D', NULL, NULL, NULL, NULL, NULL, NULL, 3, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(23, 'dzikround', 'brands', 'Brand E', NULL, NULL, NULL, NULL, NULL, NULL, 4, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(24, 'dzikround', 'brands', 'Brand F', NULL, NULL, NULL, NULL, NULL, NULL, 5, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(25, 'dzikround', 'brands', 'Brand G', NULL, NULL, NULL, NULL, NULL, NULL, 6, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(26, 'dzikround', 'brands', 'Brand H', NULL, NULL, NULL, NULL, NULL, NULL, 7, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(27, 'dzikround', 'brands', 'Brand I', NULL, NULL, NULL, NULL, NULL, NULL, 8, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(28, 'dzikround', 'brands', 'Brand J', NULL, NULL, NULL, NULL, NULL, NULL, 9, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(29, 'dzikround', 'brands', 'Brand K', NULL, NULL, NULL, NULL, NULL, NULL, 10, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(30, 'dzikround', 'brands', 'Brand L', NULL, NULL, NULL, NULL, NULL, NULL, 11, 1, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(61, 'nusatron', 'intro', 'Tentang Nusatron', 'Konten dummy', 'Ini adalah konten dummy halaman Tentang Kami Nusatron.', 'Konten ini terpisah dari Dzikround.', NULL, NULL, 'nusatron/dummy/about.svg', 0, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(62, 'nusatron', 'testimonials', 'Customer Dummy 1', 'Perusahaan Contoh', 'Ulasan dummy untuk Nusatron.', NULL, 'P2.5', NULL, NULL, 0, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(63, 'nusatron', 'testimonials', 'Customer Dummy 2', 'Toko Contoh', 'Ulasan dummy kedua untuk Nusatron.', NULL, 'P3', NULL, NULL, 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(64, 'nusatron', 'projects', 'Tes 1', 'Surabaya', NULL, NULL, 'P2.10', '{\"shape\":\"square\",\"zoom\":1.12,\"offsetX\":0,\"offsetY\":0,\"ratio\":1.3333}', 'nusatron/about-page/jYEiUtU7aXap1pTL2OEiBTX5dLZWiJBJNLanrVYi.webp', 0, 1, '2026-10-05 02:53:13', '2026-10-06 00:23:22'),
(65, 'nusatron', 'projects', 'Project Dummy Malang', 'Malang', NULL, NULL, 'P4', NULL, 'nusatron/dummy/project.svg', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(66, 'nusatron', 'brands', NULL, NULL, NULL, NULL, NULL, '{\"shape\":\"circle\",\"zoom\":1.4049,\"offsetX\":3.56,\"offsetY\":-4.44,\"ratio\":1}', 'nusatron/about-page/FNalBrXBgUuaA094pKu83QiHYlSoumDkHwjKGuza.webp', 0, 1, '2026-10-05 02:53:13', '2026-10-06 00:29:35'),
(67, 'nusatron', 'brands', NULL, NULL, NULL, NULL, NULL, NULL, 'nusatron/dummy/brand-2.svg', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(68, 'nusatron', 'brands', NULL, NULL, NULL, NULL, NULL, NULL, 'nusatron/dummy/brand-3.svg', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(69, 'nusatron', 'projects', 'Tes', 'Surabaya', NULL, NULL, 'P10.5', '{\"shape\":\"square\",\"zoom\":1,\"offsetX\":0,\"offsetY\":0,\"ratio\":1.3333}', 'nusatron/about-page/9nnJCXngmmPZIBDmdVmM8qylXt4efFuQPKeBlaos.webp', 2, 1, '2026-10-06 00:24:13', '2026-10-06 00:24:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `advantages`
--

DROP TABLE IF EXISTS `advantages`;
CREATE TABLE `advantages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `icon` varchar(40) NOT NULL DEFAULT 'shield',
  `title` varchar(120) NOT NULL,
  `description` varchar(500) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `advantages`
--

INSERT INTO `advantages` (`id`, `site_key`, `icon`, `title`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'shield', 'Kualitas Terjaga', 'Contoh keunggulan Nusatron untuk data awal.', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', 'money', 'Harga Kompetitif', 'Contoh keunggulan Nusatron untuk data awal.', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', 'wrench', 'Dukungan Teknis', 'Contoh keunggulan Nusatron untuk data awal.', 3, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(4, 'nusatron', 'clock', 'Pengerjaan Terjadwal', 'Contoh keunggulan Nusatron untuk data awal.', 4, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(180) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `placement` varchar(20) NOT NULL DEFAULT 'home',
  `published_at` date DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `image_zoom` double NOT NULL DEFAULT 1,
  `image_position_x` double NOT NULL DEFAULT 0,
  `image_position_y` double NOT NULL DEFAULT 0,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `articles`
--

INSERT INTO `articles` (`id`, `site_key`, `title`, `slug`, `placement`, `published_at`, `excerpt`, `body`, `image_path`, `image_zoom`, `image_position_x`, `image_position_y`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Mengenal Videotron untuk Kebutuhan Bisnis', 'nusatron-mengenal-videotron', 'home', '2026-10-01', 'Artikel dummy Nusatron tentang penggunaan videotron.', 'Ini adalah artikel dummy Nusatron. Isi artikel dapat diubah melalui dashboard.', 'nusatron/dummy/article-1.svg', 1, 0, 0, 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', 'Tips Memilih Running Text', 'nusatron-tips-running-text', 'home', '2026-09-25', 'Artikel dummy Nusatron tentang running text.', 'Ini adalah artikel dummy Nusatron. Silakan ganti dengan konten asli.', 'nusatron/dummy/article-2.svg', 1, 0, 0, 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', 'Perawatan LED Display', 'nusatron-perawatan-led-display', 'menu', '2026-09-18', 'Artikel dummy Nusatron tentang perawatan LED display.', 'Ini adalah artikel dummy Nusatron.', 'nusatron/dummy/article-3.svg', 1, 0, 0, 3, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `company_stats`
--

DROP TABLE IF EXISTS `company_stats`;
CREATE TABLE `company_stats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `value` varchar(80) NOT NULL,
  `label` varchar(120) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `company_stats`
--

INSERT INTO `company_stats` (`id`, `site_key`, `value`, `label`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', '2026', 'Tahun Dummy', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', '12+', 'Project Contoh', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', '8+', 'Brand Contoh', 3, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(4, 'nusatron', 'Nasional', 'Cakupan Contoh', 4, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `heroes`
--

DROP TABLE IF EXISTS `heroes`;
CREATE TABLE `heroes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(120) NOT NULL,
  `subtitle` varchar(400) DEFAULT NULL,
  `cta_label` varchar(40) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `heroes`
--

INSERT INTO `heroes` (`id`, `site_key`, `title`, `subtitle`, `cta_label`, `cta_url`, `image_path`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(5, 'nusatron', 'LED Videotron, Solusi Visual untuk Bisnis Anda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', NULL, NULL, 'nusatron/heroes/C1q6gFA6Eu6oGxS1V5fboDnSwLAsWySfoJTkEHJE.webp', 1, 1, '2026-10-06 00:13:36', '2026-10-06 00:13:36'),
(6, 'nusatron', 'Solusi Visual Terpercaya', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', NULL, NULL, 'nusatron/heroes/Pvy9Ev96gxleUwFrhPgRQyfYVcCBK14Rfbv6DWh6.webp', 2, 1, '2026-10-06 00:30:43', '2026-10-06 00:30:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `marketplace_products`
--

DROP TABLE IF EXISTS `marketplace_products`;
CREATE TABLE `marketplace_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(32) NOT NULL,
  `name` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `price` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `category` varchar(80) DEFAULT NULL,
  `sold` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `marketplace_products`
--

INSERT INTO `marketplace_products` (`id`, `site_key`, `name`, `description`, `price`, `category`, `sold`, `image_path`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Nusatron Videotron', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 100000, 'LED', 0, 'nusatron/marketplace/qEXb7nQpgf4x5WtqDGG7cUsJW0hOzY9GcjnqsGg4.webp', 1, 1, '2026-10-05 21:46:31', '2026-10-06 00:11:49'),
(2, 'nusatron', 'Power Supply 5V 60A Outdoor', 'Power supply stabil dengan proteksi arus lebih untuk kabinet LED outdoor.', 365000, 'Power Supply', 96, 'nusatron/marketplace/power-5v60a.svg', 2, 1, '2026-10-05 21:46:31', '2026-10-05 21:46:31'),
(3, 'nusatron', 'Receiving Card 512x384 Pixel', 'Receiving card untuk mengatur modul LED dengan instalasi yang rapi dan mudah.', 340000, 'Controller & Card', 74, 'nusatron/marketplace/receiving-card.svg', 3, 1, '2026-10-05 21:46:31', '2026-10-05 21:46:31'),
(4, 'nusatron', 'Kabinet Aluminium Die Cast 500x500', 'Kabinet aluminium ringan dan presisi untuk tampilan videotron yang rata.', 780000, 'Kabinet & Frame', 41, 'nusatron/marketplace/kabinet-aluminium.svg', 4, 1, '2026-10-05 21:46:31', '2026-10-05 21:46:31'),
(5, 'nusatron', 'Running Text P10 Full Color', 'Running text full color untuk promosi, informasi, dan papan nama toko.', 1450000, 'Running Text', 33, 'nusatron/marketplace/running-text-p10.svg', 5, 1, '2026-10-05 21:46:31', '2026-10-05 21:46:31'),
(6, 'nusatron', 'Kabel Data HUB75 30cm', 'Kabel data HUB75 untuk koneksi modul LED yang praktis dan rapi.', 60000, 'Kabel & Aksesoris', 215, 'nusatron/marketplace/kabel-hub75.svg', 6, 1, '2026-10-05 21:46:31', '2026-10-05 21:46:31'),
(7, 'nusatron', 'Modul LED P2.5 Indoor Full Color', 'Modul LED indoor dengan warna tajam dan refresh rate tinggi untuk kebutuhan display profesional.', 185000, 'Modul LED', 128, 'nusatron/marketplace/modul-p25.svg', 1, 1, '2026-10-05 23:56:48', '2026-10-05 23:56:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `marketplace_reviews`
--

DROP TABLE IF EXISTS `marketplace_reviews`;
CREATE TABLE `marketplace_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `marketplace_product_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `marketplace_reviews`
--

INSERT INTO `marketplace_reviews` (`id`, `marketplace_product_id`, `name`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 7, 'Budi S.', 5, 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', '2026-10-03 00:11:09', '2026-10-03 00:11:09'),
(2, 7, 'Rina A.', 4, 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.', '2026-09-27 00:11:09', '2026-09-27 00:11:09'),
(3, 7, 'Agus W.', 5, 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.', '2026-09-21 00:11:09', '2026-09-21 00:11:09'),
(4, 2, 'Budi S.', 5, 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', '2026-10-03 00:11:09', '2026-10-03 00:11:09'),
(5, 2, 'Rina A.', 4, 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.', '2026-09-27 00:11:09', '2026-09-27 00:11:09'),
(6, 2, 'Agus W.', 5, 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.', '2026-09-21 00:11:09', '2026-09-21 00:11:09'),
(7, 3, 'Budi S.', 5, 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', '2026-10-03 00:11:09', '2026-10-03 00:11:09'),
(8, 3, 'Rina A.', 4, 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.', '2026-09-27 00:11:09', '2026-09-27 00:11:09'),
(9, 3, 'Agus W.', 5, 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.', '2026-09-21 00:11:09', '2026-09-21 00:11:09'),
(10, 4, 'Budi S.', 5, 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', '2026-10-03 00:11:09', '2026-10-03 00:11:09'),
(11, 4, 'Rina A.', 4, 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.', '2026-09-27 00:11:09', '2026-09-27 00:11:09'),
(12, 4, 'Agus W.', 5, 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.', '2026-09-21 00:11:09', '2026-09-21 00:11:09'),
(13, 5, 'Budi S.', 5, 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', '2026-10-03 00:11:09', '2026-10-03 00:11:09'),
(14, 5, 'Rina A.', 4, 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.', '2026-09-27 00:11:09', '2026-09-27 00:11:09'),
(15, 5, 'Agus W.', 5, 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.', '2026-09-21 00:11:09', '2026-09-21 00:11:09'),
(16, 6, 'Budi S.', 5, 'Barang sesuai deskripsi, packing rapi, dan pengiriman cepat. Recommended!', '2026-10-03 00:11:09', '2026-10-03 00:11:09'),
(17, 6, 'Rina A.', 4, 'Produk bagus dan berfungsi baik. Semoga stok selalu tersedia.', '2026-09-27 00:11:09', '2026-09-27 00:11:09'),
(18, 6, 'Agus W.', 5, 'Kualitas bagus, sudah dipasang dan berjalan lancar. Admin responsif.', '2026-09-21 00:11:09', '2026-09-21 00:11:09'),
(19, 1, 'Farel', 5, 'Mantep', '2026-10-06 00:12:27', '2026-10-06 00:12:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_09_28_000000_add_username_to_users_table', 1),
(6, '2026_09_28_000001_create_heroes_table', 1),
(7, '2026_09_29_000001_create_sections_table', 1),
(8, '2026_09_29_000002_create_work_steps_table', 1),
(9, '2026_09_30_000001_create_services_table', 1),
(10, '2026_09_30_000002_create_about_contents_table', 1),
(11, '2026_09_30_000003_create_products_table', 1),
(12, '2026_09_30_000004_create_articles_table', 1),
(13, '2026_09_30_000005_create_advantages_table', 1),
(14, '2026_09_30_000006_create_company_stats_table', 1),
(15, '2026_10_01_000001_create_service_areas_table', 1),
(16, '2026_10_01_000002_add_content_to_sections_table', 1),
(17, '2026_10_01_000003_create_about_page_items_table', 1),
(18, '2026_10_02_000001_split_services_home_page', 1),
(19, '2026_09_29_000000_add_site_scoping_before_content_seed', 2),
(20, '2026_10_02_000002_seed_about_page_sections', 2),
(21, '2026_10_02_000003_create_portfolio_tables', 2),
(22, '2026_10_02_000004_seed_portfolio_content', 2),
(23, '2026_10_02_000005_expand_portfolio_brand_freehand', 2),
(24, '2026_10_02_000006_add_freehand_image_settings_to_articles', 2),
(25, '2026_10_02_000007_separate_home_and_menu_articles', 2),
(26, '2026_10_05_000001_add_site_scoping', 2),
(27, '2026_10_05_000002_clear_nusatron_content', 2),
(28, '2026_10_05_000003_seed_nusatron_dummy_content', 2),
(29, '2026_10_06_000001_repair_nusatron_dummy_assets', 3),
(30, '2026_10_06_000002_create_marketplace_products_table', 4),
(31, '2026_10_06_000003_repair_nusatron_marketplace', 5),
(32, '2026_10_06_000003_ensure_nusatron_marketplace_dummy', 6),
(33, '2026_10_06_000004_extend_marketplace_products_and_add_reviews', 7),
(34, '2026_10_07_000001_create_site_settings_table', 8);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'admin-dashboard', '1c2de5cb731f3b48f8839d2f4e2f940e8ad9daff0ffd56f8a72e0a3f28c45778', '[\"*\"]', '2026-10-05 02:58:30', '2026-10-05 10:54:50', '2026-10-05 02:54:50', '2026-10-05 02:58:30'),
(2, 'App\\Models\\User', 1, 'admin-dashboard', '3c9f2762e51a7293b74cd1c8de9489273ee09d6af514ad424e07f28ee7262e20', '[\"*\"]', '2026-10-05 02:58:33', '2026-10-05 10:56:08', '2026-10-05 02:56:08', '2026-10-05 02:58:33'),
(3, 'App\\Models\\User', 2, 'admin-dashboard', '45372a810180a6fa19303622f19da2382a566eafdcf147a04a47bb97ffee31af', '[\"*\"]', '2026-10-06 01:34:11', '2026-10-06 03:18:59', '2026-10-05 19:19:00', '2026-10-06 01:34:11'),
(4, 'App\\Models\\User', 1, 'admin-dashboard', 'b42f6c32c2486b28762274f5bae02b2b4685b11d5aa564912f78b56d7a3a5afc', '[\"*\"]', '2026-10-06 01:04:08', '2026-10-06 03:19:32', '2026-10-05 19:19:32', '2026-10-06 01:04:08'),
(5, 'App\\Models\\User', 2, 'admin-dashboard', 'faa8a90a83f88da53cfd59c66f75e251c7ab3b3c1a1cd1726498a9e73c0e9d53', '[\"*\"]', NULL, '2026-10-06 05:49:42', '2026-10-05 21:49:43', '2026-10-05 21:49:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `portfolio_brands`
--

DROP TABLE IF EXISTS `portfolio_brands`;
CREATE TABLE `portfolio_brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `image_path` varchar(255) DEFAULT NULL,
  `shape` enum('circle','square') NOT NULL DEFAULT 'circle',
  `zoom` double NOT NULL DEFAULT 1,
  `position_x` double NOT NULL DEFAULT 50,
  `position_y` double NOT NULL DEFAULT 50,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `portfolio_brands`
--

INSERT INTO `portfolio_brands` (`id`, `site_key`, `image_path`, `shape`, `zoom`, `position_x`, `position_y`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'dzikround', NULL, 'circle', 1, 50, 50, 0, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(2, 'dzikround', NULL, 'circle', 1, 50, 50, 1, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(3, 'dzikround', NULL, 'circle', 1, 50, 50, 2, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(4, 'dzikround', NULL, 'circle', 1, 50, 50, 3, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(5, 'dzikround', NULL, 'circle', 1, 50, 50, 4, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(6, 'dzikround', NULL, 'circle', 1, 50, 50, 5, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(7, 'dzikround', NULL, 'circle', 1, 50, 50, 6, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(8, 'dzikround', NULL, 'circle', 1, 50, 50, 7, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(9, 'dzikround', NULL, 'circle', 1, 50, 50, 8, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(10, 'dzikround', NULL, 'circle', 1, 50, 50, 9, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(11, 'dzikround', NULL, 'circle', 1, 50, 50, 10, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(12, 'dzikround', NULL, 'circle', 1, 50, 50, 11, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(25, 'nusatron', 'nusatron/dummy/brand-1.svg', 'circle', 1, 50, 50, 0, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(26, 'nusatron', 'nusatron/dummy/brand-2.svg', 'square', 1, 50, 50, 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(27, 'nusatron', 'nusatron/dummy/brand-3.svg', 'circle', 1, 50, 50, 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `portfolio_items`
--

DROP TABLE IF EXISTS `portfolio_items`;
CREATE TABLE `portfolio_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(180) NOT NULL,
  `city` varchar(120) NOT NULL,
  `type` varchar(40) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `portfolio_items`
--

INSERT INTO `portfolio_items` (`id`, `site_key`, `title`, `city`, `type`, `image_path`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'dzikround', 'Real X Club', 'Surabaya', 'P2.5', NULL, 0, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(2, 'dzikround', 'Sekolah Contoh', 'Malang', 'P2.5', NULL, 1, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(3, 'dzikround', 'Kebun Binatang', 'Surabaya', 'P4', NULL, 2, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(4, 'dzikround', 'Gedung Serbaguna', 'Sidoarjo', 'P3', NULL, 3, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(5, 'dzikround', 'Koarmada II', 'Surabaya', 'P2.5', NULL, 4, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(6, 'dzikround', 'Hotel Bintang', 'Surabaya', 'P1.86', NULL, 5, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(7, 'dzikround', 'Masjid Agung', 'Gresik', 'P4', NULL, 6, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(8, 'dzikround', 'Kampus Contoh', 'Surabaya', 'P2', NULL, 7, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(9, 'dzikround', 'Mall Contoh', 'Malang', 'P3', NULL, 8, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(10, 'dzikround', 'Gereja Contoh', 'Surabaya', 'P2.5', NULL, 9, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(11, 'dzikround', 'Kantor Pemda', 'Mojokerto', 'P4', NULL, 10, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(12, 'dzikround', 'Ballroom Contoh', 'Surabaya', 'P1.53', NULL, 11, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(13, 'dzikround', 'SPBU Contoh', 'Sidoarjo', 'P6', NULL, 12, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(14, 'dzikround', 'Cafe Contoh', 'Surabaya', 'P2.5', NULL, 13, 1, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(29, 'nusatron', 'Project Dummy Nusatron 1', 'Surabaya', 'P2.5', 'nusatron/dummy/project.svg', 0, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(30, 'nusatron', 'Project Dummy Nusatron 2', 'Malang', 'P4', 'nusatron/dummy/project.svg', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(31, 'nusatron', 'Project Dummy Nusatron 3', 'Sidoarjo', 'P3', 'nusatron/dummy/project.svg', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(120) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `layout_variant` enum('card_1','card_2') NOT NULL DEFAULT 'card_1',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `site_key`, `title`, `description`, `image_path`, `layout_variant`, `items`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Videotron Indoor Nusatron', 'Produk dummy untuk kebutuhan indoor.', 'nusatron/dummy/product-1.svg', 'card_1', '[{\"name\":\"P1.8 Indoor\",\"text\":\"Contoh spesifikasi produk.\"},{\"name\":\"P2.5 Indoor\",\"text\":\"Contoh spesifikasi produk.\"}]', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', 'Videotron Outdoor Nusatron', 'Produk dummy untuk kebutuhan outdoor.', 'nusatron/dummy/product-2.svg', 'card_1', '[{\"name\":\"P4 Outdoor\",\"text\":\"Contoh spesifikasi produk.\"},{\"name\":\"P6 Outdoor\",\"text\":\"Contoh spesifikasi produk.\"}]', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', 'Running Text Nusatron', 'Produk dummy untuk informasi digital.', 'nusatron/dummy/product-3.svg', 'card_2', '[{\"name\":\"Running Text Toko\",\"text\":\"Contoh penggunaan.\"},{\"name\":\"Running Text Sekolah\",\"text\":\"Contoh penggunaan.\"}]', 3, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `key` varchar(40) NOT NULL,
  `title` varchar(120) NOT NULL,
  `subtitle` varchar(300) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sections`
--

INSERT INTO `sections` (`id`, `site_key`, `key`, `title`, `subtitle`, `content`, `created_at`, `updated_at`) VALUES
(1, 'dzikround', 'layanan_home', 'Layanan Kami', NULL, NULL, '2026-10-05 02:29:26', '2026-10-05 02:29:26'),
(2, 'dzikround', 'tentang_kami_intro', 'Tentang Kami', NULL, NULL, '2026-10-05 02:53:11', '2026-10-05 02:53:11'),
(3, 'dzikround', 'tentang_kami_testimonials', 'Pendapat Customer Kami', NULL, NULL, '2026-10-05 02:53:11', '2026-10-05 02:53:11'),
(4, 'dzikround', 'tentang_kami_projects', 'Project', 'Hasil project yang telah dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.', NULL, '2026-10-05 02:53:11', '2026-10-05 02:53:11'),
(5, 'dzikround', 'tentang_kami_brands', 'Brand', NULL, NULL, '2026-10-05 02:53:11', '2026-10-05 02:53:11'),
(6, 'dzikround', 'portofolio', 'Portofolio Kami', NULL, NULL, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(7, 'dzikround', 'portfolio_project', '120+ Project', 'Hasil project Surabaya Videotron lebih dari ratusan pelanggan yang telah mempercayakan kebutuhan visualnya kepada kami.', NULL, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(8, 'dzikround', 'portfolio_brand', '80+ Brand', 'Survey kepuasan dari banyaknya brand yang telah bekerja sama dengan Surabaya Videotron.', NULL, '2026-10-05 02:53:12', '2026-10-05 02:53:12'),
(17, 'nusatron', 'cara_kerja', 'Cara Kerja Nusatron', 'Alur layanan sederhana dari konsultasi sampai pemasangan.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(18, 'nusatron', 'layanan', 'Layanan Nusatron', 'Layanan LED dan videotron untuk berbagai kebutuhan.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(19, 'nusatron', 'tentang_kami_intro', 'Tentang Nusatron', NULL, NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(20, 'nusatron', 'tentang_kami_testimonials', 'Pendapat Customer Kami', 'Contoh ulasan pelanggan Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(21, 'nusatron', 'tentang_kami_projects', 'Project', 'Contoh project Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(22, 'nusatron', 'tentang_kami_brands', 'Brand', 'Contoh brand yang bekerja sama dengan Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(23, 'nusatron', 'area_layanan', 'Area Layanan Nusatron', 'Wilayah layanan contoh.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(24, 'nusatron', 'produk', 'Produk Nusatron', 'Contoh produk yang dapat dikelola dari admin.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(25, 'nusatron', 'info_terbaru', 'Info Terbaru', 'Artikel dan informasi contoh Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(26, 'nusatron', 'kenapa_pilih_kami', 'Kenapa Harus Pilih Nusatron?', 'Keunggulan contoh untuk website Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(27, 'nusatron', 'statistik_perusahaan', 'Statistik Perusahaan Nusatron', NULL, NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(28, 'nusatron', 'portofolio', 'Portofolio Nusatron', 'Contoh portofolio.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(29, 'nusatron', 'portfolio_project', 'Project', 'Contoh project Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(30, 'nusatron', 'portfolio_brand', 'Brand', 'Contoh brand Nusatron.', NULL, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(120) NOT NULL,
  `text` varchar(400) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `placement` varchar(20) NOT NULL DEFAULT 'home',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `services`
--

INSERT INTO `services` (`id`, `site_key`, `title`, `text`, `image_path`, `sort_order`, `is_active`, `placement`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Videotron Indoor', 'Contoh layanan videotron indoor untuk ruang dan event.', 'nusatron/dummy/service-1.svg', 1, 1, 'home', '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', 'Videotron Outdoor', 'Contoh layanan videotron outdoor untuk area terbuka.', 'nusatron/dummy/service-2.svg', 2, 1, 'home', '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', 'Running Text', 'Contoh layanan running text untuk informasi dan promosi.', 'nusatron/dummy/service-3.svg', 3, 1, 'home', '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_areas`
--

DROP TABLE IF EXISTS `service_areas`;
CREATE TABLE `service_areas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(120) NOT NULL,
  `text` varchar(400) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `service_areas`
--

INSERT INTO `service_areas` (`id`, `site_key`, `title`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Surabaya', 'Area dummy Nusatron.', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', 'Sidoarjo', 'Area dummy Nusatron.', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', 'Malang', 'Area dummy Nusatron.', 3, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `key` varchar(60) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `site_settings`
--

INSERT INTO `site_settings` (`id`, `site_key`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'whatsapp', '{\"number\":\"6285233124559\",\"product_message\":\"Halo, saya tertarik dengan produk: Nusatron Videotron. Apakah masih tersedia?\",\"default_message\":\"Halo, saya ingin bertanya tentang LED Videotron \\/ Running Text.\"}', '2026-10-06 01:30:14', '2026-10-06 01:34:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `site_key`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin', 'dzikround', 'admin@example.com', NULL, '$2y$12$yrwFX6gDgru4Z3i0gXPKRut/hZ3I9biAS4YzW5eHulIadcOomK3mq', NULL, '2026-10-05 02:53:19', '2026-10-05 02:53:19'),
(2, 'Admin Nusatron', 'nusatron', 'nusatron', 'nusatron@example.com', NULL, '$2y$12$9rKYa99ZnX1yAP9twPKgDO1HxtPvEhki1TZM0At4FALlhcUxampBK', NULL, '2026-10-05 02:53:19', '2026-10-05 02:53:19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `work_steps`
--

DROP TABLE IF EXISTS `work_steps`;
CREATE TABLE `work_steps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_key` varchar(30) NOT NULL DEFAULT 'dzikround',
  `title` varchar(120) NOT NULL,
  `text` varchar(400) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `work_steps`
--

INSERT INTO `work_steps` (`id`, `site_key`, `title`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'nusatron', 'Konsultasi', 'Diskusikan kebutuhan ukuran, lokasi, dan spesifikasi LED yang dibutuhkan.', 1, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(2, 'nusatron', 'Penawaran', 'Nusatron menyiapkan rekomendasi dan estimasi berdasarkan kebutuhan Anda.', 2, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(3, 'nusatron', 'Produksi & Instalasi', 'Tim menyiapkan perangkat lalu melakukan pemasangan sesuai jadwal.', 3, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13'),
(4, 'nusatron', 'Serah Terima', 'Perangkat diuji dan diserahterimakan setelah seluruh fungsi berjalan.', 4, 1, '2026-10-05 02:53:13', '2026-10-05 02:53:13');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `about_contents`
--
ALTER TABLE `about_contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `about_contents_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `about_page_items`
--
ALTER TABLE `about_page_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `about_page_items_section_key_is_active_sort_order_index` (`section_key`,`is_active`,`sort_order`),
  ADD KEY `about_page_items_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `advantages`
--
ALTER TABLE `advantages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advantages_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `advantages_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articles_site_key_placement_slug_unique` (`site_key`,`placement`,`slug`),
  ADD KEY `articles_is_active_published_at_index` (`is_active`,`published_at`),
  ADD KEY `articles_site_key_index` (`site_key`),
  ADD KEY `articles_placement_is_active_published_at_index` (`placement`,`is_active`,`published_at`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `company_stats`
--
ALTER TABLE `company_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_stats_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `company_stats_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `heroes`
--
ALTER TABLE `heroes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `heroes_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `heroes_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `marketplace_products`
--
ALTER TABLE `marketplace_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketplace_products_site_key_is_active_sort_order_index` (`site_key`,`is_active`,`sort_order`),
  ADD KEY `marketplace_products_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `marketplace_reviews`
--
ALTER TABLE `marketplace_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketplace_reviews_marketplace_product_id_created_at_index` (`marketplace_product_id`,`created_at`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indeks untuk tabel `portfolio_brands`
--
ALTER TABLE `portfolio_brands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `portfolio_brands_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `portfolio_brands_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `portfolio_items`
--
ALTER TABLE `portfolio_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `portfolio_items_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `portfolio_items_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `products_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sections_site_key_key_unique` (`site_key`,`key`),
  ADD KEY `sections_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `services_placement_is_active_sort_order_index` (`placement`,`is_active`,`sort_order`),
  ADD KEY `services_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `service_areas`
--
ALTER TABLE `service_areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_areas_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `service_areas_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_site_key_key_unique` (`site_key`,`key`),
  ADD KEY `site_settings_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD KEY `users_site_key_index` (`site_key`);

--
-- Indeks untuk tabel `work_steps`
--
ALTER TABLE `work_steps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_steps_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `work_steps_site_key_index` (`site_key`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `about_contents`
--
ALTER TABLE `about_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `about_page_items`
--
ALTER TABLE `about_page_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT untuk tabel `advantages`
--
ALTER TABLE `advantages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `company_stats`
--
ALTER TABLE `company_stats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `heroes`
--
ALTER TABLE `heroes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `marketplace_products`
--
ALTER TABLE `marketplace_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `marketplace_reviews`
--
ALTER TABLE `marketplace_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `portfolio_brands`
--
ALTER TABLE `portfolio_brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `sections`
--
ALTER TABLE `sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `service_areas`
--
ALTER TABLE `service_areas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `work_steps`
--
ALTER TABLE `work_steps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `marketplace_reviews`
--
ALTER TABLE `marketplace_reviews`
  ADD CONSTRAINT `marketplace_reviews_marketplace_product_id_foreign` FOREIGN KEY (`marketplace_product_id`) REFERENCES `marketplace_products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
