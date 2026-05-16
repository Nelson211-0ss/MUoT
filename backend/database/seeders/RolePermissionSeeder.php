<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /** @var list<array{name:string,key:string,category:string}> */
    private const PERMISSION_PRESET = [
        ['category' => 'users', 'key' => 'users.read', 'name' => 'View users'],
        ['category' => 'users', 'key' => 'users.write', 'name' => 'Manage users'],
        ['category' => 'courses', 'key' => 'courses.read', 'name' => 'View courses'],
        ['category' => 'courses', 'key' => 'courses.write', 'name' => 'Manage courses'],
        ['category' => 'grades', 'key' => 'grades.read', 'name' => 'View grades'],
        ['category' => 'grades', 'key' => 'grades.write', 'name' => 'Manage grades'],
        ['category' => 'attendance', 'key' => 'attendance.write', 'name' => 'Manage attendance'],
        ['category' => 'announcements', 'key' => 'announcements.manage', 'name' => 'Manage announcements'],
        ['category' => 'audit', 'key' => 'audit.read', 'name' => 'View audit trails'],
        ['category' => 'moodle', 'key' => 'moodle.sync', 'name' => 'Run Moodle synchronization'],
        ['category' => 'reports', 'key' => 'reports.read', 'name' => 'View institutional reports'],
        ['category' => 'reports', 'key' => 'reports.export', 'name' => 'Export reports'],
    ];

    /** @var array<string, array{level:int,name:string,description:?string}> */
    private const ROLES = [
        'student' => [
            'name' => 'Student',
            'level' => 10,
            'description' => 'Course access and self-service portals.',
        ],
        'lecturer' => [
            'name' => 'Lecturer',
            'level' => 30,
            'description' => 'Teaching and grading responsibilities.',
        ],
        'admin' => [
            'name' => 'Administrator',
            'level' => 60,
            'description' => 'Institutional administrators.',
        ],
        'system-admin' => [
            'name' => 'System Administrator',
            'level' => 90,
            'description' => 'Infrastructure, Moodle connectors, audits.',
        ],
    ];

    public function run(): void
    {
        $permissionIds = [];

        foreach (self::PERMISSION_PRESET as $row) {
            $permission = Permission::updateOrCreate(
                ['key' => $row['key']],
                [
                    'name' => $row['name'],
                    'category' => $row['category'],
                ]
            );
            $permissionIds[$row['key']] = $permission->id;
        }

        $allKeys = array_keys($permissionIds);

        $bindings = [
            'student' => ['courses.read', 'grades.read'],
            'lecturer' => [
                'courses.read',
                'grades.read',
                'courses.write',
                'grades.write',
                'attendance.write',
                'announcements.manage',
            ],
            'admin' => $allKeys,
            'system-admin' => $allKeys,
        ];

        foreach (self::ROLES as $slug => $meta) {
            $role = Role::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $meta['name'],
                    'level' => $meta['level'],
                    'description' => $meta['description'] ?? null,
                ]
            );

            $linkedIds = [];
            foreach ($bindings[$slug] ?? [] as $key) {
                if (!isset($permissionIds[$key])) {
                    continue;
                }
                $linkedIds[] = $permissionIds[$key];
            }

            $role->permissions()->sync($linkedIds);
        }
    }
}
