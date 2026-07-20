"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";

export async function inviteUserAction(formData: FormData): Promise<void> {
  await apiFetch("/users", {
    method: "POST",
    body: {
      name: `${formData.get("firstName") ?? ""} ${formData.get("lastName") ?? ""}`.trim(),
      email: String(formData.get("email") ?? ""),
      role: "staff",
    },
  });
  revalidatePath("/utilisatrices");
}

export async function validateMentorAction(userId: number): Promise<void> {
  await apiFetch(`/users/${userId}/validate-mentor`, { method: "POST" });
  revalidatePath("/utilisatrices");
  revalidatePath("/");
}

export async function suspendUserAction(userId: number): Promise<void> {
  await apiFetch(`/users/${userId}/suspend`, { method: "POST" });
  revalidatePath("/utilisatrices");
}

export async function activateUserAction(userId: number): Promise<void> {
  await apiFetch(`/users/${userId}/activate`, { method: "POST" });
  revalidatePath("/utilisatrices");
}

export async function resetUserPasswordAction(userId: number): Promise<string> {
  const result = await apiFetch<{ password: string }>(`/users/${userId}/reset-password`, { method: "POST" });
  revalidatePath("/utilisatrices");
  return result.password;
}

export async function deleteUserAction(userId: number): Promise<void> {
  await apiFetch(`/users/${userId}`, { method: "DELETE" });
  revalidatePath("/utilisatrices");
}

