import { cache } from "react";
import { cookies } from "next/headers";
import { ApiError, apiFetch, AUTH_COOKIE } from "@/lib/api";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  status: "pending" | "active" | "suspended";
  country: string | null;
  phone: string | null;
  roles: string[];
  permissions: string[];
  mfa_enabled: boolean;
  last_login_at: string | null;
};

/** Cached per request: resolves the logged-in staff member from the session cookie, or null. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  if (!cookieStore.get(AUTH_COOKIE)?.value) {
    return null;
  }

  try {
    const { user } = await apiFetch<{ user: SessionUser }>("/auth/me");
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
});

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
