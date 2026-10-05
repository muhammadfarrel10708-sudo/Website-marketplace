<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AboutPageItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'section_key' => ['required', 'string', 'in:intro,testimonials,projects,brands'],
            'title' => ['nullable', 'string', 'max:180'],
            'subtitle' => ['nullable', 'string', 'max:180'],
            'content_one' => ['nullable', 'string', 'max:2000'],
            'content_two' => ['nullable', 'string', 'max:2000'],
            'meta_one' => ['nullable', 'string', 'max:120'],
            'meta_two' => ['nullable', 'string', 'max:180'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
