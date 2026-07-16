import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetchMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch: (...args: unknown[]) => apiFetchMock(...args) };
});
vi.mock("next/cache", () => ({ revalidatePath: (path: string) => revalidatePathMock(path) }));

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("inviteUserAction", () => {
  it("combines the first and last name and always assigns the staff role", async () => {
    const { inviteUserAction } = await import("./admin");

    await inviteUserAction(formData({ firstName: "Nouvelle", lastName: "Collaboratrice", email: "n@example.org" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/users", {
      method: "POST",
      body: { name: "Nouvelle Collaboratrice", email: "n@example.org", role: "staff" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/utilisatrices");
  });
});

describe("validateMentorAction", () => {
  it("validates the mentor and revalidates the users and dashboard pages", async () => {
    const { validateMentorAction } = await import("./admin");

    await validateMentorAction(7);

    expect(apiFetchMock).toHaveBeenCalledWith("/users/7/validate-mentor", { method: "POST" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/utilisatrices");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });
});

describe("suspendUserAction / activateUserAction", () => {
  it("calls the matching endpoint for each action", async () => {
    const { suspendUserAction, activateUserAction } = await import("./admin");

    await suspendUserAction(3);
    expect(apiFetchMock).toHaveBeenCalledWith("/users/3/suspend", { method: "POST" });

    await activateUserAction(3);
    expect(apiFetchMock).toHaveBeenCalledWith("/users/3/activate", { method: "POST" });
  });
});

describe("createProgramAction", () => {
  it("defaults the status to a_venir when omitted", async () => {
    const { createProgramAction } = await import("./admin");

    await createProgramAction(formData({ name: "Nouveau programme" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/programs", {
      method: "POST",
      body: { name: "Nouveau programme", status: "a_venir" },
    });
  });
});

describe("confirmMatchAction", () => {
  it("assigns the mentor and activates the pairing", async () => {
    const { confirmMatchAction } = await import("./admin");

    await confirmMatchAction(12, 5);

    expect(apiFetchMock).toHaveBeenCalledWith("/pairings/12", {
      method: "PATCH",
      body: { mentor_id: 5, status: "actif" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/matching");
    expect(revalidatePathMock).toHaveBeenCalledWith("/binomes");
  });
});

describe("createGroupAction", () => {
  it("defaults the type to travail when omitted", async () => {
    const { createGroupAction } = await import("./admin");

    await createGroupAction(formData({ name: "Nouveau groupe" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/groups", {
      method: "POST",
      body: { name: "Nouveau groupe", type: "travail" },
    });
  });
});

describe("createCmsPageAction", () => {
  it("saves as draft when publish is unchecked", async () => {
    const { createCmsPageAction } = await import("./admin");

    await createCmsPageAction(formData({ title: "Article" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/cms/pages", {
      method: "POST",
      body: { title: "Article", type: "page", status: "brouillon" },
    });
  });

  it("publishes immediately when the publish checkbox is checked", async () => {
    const { createCmsPageAction } = await import("./admin");

    await createCmsPageAction(formData({ title: "Article", type: "article", publish: "on" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/cms/pages", {
      method: "POST",
      body: { title: "Article", type: "article", status: "publie" },
    });
  });
});

describe("updateReportStatusAction", () => {
  it("patches the report with the new status", async () => {
    const { updateReportStatusAction } = await import("./admin");

    await updateReportStatusAction(4, "resolu");

    expect(apiFetchMock).toHaveBeenCalledWith("/reports/4", { method: "PATCH", body: { status: "resolu" } });
    expect(revalidatePathMock).toHaveBeenCalledWith("/signalements");
  });
});

describe("changePasswordAction", () => {
  it("returns success when the password change succeeds", async () => {
    apiFetchMock.mockResolvedValue(undefined);
    const { changePasswordAction } = await import("./admin");

    const state = await changePasswordAction(
      null,
      formData({ current_password: "old", password: "newpass123", password_confirmation: "newpass123" })
    );

    expect(state).toEqual({ success: true });
  });

  it("returns the API error message on failure", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetchMock.mockRejectedValue(new ApiError("Mot de passe actuel incorrect.", 422));
    const { changePasswordAction } = await import("./admin");

    const state = await changePasswordAction(
      null,
      formData({ current_password: "wrong", password: "newpass123", password_confirmation: "newpass123" })
    );

    expect(state).toEqual({ error: "Mot de passe actuel incorrect." });
  });
});
