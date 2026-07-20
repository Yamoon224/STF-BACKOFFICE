import { apiFetch } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { AdminUser, Paginated } from "@/lib/types";
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
  searchParams: Promise<{ role?: string; page?: string }>;
}) {
  const { role, page } = await searchParams;
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (page) params.set("page", page);

  const [users, sessionUser] = await Promise.all([
    apiFetch<Paginated<AdminUser>>(`/users${params.size ? `?${params}` : ""}`),
    getSessionUser(),
  ]);
  const isAdmin = sessionUser?.roles.includes("admin") ?? false;

  return (
    <UtilisatricesClient
      users={users.data}
      pagination={{ currentPage: users.current_page, lastPage: users.last_page, total: users.total, perPage: users.per_page }}
      currentRole={role ?? null}
      roleFilters={ROLE_FILTERS}
      isAdmin={isAdmin}
      currentUserId={sessionUser?.id ?? null}
    />
  );
}
