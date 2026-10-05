<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AboutContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'paragraph_one' => ['required', 'string', 'max:1200'],
            'paragraph_two' => ['nullable', 'string', 'max:1200'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul Tentang Kami wajib diisi.',
            'title.max' => 'Judul maksimal 180 karakter.',
            'paragraph_one.required' => 'Paragraf pertama wajib diisi.',
            'paragraph_one.max' => 'Paragraf pertama maksimal 1200 karakter.',
            'paragraph_two.max' => 'Paragraf kedua maksimal 1200 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
            'sort_order.integer' => 'Urutan harus berupa angka bulat.',
            'sort_order.min' => 'Urutan tidak boleh negatif.',
            'sort_order.max' => 'Urutan maksimal 65535.',
        ];
    }
}
