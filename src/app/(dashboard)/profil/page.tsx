import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSessionUser, initials } from "@/lib/session";
import { logoutAction } from "@/lib/actions/auth";
import { formatDateTime, roleLabel } from "@/lib/format";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { MfaForm } from "./MfaForm";

export default async function ProfilPage() {
  const user = await getSessionUser();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-stf-orange-light text-lg font-bold text-stf-orange">
              {user ? initials(user.name) : "—"}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-stf-navy dark:text-white">{user?.name ?? "—"}</h2>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{user?.email ?? ""}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="rounded-full border border-stf-red/30 px-5 py-2.5 text-center text-sm font-semibold text-stf-red hover:bg-stf-red-light dark:hover:bg-stf-red/15">
              Se déconnecter
            </button>
          </form>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Informations du compte">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Rôle
              <span className="text-right font-medium text-stf-navy dark:text-white">
                {roleLabel(user?.roles[0] ?? "—")}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Dernière connexion
              <span className="text-right font-medium text-stf-navy dark:text-white">
                {formatDateTime(user?.last_login_at ?? null)}
              </span>
            </li>
          </ul>
        </Card>

        <Card title="Sécurité">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              <div className="flex items-center justify-between gap-3">
                Authentification multi-facteurs (MFA)
                <Badge tone={user?.mfa_enabled ? "green" : "orange"}>
                  {user?.mfa_enabled ? "Activée" : "Désactivée"}
                </Badge>
              </div>
              <div className="mt-3">
                <MfaForm mfaEnabled={user?.mfa_enabled ?? false} />
              </div>
            </li>
            <li className="rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              <p className="mb-3 flex items-center justify-between">
                Mot de passe
              </p>
              <ChangePasswordForm />
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Historique des actions
              <Link href="/audit-logs" className="shrink-0 text-sm font-semibold text-stf-blue hover:text-stf-orange">
                Voir les journaux
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
