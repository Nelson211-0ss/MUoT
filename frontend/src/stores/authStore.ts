"use client";

import { apiBase } from "@/lib/env";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PortalRole = string;

export type PortalUser = {
  id: number;
  public_id: string | null;
  name: string;
  email: string;
  status: string | null;
  roles: PortalRole[];
};

type Tokens = {
  token: string | null;
  user: PortalUser | null;
};

type Actions = {
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refreshMe(): Promise<void>;
};

type PortalAuthStore = Tokens & Actions;

async function requestJson(path: string, token: string | null, init?: RequestInit): Promise<unknown> {
  const normalized = `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token !== null && token !== "") {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  const res = await fetch(normalized, {
    credentials: "omit",
    ...init,
    headers,
  });

  const text = await res.text();

  let parsed: unknown = null;
  if (text.trim().length > 0) {
    parsed = JSON.parse(text) as unknown;
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;

    if (parsed && typeof parsed === "object" && "message" in parsed && typeof (parsed as { message: unknown }).message === "string") {
      message = (parsed as { message: string }).message;
    }

    const errorsObj = parsed && typeof parsed === "object" && "errors" in parsed ? (parsed as { errors?: unknown }).errors : null;

    const emailMaybe =
      typeof errorsObj === "object" && errorsObj !== null && "email" in errorsObj
        ? (errorsObj as { email?: unknown }).email
        : null;

    const firstEmail = Array.isArray(emailMaybe) && typeof emailMaybe[0] === "string" ? emailMaybe[0] : undefined;

    throw new Error(firstEmail ?? message);
  }

  return parsed;
}

export const useAuthStore = create<PortalAuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email: string, password: string): Promise<void> => {
        const data = await requestJson(
          "/login",
          null,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          },
        );

        const payload =
          typeof data === "object" && data !== null
            ? (data as Partial<{ token: string | null | undefined; user: PortalUser | null | undefined }>)
            : null;

        const token = typeof payload?.token === "string" ? payload.token.trim() || null : null;
        const user = typeof payload?.user === "object" && payload?.user !== null ? (payload.user as PortalUser) : null;

        set({ token, user });
      },

      refreshMe: async (): Promise<void> => {
        const token = get().token;
        if (!token) {
          return;
        }

        try {
          const parsed = (await requestJson("/me", token)) as Partial<{ user: PortalUser }>;

          const user = typeof parsed.user === "object" && parsed.user !== null ? parsed.user : null;

          if (typeof user?.email !== "string") {
            throw new Error("Unexpected /me payload.");
          }

          set({ user });
        } catch {
          set({ token: null, user: null });
        }
      },

      logout: async (): Promise<void> => {
        const token = get().token;

        try {
          if (token && token.trim().length > 0) {
            await requestJson(
              "/logout",
              token,
              {
                method: "POST",
              },
            );
          }
        } finally {
          set({ token: null, user: null });
        }
      },
    }),
    {
      name: "mut-portal-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): Pick<PortalAuthStore, "token" | "user"> => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
