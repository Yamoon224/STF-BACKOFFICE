import { afterEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("apiFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("attaches the admin session cookie as a bearer token by default", async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: "secret-token" }) });
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    const { apiFetch } = await import("./api");
    await apiFetch("/dashboard/kpis");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer secret-token");
  });

  it("does not attach a token for anonymous requests", async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: "secret-token" }) });
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    const { apiFetch } = await import("./api");
    await apiFetch("/auth/login", { anonymous: true });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
    expect(cookiesMock).not.toHaveBeenCalled();
  });

  it("serializes the body as JSON", async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 1 }, 201));
    vi.stubGlobal("fetch", fetchMock);

    const { apiFetch } = await import("./api");
    const result = await apiFetch("/programs", { method: "POST", body: { name: "Test" } });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toBe(JSON.stringify({ name: "Test" }));
    expect(result).toEqual({ id: 1 });
  });

  it("throws an ApiError with the message and status on a non-ok response", async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ message: "Accès refusé.", errors: undefined }, 403)
    );
    vi.stubGlobal("fetch", fetchMock);

    const { apiFetch, ApiError } = await import("./api");

    await expect(apiFetch("/users", { anonymous: true })).rejects.toMatchObject({
      name: "ApiError",
      message: "Accès refusé.",
      status: 403,
    });
    await expect(apiFetch("/users", { anonymous: true })).rejects.toBeInstanceOf(ApiError);
  });

  it("falls back to a generic message when the error response has no body", async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const { apiFetch } = await import("./api");

    await expect(apiFetch("/broken", { anonymous: true })).rejects.toMatchObject({
      status: 500,
      message: "Erreur API (500)",
    });
  });
});
