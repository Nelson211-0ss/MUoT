# Magwi University of Technology — Website

Next.js app for **Magwi University of Technology** (frontend + API routes, Prisma + SQLite for local development).

## Prerequisites

- **Node.js** (LTS recommended)
- **npm**

## 1. Go to the project folder

```bash
cd magwi-university
```

(Or use the full path, e.g. `cd /path/to/magwi-university`.)

## 2. Environment variables

Create a `.env` file in this folder (you can copy `.env.example`):

- `DATABASE_URL="file:./dev.db"`
- `JWT_SECRET` — use a **strong secret at least 16 characters** (required for auth)

## 3. Install dependencies

```bash
npm install
```

If installs fail or behave oddly, try a clean install:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 4. Database (Prisma)

Generate the client and apply the schema to the local SQLite database:

```bash
npx prisma generate
npx prisma db push
```

**Optional — load demo data** (demo user, courses, assignments):

```bash
node prisma/seed.js
```

## 5. Run the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Demo logins (after seed)

Demo users are created by `node prisma/seed.js` (or `npm run db:seed`). **These are for local development only.**

| Role | Email | Password |
|------|--------|----------|
| Student | `demo@mut.edu` | `demo123` |
| Lecturer | `lecturer@mut.edu` | `lecturer123` |
| Admin | `admin@mut.edu` | `admin123` |

- **Student portal:** [http://localhost:3000/student-portal](http://localhost:3000/student-portal)
- **Lecturer portal:** [http://localhost:3000/lecturer-portal](http://localhost:3000/lecturer-portal)
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)

## Production build

```bash
npm run build
npm start
```

## Useful npm scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm start` | Start production server |
| `npm run db:push` | `prisma db push` |
| `npm run db:seed` | Run `prisma/seed.js` |

## Stack

- **Next.js** (App Router), **React**, **Tailwind CSS**
- **Prisma** + **SQLite** (local); point `DATABASE_URL` to PostgreSQL for production
- **Auth:** JWT in http-only cookie, **bcrypt** passwords

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Deploy

Deploy to [Vercel](https://vercel.com) or any Node host. Set `DATABASE_URL` and `JWT_SECRET` in the host environment. For serverless, prefer a hosted PostgreSQL database over SQLite.