export async function updateUserAction(userId: number, formData: FormData): Promise<void> {
  await apiFetch(`/users/${userId}`, {
    method: "PATCH",
    body: {
      name: String(formData.get("name") ?? ""),
      country: String(formData.get("country") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      locale: String(formData.get("locale") ?? "fr"),
    },
  });

  const role = String(formData.get("role") ?? "");
  if (role) {
    await apiFetch(`/users/${userId}/role`, { method: "POST", body: { role } });
  }

  revalidatePath("/utilisatrices");
}

export async function createProgramAction(formData: FormData): Promise<void> {
  await apiFetch("/programs", {
    method: "POST",
    body: {
      name: String(formData.get("name") ?? ""),
      status: String(formData.get("status") ?? "a_venir"),
    },
  });
  revalidatePath("/programmes");
}

export async function updateProgramAction(programId: number, formData: FormData): Promise<void> {
  await apiFetch(`/programs/${programId}`, {
    method: "PATCH",
    body: {
      name: String(formData.get("name") ?? ""),
      status: String(formData.get("status") ?? "a_venir"),
      audience: String(formData.get("audience") ?? "") || null,
      cycle_start: String(formData.get("cycle_start") ?? "") || null,
      cycle_end: String(formData.get("cycle_end") ?? "") || null,
    },
  });
  revalidatePath("/programmes");
}

export async function deleteProgramAction(programId: number): Promise<void> {
  await apiFetch(`/programs/${programId}`, { method: "DELETE" });
  revalidatePath("/programmes");
}

export async function createCohortAction(programId: number, formData: FormData): Promise<void> {
  await apiFetch("/cohorts", {
    method: "POST",
    body: {
      program_id: programId,
      name: String(formData.get("name") ?? ""),
      start_date: String(formData.get("start_date") ?? "") || null,
      end_date: String(formData.get("end_date") ?? "") || null,
      status: String(formData.get("status") ?? "a_venir"),
    },
  });
  revalidatePath("/programmes");
}

export async function updateCohortAction(cohortId: number, formData: FormData): Promise<void> {
  await apiFetch(`/cohorts/${cohortId}`, {
    method: "PATCH",
    body: {
      name: String(formData.get("name") ?? ""),
      start_date: String(formData.get("start_date") ?? "") || null,
      end_date: String(formData.get("end_date") ?? "") || null,
      status: String(formData.get("status") ?? "a_venir"),
    },
  });
  revalidatePath("/programmes");
}

export async function deleteCohortAction(cohortId: number): Promise<void> {
  await apiFetch(`/cohorts/${cohortId}`, { method: "DELETE" });
  revalidatePath("/programmes");
}

export async function confirmMatchAction(pairingId: number, mentorId: number): Promise<void> {
  await apiFetch(`/pairings/${pairingId}`, {
    method: "PATCH",
    body: { mentor_id: mentorId, status: "actif" },
  });
  revalidatePath("/matching");
  revalidatePath("/binomes");
}

export async function createPairingAction(formData: FormData): Promise<void> {
  const mentorId = String(formData.get("mentor_id") ?? "");
  const cohortId = String(formData.get("cohort_id") ?? "");
  await apiFetch("/pairings", {
    method: "POST",
    body: {
      mentee_id: Number(formData.get("mentee_id")),
      program_id: Number(formData.get("program_id")),
      mentor_id: mentorId ? Number(mentorId) : null,
      cohort_id: cohortId ? Number(cohortId) : null,
    },
  });
  revalidatePath("/binomes");
  revalidatePath("/matching");
}

export async function updatePairingAction(pairingId: number, formData: FormData): Promise<void> {
  const mentorId = String(formData.get("mentor_id") ?? "");
  await apiFetch(`/pairings/${pairingId}`, {
    method: "PATCH",
    body: {
      mentor_id: mentorId ? Number(mentorId) : null,
      status: String(formData.get("status") ?? "en_attente"),
    },
  });
  revalidatePath("/binomes");
  revalidatePath("/matching");
}

export async function deletePairingAction(pairingId: number): Promise<void> {
  await apiFetch(`/pairings/${pairingId}`, { method: "DELETE" });
  revalidatePath("/binomes");
}

export async function createSessionAction(formData: FormData): Promise<void> {
  const durationMinutes = String(formData.get("duration_minutes") ?? "");
  await apiFetch("/sessions", {
    method: "POST",
    body: {
      pairing_id: Number(formData.get("pairing_id")),
      scheduled_at: String(formData.get("scheduled_at") ?? ""),
      duration_minutes: durationMinutes ? Number(durationMinutes) : null,
      topic: String(formData.get("topic") ?? "") || null,
      location_or_link: String(formData.get("location_or_link") ?? "") || null,
    },
  });
  revalidatePath("/binomes");
}

export async function updateSessionStatusAction(
  sessionId: number,
  status: "en_attente" | "confirmee" | "realisee" | "annulee"
): Promise<void> {
  await apiFetch(`/sessions/${sessionId}`, { method: "PATCH", body: { status } });
  revalidatePath("/binomes");
}

export async function deleteSessionAction(sessionId: number): Promise<void> {
  await apiFetch(`/sessions/${sessionId}`, { method: "DELETE" });
  revalidatePath("/binomes");
}

export async function createGroupAction(formData: FormData): Promise<void> {
  await apiFetch("/groups", {
    method: "POST",
    body: {
      name: String(formData.get("name") ?? ""),
      type: String(formData.get("type") ?? "travail"),
    },
  });
  revalidatePath("/groupes");
}

export async function updateGroupAction(groupId: number, formData: FormData): Promise<void> {
  await apiFetch(`/groups/${groupId}`, {
    method: "PATCH",
    body: {
      name: String(formData.get("name") ?? ""),
      type: String(formData.get("type") ?? "travail"),
      status: String(formData.get("status") ?? "en_validation"),
    },
  });
  revalidatePath("/groupes");
}

export async function deleteGroupAction(groupId: number): Promise<void> {
  await apiFetch(`/groups/${groupId}`, { method: "DELETE" });
  revalidatePath("/groupes");
}

export async function addGroupMemberAction(groupId: number, formData: FormData): Promise<void> {
  await apiFetch(`/groups/${groupId}/members`, {
    method: "POST",
    body: {
      user_id: Number(formData.get("user_id")),
      role_in_group: String(formData.get("role_in_group") ?? "membre"),
    },
  });
  revalidatePath(`/groupes/${groupId}`);
  revalidatePath("/groupes");
}

export async function removeGroupMemberAction(groupId: number, userId: number): Promise<void> {
  await apiFetch(`/groups/${groupId}/members/${userId}`, { method: "DELETE" });
  revalidatePath(`/groupes/${groupId}`);
  revalidatePath("/groupes");
}

export async function createCmsPageAction(formData: FormData): Promise<void> {
  await apiFetch("/cms/pages", {
    method: "POST",
    body: {
      title: String(formData.get("title") ?? ""),
      type: String(formData.get("type") ?? "page"),
      status: formData.get("publish") ? "publie" : "brouillon",
    },
  });
  revalidatePath("/cms");
}

export async function updateCmsPageAction(pageId: number, formData: FormData): Promise<void> {
  await apiFetch(`/cms/pages/${pageId}`, {
    method: "PATCH",
    body: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? "") || null,
      excerpt: String(formData.get("excerpt") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      status: formData.get("publish") ? "publie" : "brouillon",
    },
  });
  revalidatePath("/cms");
}

export async function deleteCmsPageAction(pageId: number): Promise<void> {
  await apiFetch(`/cms/pages/${pageId}`, { method: "DELETE" });
  revalidatePath("/cms");
}

