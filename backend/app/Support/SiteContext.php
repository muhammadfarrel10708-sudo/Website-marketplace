<?php

namespace App\Support;

class SiteContext
{
    public const DZIKROUND = 'dzikround';
    public const NUSATRON = 'nusatron';

    private static ?string $key = null;

    public static function set(string $key): void
    {
        self::$key = in_array($key, [self::DZIKROUND, self::NUSATRON], true) ? $key : self::DZIKROUND;
    }

    public static function key(): string
    {
        // Untuk request admin, tenant HARUS mengikuti akun yang sudah
        // terautentikasi. Jangan percaya X-Site-Key dari browser untuk admin.
        if (function_exists('request')) {
            $user = request()->user();
            if ($user) {
                $userSite = $user->site_key ?? ($user->username === 'nusatron' ? self::NUSATRON : self::DZIKROUND);
                if (in_array($userSite, [self::DZIKROUND, self::NUSATRON], true)) {
                    return $userSite;
                }
            }
        }

        if (self::$key !== null) return self::$key;

        if (function_exists('request') && request()->hasHeader('X-Site-Key')) {
            self::set((string) request()->header('X-Site-Key'));
        }

        return self::$key ?? self::DZIKROUND;
    }

    public static function uploadPath(string $folder): string
    {
        return self::key().'/'.trim($folder, '/');
    }
}
