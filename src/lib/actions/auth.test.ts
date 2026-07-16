import { beforeEach, describe, expect, it, vi } from "vitest";

class RedirectSignal extends Error {
  constructor(public url: string) {
    super(`REDIRECT:${url}`);
  }
}

const cookieStoreMock = { set: vi.fn(), delete: vi.fn(), get: vi.fn() };
const cookiesMock = vi.fn(() => cookieStoreMock);
const redirectMock = vi.fn((url: string) => {
  throw new RedirectSignal(url);
});
const apiFetchMock = vi.fn();

vi.mock("next/headers", () => ({ cookies: () => cookiesMock() }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => redirectMock(url) }));
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch: (...args: unknown[]) => apiFetchMock(...args) };
});

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  cookiesMock.mockReturnValue(cookieStoreMock);
});

describe("loginAction", () => {
  it("establishes a session and redirects to / when MFA is not enabled", async () => {
    apiFetchMock.mockResolvedValue({ token: "abc" });
    const { loginAction } = await import("./auth");

    await expect(
      loginAction(null, formData({ email: "admin@example.org", password: "secret" }))
    ).rejects.toBeInstanceOf(RedirectSignal);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/auth/login",
      expect.objectContaining({ body: { email: "admin@example.org", password: "secret" } })
    );
    expect(cookieStoreMock.set).toHaveBeenCalledWith(
      "stf_admin_token",
      "abc",
      expect.objectContaining({ httpOnly: true })
    );
    expect(redirectMock).toHaveBeenCalledWith("/");
    expect(apiFetchMock).not.toHaveBeenCalledWith("/auth/mfa/verify", expect.anything());
  });

  it("asks for the MFA code without redirecting when the account requires it", async () => {
    apiFetchMock.mockResolvedValue({ mfa_required: true, mfa_challenge: "chal-1" });
    const { loginAction } = await import("./auth");

    const state = await loginAction(null, formData({ email: "admin@example.org", password: "secret" }));

    expect(state).toMatchObject({ mfaRequired: true });
    expect(redirectMock).not.toHaveBeenCalled();
    expect(cookieStoreMock.set).not.toHaveBeenCalled();
  });

  it("verifies the MFA code in the same submission and establishes the session", async () => {
    apiFetchMock
      .mockResolvedValueOnce({ mfa_required: true, mfa_challenge: "chal-1" })
      .mockResolvedValueOnce({ token: "xyz" });
    const { loginAction } = await import("./auth");

    await expect(
      loginAction(null, formData({ email: "admin@example.org", password: "secret", code: "123456" }))
    ).rejects.toBeInstanceOf(RedirectSignal);

    expect(apiFetchMock).toHaveBeenNthCalledWith(
      2,
      "/auth/mfa/verify",
      expect.objectContaining({ body: { mfa_challenge: "chal-1", code: "123456" } })
    );
    expect(cookieStoreMock.set).toHaveBeenCalledWith("stf_admin_token", "xyz", expect.anything());
    expect(redirectMock).toHaveBeenCalledWith("/");
  });

  it("returns an error and keeps mfaRequired when the code is wrong", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetchMock
      .mockResolvedValueOnce({ mfa_required: true, mfa_challenge: "chal-1" })
      .mockRejectedValueOnce(new ApiError("Code de vérification invalide.", 422));
    const { loginAction } = await import("./auth");

    const state = await loginAction(
      null,
      formData({ email: "admin@example.org", password: "secret", code: "000000" })
    );

    expect(state).toEqual({ error: "Code de vérification invalide.", mfaRequired: true });
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("surfaces invalid credentials from the initial login call", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetchMock.mockRejectedValue(new ApiError("Identifiants invalides.", 422));
    const { loginAction } = await import("./auth");

    const state = await loginAction(null, formData({ email: "admin@example.org", password: "wrong" }));

    expect(state).toEqual({ error: "Identifiants invalides.", mfaRequired: false });
  });
});

describe("logoutAction", () => {
  it("revokes the token, clears the cookie and redirects to /connexion", async () => {
    cookieStoreMock.get.mockReturnValue({ value: "current-token" });
    apiFetchMock.mockResolvedValue(undefined);
    const { logoutAction } = await import("./auth");

    await expect(logoutAction()).rejects.toBeInstanceOf(RedirectSignal);

    expect(apiFetchMock).toHaveBeenCalledWith("/auth/logout", { method: "POST", token: "current-token" });
    expect(cookieStoreMock.delete).toHaveBeenCalledWith("stf_admin_token");
    expect(redirectMock).toHaveBeenCalledWith("/connexion");
  });

  it("skips the API call when there is no session cookie but still redirects", async () => {
    cookieStoreMock.get.mockReturnValue(undefined);
    const { logoutAction } = await import("./auth");

    await expect(logoutAction()).rejects.toBeInstanceOf(RedirectSignal);

    expect(apiFetchMock).not.toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith("/connexion");
  });
});
