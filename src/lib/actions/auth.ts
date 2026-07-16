"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiFetch, AUTH_COOKIE } from "@/lib/api";

export type AuthActionState = {
  error?: string;
  mfaRequired?: boolean;
} | null;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 12,
};

async function establishSession(token: string): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, COOKIE_OPTIONS);
  redirect("/");
}

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  try {
    const result = await apiFetch<
      { mfa_required: true; mfa_challenge: string } | { token: string }
    >("/auth/login", { method: "POST", body: { email, password }, anonymous: true });

    if (!("mfa_required" in result)) {
      await establishSession(result.token);
      return null;
    }

    if (!code) {
      return { mfaRequired: true, error: "Cette utilisatrice a la double authentification activée : renseignez le code." };
    }

    const verified = await apiFetch<{ token: string }>("/auth/mfa/verify", {
      method: "POST",
      body: { mfa_challenge: result.mfa_challenge, code },
      anonymous: true,
    });

    await establishSession(verified.token);
    return null;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, mfaRequired: !!code };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (token) {
    await apiFetch("/auth/logout", { method: "POST", token }).catch(() => null);
  }

  cookieStore.delete(AUTH_COOKIE);
  redirect("/connexion");
}
