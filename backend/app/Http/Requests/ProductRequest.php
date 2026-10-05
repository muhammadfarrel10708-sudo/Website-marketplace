<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'layout_variant' => ['required', 'in:card_1,card_2'],
            'items' => ['nullable', 'array'],
            'items.*.name' => ['nullable', 'string', 'max:120'],
            'items.*.text' => ['nullable', 'string', 'max:400'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Nama produk wajib diisi.',
            'title.max' => 'Nama produk maksimal 120 karakter.',
            'description.max' => 'Deskripsi maksimal 500 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar maksimal 5 MB.',
            'layout_variant.required' => 'Pilih versi card.',
            'layout_variant.in' => 'Versi card tidak valid.',
            'sort_order.integer' => 'Urutan harus berupa angka bulat.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $raw = $this->input('items');

        if ($raw === null || $raw === '') {
            $this->merge(['items' => []]);
            return;
        }

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $clean = [];
                foreach ($decoded as $item) {
                    if (!is_array($item)) continue;
                    $name = trim((string) ($item['name'] ?? ''));
                    $text = trim((string) ($item['text'] ?? ''));
                    if ($name !== '' || $text !== '') {
                        $clean[] = ['name' => $name, 'text' => $text];
                    }
                }
                $this->merge(['items' => $clean]);
            } else {
                $this->merge(['items' => []]);
            }
        }
    }
}
