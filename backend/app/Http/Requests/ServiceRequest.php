<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi tambah & ubah layanan.
 * Gambar SELALU opsional (beda dengan Hero) — kalau kosong, frontend memakai gambar dummy.
 */
class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah dilindungi middleware auth:sanctum di routes/api.php
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'text' => ['required', 'string', 'max:400'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
            'placement' => ['nullable', 'in:home,page'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul layanan wajib diisi.',
            'title.max' => 'Judul maksimal 120 karakter.',
            'text.required' => 'Keterangan wajib diisi.',
            'text.max' => 'Keterangan maksimal 400 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
            'sort_order.integer' => 'Urutan harus berupa angka bulat.',
            'sort_order.min' => 'Urutan tidak boleh negatif.',
            'sort_order.max' => 'Urutan maksimal 65535.',
        ];
    }
}
