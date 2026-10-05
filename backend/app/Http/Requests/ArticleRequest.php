<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ArticleRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200'],
            'placement' => ['required', 'in:home,menu'],
            'published_at' => ['nullable', 'date'],
            'excerpt' => ['nullable', 'string', 'max:600'],
            'body' => ['nullable', 'string', 'max:20000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'image_zoom' => ['nullable', 'numeric'],
            'image_position_x' => ['nullable', 'numeric'],
            'image_position_y' => ['nullable', 'numeric'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul artikel wajib diisi.',
            'title.max' => 'Judul artikel maksimal 180 karakter.',
            'excerpt.max' => 'Ringkasan maksimal 600 karakter.',
            'body.max' => 'Isi artikel terlalu panjang.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
            'published_at.date' => 'Tanggal publikasi tidak valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $title = trim((string) $this->input('title', ''));
        $slug = trim((string) $this->input('slug', ''));
        $this->merge([
            'title' => $title,
            'slug' => $slug !== '' ? Str::slug($slug) : Str::slug($title),
            'published_at' => $this->input('published_at') ?: now()->format('Y-m-d'),
        ]);
    }
}
