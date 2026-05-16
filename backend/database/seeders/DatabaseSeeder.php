<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        $student = User::factory()->create([
            'name' => 'Portal Student',
            'email' => 'student@mut.edu',
            'password' => Hash::make('Student#123456'),
            'email_verified_at' => now(),
        ]);
        $student->syncRoles(['student']);

        $lecturer = User::factory()->create([
            'name' => 'Portal Lecturer',
            'email' => 'lecturer@mut.edu',
            'password' => Hash::make('Lecturer#123456'),
            'email_verified_at' => now(),
        ]);
        $lecturer->syncRoles(['lecturer']);

        $admin = User::factory()->create([
            'name' => 'Portal Admin',
            'email' => 'admin@mut.edu',
            'password' => Hash::make('Admin#123456'),
            'email_verified_at' => now(),
        ]);
        $admin->syncRoles(['admin', 'system-admin']);
    }
}
