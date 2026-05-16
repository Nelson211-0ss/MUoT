"use client";

import { apiBase } from "@/lib/env";
import { useAuthStore } from "@/stores/authStore";
import { useMemo, useState } from "react";

export function LoginPortal() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState("admin@mut.edu");
  const [password, setPassword] = useState("Admin#123456");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [probe, setProbe] = useState<unknown>(null);

  const roleLabel = useMemo(() => (user?.roles?.length ? user.roles.join(", ") : "guest"), [user]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError(null);

    try {
      setBusy(true);

      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminPing() {
    try {
      setProbe(null);

      const headers = new Headers();
      headers.set("Accept", "application/json");

      if (token !== null && token.trim().length > 0) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const res = await fetch(`${apiBase()}/admin/ping`, { headers });

      const text = await res.text();

      try {
        setProbe(JSON.parse(text) as unknown);
      } catch {
        setProbe({ status: res.status, body: text });
      }

      setError(res.ok ? null : `HTTP ${res.status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:gap-14">
      <section className="space-y-4">
        <p className="text-sm font-semibold tracking-wide text-sky-600 dark:text-sky-400">Enterprise Smart Portal Stack</p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Modular Next.js facade with a Laravel&nbsp;11 API backbone.
        </h1>

        <p className="text-pretty leading-7 text-zinc-700 dark:text-zinc-400">
          This workspace keeps the heritage campus site at the repository root while the new monorepo lives under{" "}
          <code className="rounded-md bg-white/80 px-1.5 py-0.5 text-sm text-zinc-900 shadow-xs ring ring-zinc-200/70 dark:bg-zinc-950/60 dark:text-zinc-50 dark:ring-white/15">
            frontend/
          </code>{" "}
          and{" "}
          <code className="rounded-md bg-white/80 px-1.5 py-0.5 text-sm text-zinc-900 shadow-xs ring ring-zinc-200/70 dark:bg-zinc-950/60 dark:text-zinc-50 dark:ring-white/15">
            backend/
          </code>
          . Authentication below exercises Sanctum tokens against{" "}
          <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{`${apiBase()}`}</span>
          .
        </p>

        <div className="rounded-2xl bg-white p-6 text-sm shadow-sm ring ring-zinc-200/70 dark:bg-zinc-950/40 dark:text-zinc-200 dark:ring-white/15">
          <p className="font-semibold text-zinc-900 dark:text-white">Smoke-test accounts after seeding</p>
          <dl className="mt-4 space-y-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Admin</dt>
              <dd className="font-mono text-xs sm:text-sm">admin@mut.edu / Admin#123456</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Student</dt>
              <dd className="font-mono text-xs sm:text-sm">student@mut.edu / Student#123456</dd>
            </div>
          </dl>
        </div>
      </section>

      <aside className="rounded-3xl bg-white p-8 shadow-xl ring ring-zinc-200/70 dark:bg-zinc-950/75 dark:text-zinc-50 dark:ring-white/15">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Session</p>

            <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              {user ? user.name : "Sign in"}
            </h2>

            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {user ? (
                <>
                  <span>{user.email}</span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-500">{roleLabel}</span>
                </>
              ) : (
                "Use seeded credentials below or connect your own Laravel instance."
              )}
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-sky-500/40 placeholder:text-zinc-400 focus:ring dark:border-white/15 dark:bg-zinc-950/60 dark:text-zinc-50"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Password
            <input
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-sky-500/40 placeholder:text-zinc-400 focus:ring dark:border-white/15 dark:bg-zinc-950/60 dark:text-zinc-50"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error !== null ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              className="inline-flex flex-1 items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-base font-semibold text-white shadow-sm ring ring-white/5 transition hover:-translate-y-[1px] hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
              type="submit"
              disabled={busy}
            >
              {busy ? "Working…" : "Continue"}
            </button>

            {user !== null ? (
              <button
                className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-300 px-6 py-2 text-base font-semibold text-zinc-900 transition hover:border-zinc-500 dark:border-white/20 dark:text-zinc-100 dark:hover:border-white"
                type="button"
                disabled={busy}
                onClick={async () => {
                  await logout();

                  setProbe(null);

                  setError(null);
                }}
              >
                Log out
              </button>
            ) : null}
          </div>
        </form>

        {user !== null ? (
          <div className="mt-10 space-y-3 border-t border-dashed border-zinc-300 pt-8 text-sm dark:border-white/15">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">ADMIN smoke route</span>
              <button
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 ring ring-black/5 dark:bg-white/10 dark:text-white"
                type="button"
                onClick={() => void handleAdminPing()}
              >
                Ping /admin/ping
              </button>
            </div>

            {probe !== null ? <pre className="max-h-40 overflow-auto rounded-xl bg-black/85 p-4 text-[11px] text-emerald-200">{JSON.stringify(probe, null, 2)}</pre> : null}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
