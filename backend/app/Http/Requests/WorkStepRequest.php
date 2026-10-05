<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkStepRequest extends FormRequest
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
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul langkah wajib diisi.',
            'title.max' => 'Judul maksimal 120 karakter.',
            'text.required' => 'Keterangan wajib diisi.',
            'text.max' => 'Keterangan maksimal 400 karakter.',
            'sort_order.integer' => 'Urutan harus berupa angka bulat.',
            'sort_order.min' => 'Urutan tidak boleh negatif.',
            'sort_order.max' => 'Urutan maksimal 65535.',
        ];
    }
}
