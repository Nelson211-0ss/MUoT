# Portal stack (Next.js + Laravel 11 monorepo)

This repository still ships the canonical marketing + admissions workspace at the repo root.
The scalable campus portal scaffolding lives under dedicated folders:

- `frontend/` — Next.js (App Router, TypeScript, Tailwind). Points to the Laravel API via `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://127.0.0.1:8000/api/v1`).
- `backend/` — Laravel 11 REST façade with modular services, PostgreSQL-compatible migrations, Sanctum API tokens, and Moodle Web Service helpers (`app/Services/Integrations/Moodle`).
- `docker/` — `docker-compose.yml` plus nginx reverse proxy configs for Postgres, Redis, Laravel, and the Next.js dev container.

## Local stack (bare metal)

### Laravel

```bash
cd backend
cp .env.example .env && php artisan key:generate
# configure Postgres (preferred) then:
php artisan migrate --force
php artisan db:seed
php artisan serve
```

Seeded demonstrators (`DatabaseSeeder`):

- Admin: `admin@mut.edu` / `Admin#123456`
- Student: `student@mut.edu` / `Student#123456`
- Lecturer: `lecturer@mut.edu` / `Lecturer#123456`

### Next.js scaffold

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Docker Compose (developer edition)

Run from `/docker`:

```bash
docker compose up --build
```

- Frontend direct bind: `http://localhost:3000`
- Nginx aggregator: `http://localhost:8080` proxies `/api/*` → Laravel `/api/*` and `/` → Next.js hot reload stack
- Postgres: `postgres:5432` with database `portal` / user `portal` / password `portal`

Populate Moodle credentials via environment (`MOODLE_BASE_URL`, `MOODLE_WS_TOKEN`) before enabling sync workflows.
