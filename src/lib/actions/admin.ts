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

export async function confirmMatchAction(pairingId: number, mentorId: number): Promise<void> {
  await apiFetch(`/pairings/${pairingId}`, {
    method: "PATCH",
    body: { mentor_id: mentorId, status: "actif" },
  });
  revalidatePath("/matching");
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
