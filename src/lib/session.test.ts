import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.fn();
const apiFetchMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

vi.mock("./api", async () => {
  const actual = await vi.importActual<typeof import("./api")>("./api");
  return { ...actual, apiFetch: (...args: unknown[]) => apiFetchMock(...args) };
});

describe("getSessionUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("returns null without calling the API when there is no session cookie", async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });

    const { getSessionUser } = await import("./session");
    const user = await getSessionUser();

    expect(user).toBeNull();
    expect(apiFetchMock).not.toHaveBeenCalled();
  });

  it("returns the staff member from /auth/me when a session cookie is present", async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: "token" }) });
    apiFetchMock.mockResolvedValue({ user: { id: 1, name: "Administratrice STF", roles: ["admin"] } });

    const { getSessionUser } = await import("./session");
    const user = await getSessionUser();

    expect(user).toMatchObject({ id: 1, name: "Administratrice STF" });
    expect(apiFetchMock).toHaveBeenCalledWith("/auth/me");
  });

  it("returns null when the API responds 401 (expired/invalid token)", async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: "expired-token" }) });
    const { ApiError } = await import("./api");
    apiFetchMock.mockRejectedValue(new ApiError("Unauthenticated.", 401));

    const { getSessionUser } = await import("./session");

    await expect(getSessionUser()).resolves.toBeNull();
  });

  it("rethrows non-401 API errors", async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: "token" }) });
    const { ApiError } = await import("./api");
    apiFetchMock.mockRejectedValue(new ApiError("Erreur serveur", 500));

    const { getSessionUser } = await import("./session");

    await expect(getSessionUser()).rejects.toMatchObject({ status: 500 });
  });
});

describe("initials", () => {
  it("builds two uppercase initials from a full name", async () => {
    const { initials } = await import("./session");

    expect(initials("Administratrice STF")).toBe("AS");
  });

  it("handles a single-word name", async () => {
    const { initials } = await import("./session");

    expect(initials("Admin")).toBe("A");
  });
});
