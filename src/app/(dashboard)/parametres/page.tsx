import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { roles } from "@/lib/mock-data";

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <Card title="Rôles et permissions">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3">Rôle</th>
                <th className="py-3">Accès</th>
                <th className="py-3">MFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map((r) => (
                <tr key={r.name}>
                  <td className="py-4 font-medium text-stf-navy">{r.name}</td>
                  <td className="py-4 text-slate-500">{r.access}</td>
                  <td className="py-4">
                    <Badge tone={r.mfa ? "green" : "neutral"}>{r.mfa ? "Obligatoire" : "Optionnel"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title="Sécurité du compte">
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              Authentification multi-facteurs (MFA)
              <Badge tone="green">Activée</Badge>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              Contrôle d&apos;accès basé sur les rôles (RBAC)
              <Badge tone="green">Actif</Badge>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              Vérification côté serveur systématique
              <Badge tone="green">Actif</Badge>
            </li>
          </ul>
        </Card>

        <Card title="Sauvegardes & plan de reprise d'activité">
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              Dernière sauvegarde
              <span className="font-medium text-stf-navy">14/07/2026 — 02:00</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              Fréquence
              <span className="font-medium text-stf-navy">Quotidienne</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              Plan de reprise d&apos;activité
              <Badge tone="green">Documenté</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
