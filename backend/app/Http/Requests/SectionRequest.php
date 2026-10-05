<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah dilindungi middleware auth:sanctum di routes/api.php
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'subtitle' => ['nullable', 'string', 'max:300'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi.',
            'title.max' => 'Judul maksimal 120 karakter.',
            'subtitle.max' => 'Subjudul maksimal 300 karakter.',
        ];
    }
}
