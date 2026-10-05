<?php

namespace App\Http\Requests;

use App\Rules\SafeLink;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi tambah & ubah slide hero.
 * Tambah = POST (gambar wajib). Ubah = PUT (gambar boleh dikosongkan = pakai gambar lama).
 */
class HeroRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Sudah dilindungi middleware auth:sanctum di routes/api.php
        return true;
    }

    public function rules(): array
    {
        $isCreate = $this->isMethod('POST');

        return [
            'title' => ['required', 'string', 'max:120'],
            'subtitle' => ['nullable', 'string', 'max:400'],
            'cta_label' => ['nullable', 'string', 'max:40', 'required_with:cta_url'],
            'cta_url' => ['nullable', 'string', 'max:255', 'required_with:cta_label', new SafeLink],
            'image' => [
                $isCreate ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120', // 5 MB
            ],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi.',
            'title.max' => 'Judul maksimal 120 karakter.',
            'subtitle.max' => 'Subjudul maksimal 400 karakter.',
            'cta_label.max' => 'Teks tombol maksimal 40 karakter.',
            'cta_label.required_with' => 'Teks tombol wajib diisi jika link tombol diisi.',
            'cta_url.max' => 'Link tombol maksimal 255 karakter.',
            'cta_url.required_with' => 'Link tombol wajib diisi jika teks tombol diisi.',
            'image.required' => 'Gambar wajib diunggah.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
            'image.uploaded' => 'Gambar gagal diunggah. Ukuran file kemungkinan melebihi batas server (upload_max_filesize di php.ini).',
            'sort_order.integer' => 'Urutan harus berupa angka bulat.',
            'sort_order.min' => 'Urutan tidak boleh negatif.',
            'sort_order.max' => 'Urutan maksimal 65535.',
        ];
    }
}
