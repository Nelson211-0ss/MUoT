<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('public_id')->unique()->after('id');
            $table->string('locale', 8)->nullable();
            $table->string('status', 24)->default('active')->index();
            $table->softDeletes();
            $table->json('preferences')->nullable();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 80)->unique();
            $table->string('name', 160);
            $table->unsignedSmallInteger('level')->default(0)->index();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name', 200);
            $table->string('category', 80)->nullable()->index();
            $table->timestamps();
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['role_id', 'permission_id']);
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['role_id', 'user_id']);
        });

        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->string('code', 40)->unique();
            $table->string('name', 200);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('faculty_id')->constrained()->cascadeOnDelete();
            $table->string('code', 40);
            $table->string('name', 200);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['faculty_id', 'code']);
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('lecturer_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('moodle_course_id')->nullable()->index();
            $table->string('code', 64)->unique();
            $table->string('title');
            $table->unsignedSmallInteger('credit_hours')->default(3);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status', 32)->default('active')->index();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['course_id', 'user_id']);
        });

        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('moodle_cm_id')->nullable()->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('max_points')->default(100);
            $table->timestampTz('due_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status', 40)->default('pending')->index();
            $table->string('stored_path')->nullable();
            $table->unsignedSmallInteger('grade')->nullable();
            $table->text('feedback')->nullable();
            $table->timestampTz('graded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['assignment_id', 'user_id']);
        });

        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->unsignedSmallInteger('max_points')->default(100);
            $table->timestampTz('scheduled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('score', 8, 2)->nullable();
            $table->string('published_state', 32)->default('draft')->index();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['exam_id', 'user_id']);
        });

        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lecturer_user_id')->constrained('users')->cascadeOnDelete();
            $table->timestampTz('started_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_session_id')->constrained('attendance_sessions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('presence', 32)->default('absent')->index();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['attendance_session_id', 'user_id']);
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('audience_faculty_id')->nullable()->constrained('faculties')->nullOnDelete();
            $table->foreignId('author_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->longText('body');
            $table->timestampTz('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('portal_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->json('channels')->nullable();
            $table->string('subject', 240);
            $table->longText('body');
            $table->timestampTz('read_at')->nullable()->index();
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('requester_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assignee_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('priority', 32)->default('normal')->index();
            $table->string('topic', 200);
            $table->string('lane', 64)->nullable()->index();
            $table->text('detail');
            $table->string('state', 32)->default('open')->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action')->index();
            $table->string('resource')->nullable()->index();
            $table->ipAddress('ip')->nullable();
            $table->json('meta')->nullable();
            $table->timestampsTz();
            $table->index('created_at');
        });

        Schema::create('moodle_sync_batches', function (Blueprint $table) {
            $table->id();
            $table->string('scope', 64)->index();
            $table->string('direction', 32)->index();
            $table->foreignId('initiated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('records')->default(0);
            $table->string('state', 32)->default('pending')->index();
            $table->text('failure_reason')->nullable();
            $table->timestampsTz();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        foreach ([
            'moodle_sync_batches',
            'audit_logs',
            'support_tickets',
            'portal_notifications',
            'announcements',
            'attendance_records',
            'attendance_sessions',
            'exam_results',
            'exams',
            'assignment_submissions',
            'assignments',
            'enrollments',
            'courses',
            'departments',
            'faculties',
            'role_user',
            'permission_role',
            'permissions',
            'roles',
        ] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['preferences', 'status', 'locale', 'public_id']);
        });
        Schema::enableForeignKeyConstraints();
    }
};
