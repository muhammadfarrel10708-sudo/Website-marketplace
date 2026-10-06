<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/** Simpan pengaturan website (admin). Tiap website punya pengaturannya sendiri. */
class SiteSettingController extends Controller
{
    public function update(Request $request, string $key): JsonResponse
    {
        abort_unless(in_array($key, SiteSetting::KEYS, true), 404);

        $value = match ($key) {
            'whatsapp' => $this->whatsapp($request),
            'contact_page' => $this->contactPage($request),
        };

        $setting = SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);

        return response()->json(['data' => $setting->value]);
    }

    private function whatsapp(Request $request): array
    {
        $data = Validator::make($request->all(), [
            'number' => ['nullable', 'string', 'max:30'],
            'product_message' => ['nullable', 'string', 'max:300'],
            'default_message' => ['nullable', 'string', 'max:300'],
        ], [
            'number.max' => 'Nomor WhatsApp terlalu panjang.',
            'product_message.max' => 'Pesan produk maksimal 300 karakter.',
            'default_message.max' => 'Pesan umum maksimal 300 karakter.',
        ])->validate();

        $number = $this->normalizeNumber($data['number'] ?? '');
        if ($number !== '' && ! preg_match('/^[1-9][0-9]{7,14}$/', $number)) {
            abort(response()->json([
                'message' => 'Nomor WhatsApp tidak valid. Contoh: 081234567890 atau 6281234567890.',
                'errors' => ['number' => ['Nomor WhatsApp tidak valid. Contoh: 081234567890 atau 6281234567890.']],
            ], 422));
        }

        return [
            'number' => $number,
            'product_message' => $data['product_message'] ?? null,
            'default_message' => $data['default_message'] ?? null,
        ];
    }

    /** 08xxx / +62 8xxx / 62 8xxx / 8xxx  ->  628xxx (hanya angka). */
    private function normalizeNumber(string $raw): string
    {
        $digits = preg_replace('/\D/', '', $raw) ?? '';
        if ($digits === '') return '';
        if (str_starts_with($digits, '00')) $digits = substr($digits, 2);
        if (str_starts_with($digits, '0')) return '62'.substr($digits, 1);
        if (str_starts_with($digits, '8')) return '62'.$digits;
        return $digits;
    }

    private function contactPage(Request $request): array
    {
        $types = ['phone', 'whatsapp', 'email', 'instagram', 'facebook', 'tiktok', 'youtube', 'website', 'other'];
        $envs = ['any', 'indoor', 'outdoor'];
        $text = fn (int $max, bool $required = false) => [$required ? 'required' : 'nullable', 'string', 'max:'.$max];

        $rules = [
            'heading' => $text(120, true),
            'subheading' => $text(500),

            'items' => ['present', 'array', 'max:30'],
            'items.*.id' => $text(60),
            'items.*.type' => ['required', Rule::in($types)],
            'items.*.value' => $text(200, true),

            'addresses_title' => $text(60),
            'addresses' => ['present', 'array', 'max:10'],
            'addresses.*.id' => $text(60),
            'addresses.*.value' => $text(500, true),

            'calculator.title' => $text(120, true),
            'calculator.description' => $text(500),
            'calculator.button_label' => $text(60, true),
        ];

        foreach (['jenis', 'audiens', 'lokasi'] as $f) {
            $rules["calculator.fields.$f.label"] = $text(120, true);
            $rules["calculator.fields.$f.placeholder"] = $text(120);
            $rules["calculator.fields.$f.options"] = ['required', 'array', 'min:1', 'max:30'];
            $rules["calculator.fields.$f.options.*.id"] = $text(60);
            $rules["calculator.fields.$f.options.*.label"] = $text(120, true);
        }
        $rules['calculator.fields.jenis.options.*.environment'] = ['nullable', Rule::in($envs)];
        $rules['calculator.fields.jenis.options.*.pitches'] = ['required', 'array', 'min:1', 'max:20'];
        $rules['calculator.fields.jenis.options.*.pitches.*'] = ['required', 'numeric', 'gt:0', 'max:100'];
        $rules['calculator.fields.audiens.options.*.min_width'] = ['nullable', 'numeric', 'min:0', 'max:1000'];
        $rules['calculator.fields.lokasi.options.*.environment'] = ['nullable', Rule::in($envs)];

        foreach (['lebar', 'tinggi', 'jarak', 'wa', 'email'] as $f) {
            $rules["calculator.inputs.$f.label"] = $text(120, true);
            $rules["calculator.inputs.$f.placeholder"] = $text(120);
        }

        $messages = [
            'heading.required' => 'Header wajib diisi.',
            'items.*.value.required' => 'Isi kontak tidak boleh kosong. Hapus barisnya jika tidak dipakai.',
            'addresses.*.value.required' => 'Alamat tidak boleh kosong. Hapus barisnya jika tidak dipakai.',
            'calculator.*.required' => 'Ada isian kalkulator yang wajib diisi masih kosong.',
            'calculator.fields.*.options.*.label.required' => 'Nama pilihan dropdown tidak boleh kosong.',
            'calculator.fields.*.options.required' => 'Dropdown minimal punya 1 pilihan.',
            'calculator.fields.*.options.min' => 'Dropdown minimal punya 1 pilihan.',
            'calculator.fields.jenis.options.*.pitches.required' => 'Pilihan "Jenis Kebutuhan" wajib punya minimal 1 nilai pixel pitch.',
            'calculator.fields.jenis.options.*.pitches.min' => 'Pilihan "Jenis Kebutuhan" wajib punya minimal 1 nilai pixel pitch.',
            'calculator.fields.jenis.options.*.pitches.*.numeric' => 'Pixel pitch harus berupa angka (contoh: 2.5).',
            'calculator.fields.jenis.options.*.pitches.*.gt' => 'Pixel pitch harus lebih dari 0.',
        ];

        $data = Validator::make($request->all(), $rules, $messages)->validate();

        // Pastikan urutan pitch naik (dipakai logika rekomendasi) dan id selalu ada.
        foreach ($data['calculator']['fields']['jenis']['options'] as &$opt) {
            $opt['pitches'] = array_values(array_map('floatval', $opt['pitches']));
            sort($opt['pitches']);
            $opt['environment'] = $opt['environment'] ?? 'any';
        }
        unset($opt);

        return $data;
    }
}
