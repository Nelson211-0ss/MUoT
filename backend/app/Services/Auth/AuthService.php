<?php

namespace App\Services\Auth;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    /**
     * @param  array{name:string,email:string,password:string,role?:string}  $input
     * @return array{user: User, token: string}
     */
    public function register(array $input): array
    {
        if ($this->users->findByEmail($input['email'])) {
            throw ValidationException::withMessages([
                'email' => ['The email is already registered.'],
            ]);
        }

        $user = $this->users->create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        $roleSlug = $input['role'] ?? 'student';
        $role = Role::query()->where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
        }

        $user->load('roles');
        $token = $user->createToken('portal')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * @return array{user: User, token: string}
     */
    public function login(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);
        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $user->load('roles');
        $token = $user->createToken('portal')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
