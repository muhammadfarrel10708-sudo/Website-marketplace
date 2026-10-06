<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'site_key' => 'dzikround',
                'name' => config('admin.name'),
                'username' => config('admin.username'),
                'email' => config('admin.email'),
                'password' => config('admin.password') ?: 'admin12345',
            ],
            [
                'site_key' => 'nusatron',
                'name' => config('admin.nusatron.name'),
                'username' => config('admin.nusatron.username'),
                'email' => config('admin.nusatron.email'),
                'password' => config('admin.nusatron.password') ?: 'admin12345',
            ],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['username' => $account['username']],
                [
                    'site_key' => $account['site_key'],
                    'name' => $account['name'],
                    'email' => $account['email'],
                    'password' => $account['password'],
                ],
            );

            $this->command?->info('Akun admin siap: username "'.$account['username'].'" ('.$account['site_key'].').');
        }
    }
}
