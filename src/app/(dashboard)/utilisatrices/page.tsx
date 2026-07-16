import { apiFetch } from "@/lib/api";
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
  const users = await apiFetch<{ data: AdminUser[] }>(`/users${role ? `?role=${role}` : ""}`);

  return <UtilisatricesClient users={users.data} currentRole={role ?? null} roleFilters={ROLE_FILTERS} />;
}
