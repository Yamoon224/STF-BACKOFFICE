import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import { validateMentorAction } from "@/lib/actions/admin";
import type { ActivityByProgram, AdminUser, Alerts, Kpis } from "@/lib/types";

export default async function DashboardPage() {
  const [kpisData, alerts, activityByProgram, pendingMentorsRes] = await Promise.all([
    apiFetch<Kpis>("/dashboard/kpis"),
    apiFetch<Alerts>("/dashboard/alerts"),
    apiFetch<ActivityByProgram[]>("/dashboard/activity-by-program"),
    apiFetch<{ data: AdminUser[] }>("/users?role=mentor&status=pending"),
  ]);

  const kpis = [
    { label: "Mentées actives", value: kpisData.active_mentees.toLocaleString("fr-FR") },
    { label: "Mentores validées", value: kpisData.validated_mentors.toLocaleString("fr-FR") },
    { label: "Binômes actifs", value: kpisData.active_pairings.toLocaleString("fr-FR") },
    { label: "Sessions ce mois", value: kpisData.sessions_this_month.toLocaleString("fr-FR") },
  ];

  const alertItems = [
    alerts.pending_mentors > 0
      ? { type: "Validation", detail: `${alerts.pending_mentors} mentore(s) en attente de validation`, severity: "low" as const }
      : null,
    alerts.open_reports > 0
      ? { type: "Signalement", detail: `${alerts.open_reports} signalement(s) non résolu(s)`, severity: "high" as const }
      : null,
    alerts.inactive_pairings > 0
      ? { type: "Inactivité", detail: `${alerts.inactive_pairings} binôme(s) sans session depuis 30 jours`, severity: "medium" as const }
      : null,
  ].filter((a): a is NonNullable<typeof a> => a !== null);

  const severityTone = { high: "red", medium: "orange", low: "neutral" } as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Activité par programme"
          className="lg:col-span-2"
          action={
            <Link href="/reporting" className="text-sm font-semibold text-stf-blue">
              Voir le reporting
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <th className="pb-3">Programme</th>
                  <th className="pb-3">Mentées</th>
                  <th className="pb-3">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
                {activityByProgram.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 font-medium text-stf-navy dark:text-white">{row.name}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{row.mentees_count.toLocaleString("fr-FR")}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{row.sessions_count.toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Alertes récentes"
          action={
            <Link href="/signalements" className="text-sm font-semibold text-stf-blue">
              Tout voir
            </Link>
          }
        >
          <div className="space-y-3">
            {alertItems.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Aucune alerte active.</p>
            ) : (
              alertItems.map((alert) => (
                <div key={alert.type} className="rounded-xl border border-slate-100 p-3 dark:border-border-subtle">
                  <Badge tone={severityTone[alert.severity]}>{alert.type}</Badge>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{alert.detail}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card
        title="Mentores en attente de validation"
        action={
          <Link href="/utilisatrices" className="text-sm font-semibold text-stf-blue">
            Gérer les utilisatrices
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                <th className="pb-3">Nom</th>
                <th className="pb-3">Expertise</th>
                <th className="pb-3">Pays</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pendingMentorsRes.data.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 font-medium text-stf-navy dark:text-white">{m.name}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{m.mentor_profile?.expertise ?? "—"}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{m.country ?? "—"}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <form action={validateMentorAction.bind(null, m.id)}>
                        <button className="rounded-full bg-stf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-stf-green/90">
                          Valider
                        </button>
                      </form>
                      <Link
                        href="/utilisatrices"
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        Examiner
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
