import { AdminShell } from "@/components/layout/AdminShell";
import { getSessionUser, initials } from "@/lib/session";

const ROLE_ACCESS_LABELS: Record<string, string> = {
  admin: "Accès global · toutes permissions",
  staff: "Accès selon mission",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const role = user?.roles[0] ?? "staff";

  return (
    <AdminShell
      userName={user?.name ?? "—"}
      userEmail={user?.email ?? ""}
      userInitials={user ? initials(user.name) : "—"}
      userAccess={ROLE_ACCESS_LABELS[role] ?? "Accès STF"}
    >
      {children}
    </AdminShell>
  );
}
