<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:100'],
            'password' => ['required', 'string', 'max:255'],
        ], [
            'username.required' => 'Isi username.',
            'password.required' => 'Isi password.',
        ]);

        $user = User::where('username', $credentials['username'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Username atau password salah.'], 401);
        }

        $expiresAt = now()->addHours(max(1, (int) config('admin.token_hours', 8)));
        $token = $user->createToken('admin-dashboard', ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
            'user' => $this->userPayload($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function logout(Request $request): Response
    {
        // Hapus token yang sedang dipakai saja (perangkat lain tetap login)
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    private function userPayload(User $user): array
    {
        return [
            'name' => $user->name,
            'username' => $user->username,
            // Semua akun di tabel users dipakai sebagai admin dashboard
            'role' => 'admin',
            'site_key' => in_array($user->site_key, ['dzikround', 'nusatron'], true) ? $user->site_key : ($user->username === 'nusatron' ? 'nusatron' : 'dzikround'),
            'brand' => ($user->site_key ?? ($user->username === 'nusatron' ? 'nusatron' : 'dzikround')) === 'nusatron' ? 'Nusatron' : 'Dzikround',
        ];
    }
}
