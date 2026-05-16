<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $auth,
    ) {}

    /**
     * @return array<string, mixed>
     */
    private function userPayload(Request $request, User $user): array
    {
        return UserResource::make($user)->toArray($request);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
            'role' => ['sometimes', 'string', 'in:student,lecturer,admin,system-admin'],
        ]);

        $result = $this->auth->register($data);

        return response()->json([
            'user' => $this->userPayload($request, $result['user']),
            'token' => $result['token'],
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 8)) {
            throw ValidationException::withMessages([
                'email' => ['Too many attempts. Please try again shortly.'],
            ]);
        }

        try {
            $result = $this->auth->login($credentials['email'], $credentials['password']);
        } catch (ValidationException $e) {
            RateLimiter::hit($key, 60);

            throw $e;
        }

        RateLimiter::clear($key);

        return response()->json([
            'user' => $this->userPayload($request, $result['user']),
            'token' => $result['token'],
        ]);
    }

    public function logout(Request $request)
    {
        $this->auth->logout($request->user());

        return response()->json(['ok' => true]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('roles');

        return response()->json([
            'user' => $this->userPayload($request, $user),
        ]);
    }
}
