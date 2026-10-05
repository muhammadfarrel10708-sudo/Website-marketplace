<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Membuat (atau memperbarui) akun admin dari file .env.
     * Menjalankan ulang seeder ini = mereset password admin ke nilai di .env.
     */
    public function run(): void
    {
        $password = config('admin.password');

        if (blank($password)) {
            $this->command?->error('ADMIN_PASSWORD di file .env masih kosong. Isi dulu, lalu jalankan lagi.');

            return;
        }

        User::updateOrCreate(
            ['username' => config('admin.username')],
            [
                'name' => config('admin.name'),
                'email' => config('admin.email'),
                'password' => $password, // di-hash otomatis oleh cast 'hashed' di model User
            ],
        );

        $this->command?->info('Akun admin siap: username "'.config('admin.username').'".');
    }
}
