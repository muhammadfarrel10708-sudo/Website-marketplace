<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Link tombol yang diizinkan: alamat internal ("/pesan-sekarang") atau http(s)://...
 * Menolak skema berbahaya seperti "javascript:".
 */
class SafeLink implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('Link tombol tidak valid.');

            return;
        }

        $value = trim($value);

        $internal = str_starts_with($value, '/') && ! str_starts_with($value, '//');
        $external = preg_match('#^https?://#i', $value) === 1 && filter_var($value, FILTER_VALIDATE_URL) !== false;

        if (! $internal && ! $external) {
            $fail('Link tombol harus diawali "/" (halaman di website ini) atau "https://" (alamat luar).');
        }
    }
}