export async function createPartnerAction(formData: FormData): Promise<void> {
  const payload = new FormData();
  payload.set("name", String(formData.get("name") ?? ""));
  payload.set("url", String(formData.get("url") ?? ""));

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    payload.set("logo", logo);
  }

  await apiFetch("/partners", { method: "POST", body: payload });
  revalidatePath("/cms");
}

export async function updatePartnerAction(partnerId: number, formData: FormData): Promise<void> {
  const payload = new FormData();
  payload.set("_method", "PATCH");
  payload.set("name", String(formData.get("name") ?? ""));
  payload.set("url", String(formData.get("url") ?? ""));

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    payload.set("logo", logo);
  } else if (formData.get("remove_logo")) {
    payload.set("remove_logo", "1");
  }

  await apiFetch(`/partners/${partnerId}`, { method: "POST", body: payload });
  revalidatePath("/cms");
}

export async function deletePartnerAction(partnerId: number): Promise<void> {
  await apiFetch(`/partners/${partnerId}`, { method: "DELETE" });
  revalidatePath("/cms");
}

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await apiFetch("/testimonials", {
    method: "POST",
    body: {
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      quote: String(formData.get("quote") ?? ""),
    },
  });
  revalidatePath("/cms");
}

export async function updateTestimonialAction(testimonialId: number, formData: FormData): Promise<void> {
  await apiFetch(`/testimonials/${testimonialId}`, {
    method: "PATCH",
    body: {
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      quote: String(formData.get("quote") ?? ""),
    },
  });
  revalidatePath("/cms");
}

export async function deleteTestimonialAction(testimonialId: number): Promise<void> {
  await apiFetch(`/testimonials/${testimonialId}`, { method: "DELETE" });
  revalidatePath("/cms");
}

export async function createFaqAction(formData: FormData): Promise<void> {
  await apiFetch("/faqs", {
    method: "POST",
    body: {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      category: String(formData.get("category") ?? "") || null,
    },
  });
  revalidatePath("/cms");
}

export async function updateFaqAction(faqId: number, formData: FormData): Promise<void> {
  await apiFetch(`/faqs/${faqId}`, {
    method: "PATCH",
    body: {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      category: String(formData.get("category") ?? "") || null,
    },
  });
  revalidatePath("/cms");
}

export async function deleteFaqAction(faqId: number): Promise<void> {
  await apiFetch(`/faqs/${faqId}`, { method: "DELETE" });
  revalidatePath("/cms");
}

export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  const body: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    body[key] = String(value);
  }
  await apiFetch("/site-settings", { method: "PATCH", body });
  revalidatePath("/cms");
}

export async function updatePageSectionAction(sectionId: number, payload: Record<string, unknown>): Promise<void> {
  await apiFetch(`/page-sections/${sectionId}`, { method: "PATCH", body: { payload } });
  revalidatePath("/cms");
}

export async function updateReportStatusAction(reportId: number, status: "en_cours" | "resolu"): Promise<void> {
  await apiFetch(`/reports/${reportId}`, { method: "PATCH", body: { status } });
  revalidatePath("/signalements");
}

export type ChangePasswordState = { error?: string; success?: boolean } | null;

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  try {
    await apiFetch("/auth/password", {
      method: "POST",
      body: {
        current_password: String(formData.get("current_password") ?? ""),
        password: String(formData.get("password") ?? ""),
        password_confirmation: String(formData.get("password_confirmation") ?? ""),
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    throw error;
  }
}

export type MfaSetupState = { secret: string; otpauth_url: string; qr_code_svg: string; error?: undefined } | { error: string } | null;

export async function setupMfaAction(): Promise<MfaSetupState> {
  try {
    return await apiFetch<{ secret: string; otpauth_url: string; qr_code_svg: string }>("/auth/mfa/setup", {
      method: "POST",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    throw error;
  }
}

export type MfaConfirmState = { recoveryCodes: string[]; error?: undefined } | { error: string } | null;

export async function confirmMfaAction(
  _prevState: MfaConfirmState,
  formData: FormData
): Promise<MfaConfirmState> {
  try {
    const { recovery_codes } = await apiFetch<{ recovery_codes: string[] }>("/auth/mfa/confirm", {
      method: "POST",
      body: { code: String(formData.get("code") ?? "") },
    });
    revalidatePath("/profil");
    return { recoveryCodes: recovery_codes };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    throw error;
  }
}

export type MfaDisableState = { error?: string; success?: boolean } | null;

export async function disableMfaAction(
  _prevState: MfaDisableState,
  formData: FormData
): Promise<MfaDisableState> {
  try {
    await apiFetch("/auth/mfa/disable", {
      method: "POST",
      body: { password: String(formData.get("password") ?? "") },
    });
    revalidatePath("/profil");
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    throw error;
  }
}
