import { apiFetch } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { AdminUser } from "@/lib/types";
import { UtilisatricesClient } from "./UtilisatricesClient";

const ROLE_FILTERS: { label: string; value: string | null }[] = [
  { label: "Toutes", value: null },
  { label: "Mentées", value: "mentee" },
  { label: "Mentores", value: "mentor" },
  { label: "Collaboratrices STF", value: "staff" },
  { label: "Bailleurs", value: "donor" },
];

export default async function UtilisatricesPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const [users, sessionUser] = await Promise.all([
    apiFetch<{ data: AdminUser[] }>(`/users${role ? `?role=${role}` : ""}`),
    getSessionUser(),
  ]);
  const isAdmin = sessionUser?.roles.includes("admin") ?? false;

  return (
    <UtilisatricesClient
      users={users.data}
      currentRole={role ?? null}
      roleFilters={ROLE_FILTERS}
      isAdmin={isAdmin}
      currentUserId={sessionUser?.id ?? null}
    />
  );
}
