# MUoT — Magwi University of Technology

This repo contains:

1. **Root Next.js application** — public site, portals, admissions, and App Router APIs backed by **Prisma** (SQLite locally).
   Teaching, quizzes, assignments, forums, grades, and course resources are intentionally **outside** this codebase — teams use **Moodle** (`NEXT_PUBLIC_MOODLE_URL`).
2. **Optional monorepo** — **`frontend/`** (TypeScript façade) + **`backend/`** (Laravel 11 API) + **`docker/`** compose. Details: [`docs/PORTAL_STACK.md`](docs/PORTAL_STACK.md).

## Prerequisites

Node.js LTS (for the root app and `frontend/`), npm. For the Laravel stack: PHP 8.2+, Composer, PostgreSQL when not using SQLite.

---

## Root app (main site)

### Setup

Clone or open this repository and use **this folder as the project root** (rename as you like):

```bash
cd MUoT   # or: cd path/to/your-checkout
```

Environment (copy **[`.env.example`](.env.example)** → `.`):

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Example: `"file:./dev.db"` (SQLite) |
| `JWT_SECRET` | Strong secret, ≥ 16 chars (JWT session cookie auth) |
| `NEXT_PUBLIC_MOODLE_URL` | Base URL of your Moodle site (linked from nav + portals) |

```bash
npm install
npx prisma generate
npx prisma db push
```

**Schema note:** Prisma no longer stores courses, assignments, or materials — `db push` will drop those legacy tables from your local SQLite file. All teaching data lives in Moodle.

Optional demo data:

```bash
npm run db:seed
# or: node prisma/seed.js
```

```bash
npm run dev
```

Open **http://localhost:3000**

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` then Next build) |
| `npm start` | Production server |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:seed` | Run `prisma/seed.js` |

### Demo logins (after `db:seed`)

For **local development only**. Roles and permissions come from **`prisma/seed.js`** via **`prisma/rbac-matrix.cjs`**.

| Role | Email | Password |
| --- | --- | --- |
| Student | `demo@mut.edu` | `demo123` |
| HOD | `hod@mut.edu` | `hod123` |
| Lecturer | `lecturer@mut.edu` | `lecturer123` |
| Admin | `admin@mut.edu` | `admin123` |
| Super admin | `super@mut.edu` | `super123` |
| Finance | `finance@mut.edu` | `finance123` |
| Admissions | `admissions@mut.edu` | `admissions123` |
| Department admin | `dept@mut.edu` | `dept123` |
| Registrar | `registrar@mut.edu` | `registrar123` |
| Applicant | `applicant@mut.edu` | `apply123` |

Routes (role-gated):

- Student: **`/student-portal`**
- Lecturer: **`/lecturer-portal`**
- Management: **`/admin`**

---

## Parallel portal stack (`frontend/` + `backend/` + Docker)

| Path | Role |
| --- | --- |
| `frontend/` | Next.js (App Router, TypeScript, Tailwind, Zustand shell) hitting Laravel |
| `backend/` | Laravel 11 REST **`/api/v1/*`**, Sanctum, Postgres-oriented migrations |
| `docker/` | Postgres, Redis, nginx, Laravel and Next dev services |

Bootstrap and seeded API users are documented in **`docs/PORTAL_STACK.md`**.

---

## Stack summary

**Root:** Next.js (App Router), React, Tailwind, Prisma, SQLite (local) / Postgres (production), bcrypt + JWT cookie auth.

**Portal monorepo:** Laravel 11, Sanctum, PostgreSQL targets, Moodle integration helpers under `backend/app/Services/Integrations/Moodle/`.

## Deploy (root app)

Compatible with **[Vercel](https://vercel.com)** or any Node host. Set **`DATABASE_URL`** (prefer hosted Postgres) and **`JWT_SECRET`**. SQLite is suitable for local demos only.

## References

- [Next.js](https://nextjs.org/docs), [Prisma](https://www.prisma.io/docs), [Laravel](https://laravel.com/docs)
