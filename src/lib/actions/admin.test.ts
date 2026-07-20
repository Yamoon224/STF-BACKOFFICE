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

function fdEntries(body: unknown): Record<string, FormDataEntryValue> {
  expect(body).toBeInstanceOf(FormData);
  return Object.fromEntries((body as FormData).entries());
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

describe("updateUserAction", () => {
  it("updates the profile fields and assigns the role when provided", async () => {
    const { updateUserAction } = await import("./admin");

    await updateUserAction(
      9,
      formData({
        name: "Nouveau Nom",
        email: "nouveau@example.org",
        country: "Sénégal",
        phone: "+221000000",
        locale: "fr",
        role: "staff",
      })
    );

    expect(apiFetchMock).toHaveBeenCalledWith("/users/9", {
      method: "PATCH",
      body: { name: "Nouveau Nom", email: "nouveau@example.org", country: "Sénégal", phone: "+221000000", locale: "fr" },
    });
    expect(apiFetchMock).toHaveBeenCalledWith("/users/9/role", { method: "POST", body: { role: "staff" } });
    expect(revalidatePathMock).toHaveBeenCalledWith("/utilisatrices");
  });

  it("skips the role call when no role is provided", async () => {
    const { updateUserAction } = await import("./admin");

    await updateUserAction(9, formData({ name: "Nouveau Nom", email: "nouveau@example.org" }));

    expect(apiFetchMock).toHaveBeenCalledTimes(1);
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

describe("updateProgramAction / deleteProgramAction", () => {
  it("patches the program", async () => {
    const { updateProgramAction } = await import("./admin");

    await updateProgramAction(2, formData({ name: "Programme modifié", status: "en_cours" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/programs/2", {
      method: "PATCH",
      body: { name: "Programme modifié", status: "en_cours", audience: null, cycle_start: null, cycle_end: null },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/programmes");
  });

  it("deletes the program", async () => {
    const { deleteProgramAction } = await import("./admin");

    await deleteProgramAction(2);

    expect(apiFetchMock).toHaveBeenCalledWith("/programs/2", { method: "DELETE" });
  });
});

describe("cohort actions", () => {
  it("creates a cohort scoped to the program", async () => {
    const { createCohortAction } = await import("./admin");

    await createCohortAction(2, formData({ name: "Cohorte A", status: "a_venir" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/cohorts", {
      method: "POST",
      body: { program_id: 2, name: "Cohorte A", start_date: null, end_date: null, status: "a_venir" },
    });
  });

  it("updates a cohort", async () => {
    const { updateCohortAction } = await import("./admin");

    await updateCohortAction(5, formData({ name: "Cohorte B", status: "en_cours" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/cohorts/5", {
      method: "PATCH",
      body: { name: "Cohorte B", start_date: null, end_date: null, status: "en_cours" },
    });
  });

  it("deletes a cohort", async () => {
    const { deleteCohortAction } = await import("./admin");

    await deleteCohortAction(5);

    expect(apiFetchMock).toHaveBeenCalledWith("/cohorts/5", { method: "DELETE" });
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

describe("pairing actions", () => {
  it("creates a pairing with optional mentor and cohort left null", async () => {
    const { createPairingAction } = await import("./admin");

    await createPairingAction(formData({ mentee_id: "3", program_id: "2" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/pairings", {
      method: "POST",
      body: { mentee_id: 3, program_id: 2, mentor_id: null, cohort_id: null },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/binomes");
    expect(revalidatePathMock).toHaveBeenCalledWith("/matching");
  });

  it("updates the mentor and status of a pairing", async () => {
    const { updatePairingAction } = await import("./admin");

    await updatePairingAction(12, formData({ mentor_id: "5", status: "pause" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/pairings/12", {
      method: "PATCH",
      body: { mentor_id: 5, status: "pause" },
    });
  });

  it("deletes a pairing", async () => {
    const { deletePairingAction } = await import("./admin");

    await deletePairingAction(12);

    expect(apiFetchMock).toHaveBeenCalledWith("/pairings/12", { method: "DELETE" });
  });
});

describe("session actions", () => {
  it("schedules a session for a pairing", async () => {
    const { createSessionAction } = await import("./admin");

    await createSessionAction(
      formData({ pairing_id: "12", scheduled_at: "2026-08-01T10:00", duration_minutes: "45" })
    );

    expect(apiFetchMock).toHaveBeenCalledWith("/sessions", {
      method: "POST",
      body: {
        pairing_id: 12,
        scheduled_at: "2026-08-01T10:00",
        duration_minutes: 45,
        topic: null,
        location_or_link: null,
      },
    });
  });

  it("updates the session status", async () => {
    const { updateSessionStatusAction } = await import("./admin");

    await updateSessionStatusAction(7, "realisee");

    expect(apiFetchMock).toHaveBeenCalledWith("/sessions/7", { method: "PATCH", body: { status: "realisee" } });
  });

  it("deletes a session", async () => {
    const { deleteSessionAction } = await import("./admin");

    await deleteSessionAction(7);

    expect(apiFetchMock).toHaveBeenCalledWith("/sessions/7", { method: "DELETE" });
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

describe("group management actions", () => {
  it("updates a group", async () => {
    const { updateGroupAction } = await import("./admin");

    await updateGroupAction(4, formData({ name: "Groupe modifié", type: "mentorat", status: "actif" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/groups/4", {
      method: "PATCH",
      body: { name: "Groupe modifié", type: "mentorat", status: "actif" },
    });
  });

  it("deletes a group", async () => {
    const { deleteGroupAction } = await import("./admin");

    await deleteGroupAction(4);

    expect(apiFetchMock).toHaveBeenCalledWith("/groups/4", { method: "DELETE" });
  });

  it("adds a member to a group", async () => {
    const { addGroupMemberAction } = await import("./admin");

    await addGroupMemberAction(4, formData({ user_id: "11", role_in_group: "membre" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/groups/4/members", {
      method: "POST",
      body: { user_id: 11, role_in_group: "membre" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/groupes/4");
  });

  it("removes a member from a group", async () => {
    const { removeGroupMemberAction } = await import("./admin");

    await removeGroupMemberAction(4, 11);

    expect(apiFetchMock).toHaveBeenCalledWith("/groups/4/members/11", { method: "DELETE" });
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

describe("cms page management actions", () => {
  it("updates a page and keeps it as draft when publish is unchecked", async () => {
    const { updateCmsPageAction } = await import("./admin");

    await updateCmsPageAction(3, formData({ title: "Titre modifié" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/cms/pages/3", {
      method: "PATCH",
      body: { title: "Titre modifié", body: null, excerpt: null, category: null, status: "brouillon" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/cms");
  });

  it("deletes a page", async () => {
    const { deleteCmsPageAction } = await import("./admin");

    await deleteCmsPageAction(3);

    expect(apiFetchMock).toHaveBeenCalledWith("/cms/pages/3", { method: "DELETE" });
  });
});

describe("partner actions", () => {
  it("creates, updates and deletes a partner", async () => {
    const { createPartnerAction, updatePartnerAction, deletePartnerAction } = await import("./admin");

    await createPartnerAction(formData({ name: "ACME", url: "https://acme.org" }));
    expect(apiFetchMock).toHaveBeenCalledWith("/partners", expect.objectContaining({ method: "POST" }));
    expect(fdEntries(apiFetchMock.mock.calls[0][1].body)).toEqual({ name: "ACME", url: "https://acme.org" });

    await updatePartnerAction(1, formData({ name: "ACME Corp" }));
    expect(apiFetchMock).toHaveBeenCalledWith("/partners/1", expect.objectContaining({ method: "POST" }));
    expect(fdEntries(apiFetchMock.mock.calls[1][1].body)).toEqual({
      _method: "PATCH",
      name: "ACME Corp",
      url: "",
    });

    await deletePartnerAction(1);
    expect(apiFetchMock).toHaveBeenCalledWith("/partners/1", { method: "DELETE" });
  });

  it("uploads a logo file when provided, and forwards remove_logo otherwise", async () => {
    const { createPartnerAction, updatePartnerAction } = await import("./admin");

    const logo = new File(["fake-image-bytes"], "logo.png", { type: "image/png" });
    const withLogo = formData({ name: "ACME" });
    withLogo.set("logo", logo);
    await createPartnerAction(withLogo);
    const created = fdEntries(apiFetchMock.mock.calls[0][1].body);
    expect(created.logo).toBe(logo);

    const removing = formData({ name: "ACME", remove_logo: "on" });
    await updatePartnerAction(1, removing);
    const updated = fdEntries(apiFetchMock.mock.calls[1][1].body);
    expect(updated.remove_logo).toBe("1");
    expect(updated.logo).toBeUndefined();
  });
});

describe("testimonial actions", () => {
  it("creates, updates and deletes a testimonial", async () => {
    const { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction } = await import("./admin");

    await createTestimonialAction(formData({ name: "Awa", role: "Mentée", quote: "Superbe programme" }));
    expect(apiFetchMock).toHaveBeenCalledWith("/testimonials", {
      method: "POST",
      body: { name: "Awa", role: "Mentée", quote: "Superbe programme" },
    });

    await updateTestimonialAction(2, formData({ name: "Awa", role: "Mentore", quote: "Toujours aussi bien" }));
    expect(apiFetchMock).toHaveBeenCalledWith("/testimonials/2", {
      method: "PATCH",
      body: { name: "Awa", role: "Mentore", quote: "Toujours aussi bien" },
    });

    await deleteTestimonialAction(2);
    expect(apiFetchMock).toHaveBeenCalledWith("/testimonials/2", { method: "DELETE" });
  });
});

describe("faq actions", () => {
  it("creates, updates and deletes a FAQ entry", async () => {
    const { createFaqAction, updateFaqAction, deleteFaqAction } = await import("./admin");

    await createFaqAction(formData({ question: "Comment postuler ?", answer: "Via le site." }));
    expect(apiFetchMock).toHaveBeenCalledWith("/faqs", {
      method: "POST",
      body: { question: "Comment postuler ?", answer: "Via le site.", category: null },
    });

    await updateFaqAction(6, formData({ question: "Comment postuler ?", answer: "Via le formulaire dédié." }));
    expect(apiFetchMock).toHaveBeenCalledWith("/faqs/6", {
      method: "PATCH",
      body: { question: "Comment postuler ?", answer: "Via le formulaire dédié.", category: null },
    });

    await deleteFaqAction(6);
    expect(apiFetchMock).toHaveBeenCalledWith("/faqs/6", { method: "DELETE" });
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

describe("setupMfaAction", () => {
  it("returns the generated secret and QR code", async () => {
    apiFetchMock.mockResolvedValue({ secret: "SECRET", otpauth_url: "otpauth://…", qr_code_svg: "<svg></svg>" });
    const { setupMfaAction } = await import("./admin");

    const state = await setupMfaAction();

    expect(apiFetchMock).toHaveBeenCalledWith("/auth/mfa/setup", { method: "POST" });
    expect(state).toEqual({ secret: "SECRET", otpauth_url: "otpauth://…", qr_code_svg: "<svg></svg>" });
  });

  it("returns the API error message on failure", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetchMock.mockRejectedValue(new ApiError("Erreur.", 500));
    const { setupMfaAction } = await import("./admin");

    const state = await setupMfaAction();

    expect(state).toEqual({ error: "Erreur." });
  });
});

describe("confirmMfaAction", () => {
  it("returns the recovery codes and revalidates the profile page", async () => {
    apiFetchMock.mockResolvedValue({ recovery_codes: ["AAAA-BBBB", "CCCC-DDDD"] });
    const { confirmMfaAction } = await import("./admin");

    const state = await confirmMfaAction(null, formData({ code: "123456" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/auth/mfa/confirm", { method: "POST", body: { code: "123456" } });
    expect(state).toEqual({ recoveryCodes: ["AAAA-BBBB", "CCCC-DDDD"] });
    expect(revalidatePathMock).toHaveBeenCalledWith("/profil");
  });

  it("returns the API error message on an invalid code", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetchMock.mockRejectedValue(new ApiError("Code de vérification invalide.", 422));
    const { confirmMfaAction } = await import("./admin");

    const state = await confirmMfaAction(null, formData({ code: "000000" }));

    expect(state).toEqual({ error: "Code de vérification invalide." });
  });
});

describe("disableMfaAction", () => {
  it("disables MFA and revalidates the profile page", async () => {
    apiFetchMock.mockResolvedValue(undefined);
    const { disableMfaAction } = await import("./admin");

    const state = await disableMfaAction(null, formData({ password: "correct" }));

    expect(apiFetchMock).toHaveBeenCalledWith("/auth/mfa/disable", { method: "POST", body: { password: "correct" } });
    expect(state).toEqual({ success: true });
    expect(revalidatePathMock).toHaveBeenCalledWith("/profil");
  });

  it("returns the API error message on an incorrect password", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetchMock.mockRejectedValue(new ApiError("Mot de passe incorrect.", 422));
    const { disableMfaAction } = await import("./admin");

    const state = await disableMfaAction(null, formData({ password: "wrong" }));

    expect(state).toEqual({ error: "Mot de passe incorrect." });
  });
});
