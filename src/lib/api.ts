import { cookies } from "next/headers";

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
    throw new ApiError(data?.message ?? `Erreur API (${res.status})`, res.status, data?.errors);
  }

  return data as T;
}
