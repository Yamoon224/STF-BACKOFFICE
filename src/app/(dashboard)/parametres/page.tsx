import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import { roleLabel } from "@/lib/format";
import type { Role } from "@/lib/types";

export default async function ParametresPage() {
  const roles = await apiFetch<Role[]>("/roles");

  return (
    <div className="space-y-6">
      <Card title="Rôles et permissions">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Rôle</th>
                <th className="py-3">Accès</th>
                <th className="py-3">MFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {roles.map((r) => (
                <tr key={r.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{roleLabel(r.name)}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">
                    {r.permissions.length > 0 ? r.permissions.join(", ") : "Accès selon affectation"}
                  </td>
                  <td className="py-4">
                    <Badge tone={r.name === "admin" ? "green" : "neutral"}>
                      {r.name === "admin" ? "Obligatoire" : "Optionnel"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Sécurité du compte">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Authentification multi-facteurs (MFA)
              <Badge tone="green">Activée</Badge>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Contrôle d&apos;accès basé sur les rôles (RBAC)
              <Badge tone="green">Actif</Badge>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Vérification côté serveur systématique
              <Badge tone="green">Actif</Badge>
            </li>
          </ul>
        </Card>

        <Card title="Sauvegardes & plan de reprise d'activité">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Dernière sauvegarde
              <span className="font-medium text-stf-navy dark:text-white">14/07/2026 — 02:00</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Fréquence
              <span className="font-medium text-stf-navy dark:text-white">Quotidienne</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
              Plan de reprise d&apos;activité
              <Badge tone="green">Documenté</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
