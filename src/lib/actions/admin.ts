"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";
import type { CmsPageImage } from "@/lib/types";

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
      email: String(formData.get("email") ?? ""),
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
  const payload = new FormData();
  payload.set("title", String(formData.get("title") ?? ""));
  payload.set("type", String(formData.get("type") ?? "page"));
  payload.set("status", formData.get("publish") ? "publie" : "brouillon");

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    payload.set("image", image);
  }

  await apiFetch("/cms/pages", { method: "POST", body: payload });
  revalidatePath("/cms");
}

export async function updateCmsPageAction(pageId: number, formData: FormData): Promise<void> {
  const payload = new FormData();
  payload.set("_method", "PATCH");
  payload.set("title", String(formData.get("title") ?? ""));
  payload.set("body", String(formData.get("body") ?? ""));
  payload.set("excerpt", String(formData.get("excerpt") ?? ""));
  payload.set("category", String(formData.get("category") ?? ""));
  payload.set("status", formData.get("publish") ? "publie" : "brouillon");

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    payload.set("image", image);
  } else if (formData.get("remove_image")) {
    payload.set("remove_image", "1");
  }

  await apiFetch(`/cms/pages/${pageId}`, { method: "POST", body: payload });
  revalidatePath("/cms");
}

export async function deleteCmsPageAction(pageId: number): Promise<void> {
  await apiFetch(`/cms/pages/${pageId}`, { method: "DELETE" });
  revalidatePath("/cms");
}

export async function addCmsPageImagesAction(pageId: number, formData: FormData): Promise<CmsPageImage[]> {
  const payload = new FormData();
  for (const file of formData.getAll("images")) {
    if (file instanceof File && file.size > 0) {
      payload.append("images[]", file);
    }
  }

  const created = await apiFetch<CmsPageImage[]>(`/cms/pages/${pageId}/images`, {
    method: "POST",
    body: payload,
  });
  revalidatePath("/cms");
  return created;
}

export async function deleteCmsPageImageAction(imageId: number): Promise<void> {
  await apiFetch(`/cms/page-images/${imageId}`, { method: "DELETE" });
  revalidatePath("/cms");
}

export async function createPartnerAction(formData: FormData): Promise<void> {
  const payload = new FormData();
  payload.set("name", String(formData.get("name") ?? ""));
  payload.set("url", String(formData.get("url") ?? ""));
  payload.set("type", String(formData.get("type") ?? "confiance"));

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
  payload.set("type", String(formData.get("type") ?? "confiance"));

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

// --- Expériences virtuelles : cours, labo, sessions live -------------------

export async function createCourseAction(formData: FormData): Promise<void> {
  await apiFetch("/courses", {
    method: "POST",
    body: {
      level_id: Number(formData.get("level_id")),
      subject_id: Number(formData.get("subject_id")),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      order: Number(formData.get("order") ?? 0),
      status: String(formData.get("status") ?? "brouillon"),
    },
  });
  revalidatePath("/experiences-virtuelles");
}

export async function updateCourseAction(courseId: number, formData: FormData): Promise<void> {
  await apiFetch(`/courses/${courseId}`, {
    method: "PATCH",
    body: {
      level_id: Number(formData.get("level_id")),
      subject_id: Number(formData.get("subject_id")),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      order: Number(formData.get("order") ?? 0),
      status: String(formData.get("status") ?? "brouillon"),
    },
  });
  revalidatePath("/experiences-virtuelles");
}

export async function deleteCourseAction(courseId: number): Promise<void> {
  await apiFetch(`/courses/${courseId}`, { method: "DELETE" });
  revalidatePath("/experiences-virtuelles");
}

export async function createExperimentAction(formData: FormData): Promise<void> {
  const courseId = String(formData.get("course_id") ?? "");
  const levelId = String(formData.get("level_id") ?? "");
  await apiFetch("/experiments", {
    method: "POST",
    body: {
      subject_id: Number(formData.get("subject_id")),
      level_id: levelId ? Number(levelId) : null,
      course_id: courseId ? Number(courseId) : null,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      instructions: String(formData.get("instructions") ?? "") || null,
      order: Number(formData.get("order") ?? 0),
      status: String(formData.get("status") ?? "brouillon"),
    },
  });
  revalidatePath("/experiences-virtuelles");
}

export async function updateExperimentAction(experimentId: number, formData: FormData): Promise<void> {
  const courseId = String(formData.get("course_id") ?? "");
  const levelId = String(formData.get("level_id") ?? "");
  await apiFetch(`/experiments/${experimentId}`, {
    method: "PATCH",
    body: {
      subject_id: Number(formData.get("subject_id")),
      level_id: levelId ? Number(levelId) : null,
      course_id: courseId ? Number(courseId) : null,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      instructions: String(formData.get("instructions") ?? "") || null,
      order: Number(formData.get("order") ?? 0),
      status: String(formData.get("status") ?? "brouillon"),
    },
  });
  revalidatePath("/experiences-virtuelles");
}

export async function deleteExperimentAction(experimentId: number): Promise<void> {
  await apiFetch(`/experiments/${experimentId}`, { method: "DELETE" });
  revalidatePath("/experiences-virtuelles");
}

export async function createLiveSessionAction(formData: FormData): Promise<void> {
  await apiFetch("/live-sessions", {
    method: "POST",
    body: {
      course_id: Number(formData.get("course_id")),
      title: String(formData.get("title") ?? ""),
      scheduled_at: String(formData.get("scheduled_at") ?? ""),
      duration_minutes: Number(formData.get("duration_minutes") ?? 60),
      meeting_link: String(formData.get("meeting_link") ?? "") || null,
      status: String(formData.get("status") ?? "a_venir"),
    },
  });
  revalidatePath("/experiences-virtuelles");
}

export async function updateLiveSessionAction(sessionId: number, formData: FormData): Promise<void> {
  await apiFetch(`/live-sessions/${sessionId}`, {
    method: "PATCH",
    body: {
      title: String(formData.get("title") ?? ""),
      scheduled_at: String(formData.get("scheduled_at") ?? ""),
      duration_minutes: Number(formData.get("duration_minutes") ?? 60),
      meeting_link: String(formData.get("meeting_link") ?? "") || null,
      status: String(formData.get("status") ?? "a_venir"),
    },
  });
  revalidatePath("/experiences-virtuelles");
}

export async function deleteLiveSessionAction(sessionId: number): Promise<void> {
  await apiFetch(`/live-sessions/${sessionId}`, { method: "DELETE" });
  revalidatePath("/experiences-virtuelles");
}
