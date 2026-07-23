import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL ?? "https://stf.jss-gn.com/api";
export const AUTH_COOKIE = "stf_admin_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
  /** Skip attaching the session cookie's bearer token (public endpoints). */
  anonymous?: boolean;
};

/**
 * Server-only fetch helper. Attaches the caller's Sanctum token (read from the
 * httpOnly session cookie) so the Laravel API can authorize the request.
 */
export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, anonymous, headers, ...rest } = options;

  let bearer = token ?? null;
  if (!anonymous && bearer === null) {
    const cookieStore = await cookies();
    bearer = cookieStore.get(AUTH_COOKIE)?.value ?? null;
  }

  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    // A previously valid session token was rejected by the API (expired/revoked):
    // clear it and send the user back to the login page instead of surfacing a crash.
    if (res.status === 401 && !anonymous) {
      try {
        // Cookie mutation only succeeds when called from a Server Action / Route
        // Handler; in a Server Component render (read-only cookies) this throws,
        // which we ignore - the redirect below still fires either way.
        const cookieStore = await cookies();
        cookieStore.delete(AUTH_COOKIE);
      } catch {
        // ignore - read-only cookies() context (Server Component render)
      }
      redirect("/connexion");
    }

    throw new ApiError(data?.message ?? `Erreur API (${res.status})`, res.status, data?.errors);
  }

  return data as T;
}
