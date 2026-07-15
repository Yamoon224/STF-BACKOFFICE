import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { kpis, pendingMentors, recentAlerts, activityByProgram } from "@/lib/mock-data";

const severityTone = {
  high: "red",
  medium: "orange",
  low: "neutral",
} as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} trend={kpi.trend} />
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
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Programme</th>
                  <th className="pb-3">Mentées</th>
                  <th className="pb-3">Sessions</th>
                  <th className="pb-3">Rétention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activityByProgram.map((row) => (
                  <tr key={row.program}>
                    <td className="py-3 font-medium text-stf-navy">{row.program}</td>
                    <td className="py-3 text-slate-500">{row.mentees.toLocaleString("fr-FR")}</td>
                    <td className="py-3 text-slate-500">{row.sessions.toLocaleString("fr-FR")}</td>
                    <td className="py-3 text-slate-500">{row.retention}%</td>
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
            {recentAlerts.map((alert) => (
              <div key={alert.detail} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <Badge tone={severityTone[alert.severity as keyof typeof severityTone]}>
                    {alert.type}
                  </Badge>
                  <span className="text-xs text-slate-400">{alert.time}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{alert.detail}</p>
              </div>
            ))}
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
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3">Nom</th>
                <th className="pb-3">Expertise</th>
                <th className="pb-3">Pays</th>
                <th className="pb-3">Soumis le</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingMentors.map((m) => (
                <tr key={m.name}>
                  <td className="py-3 font-medium text-stf-navy">{m.name}</td>
                  <td className="py-3 text-slate-500">{m.expertise}</td>
                  <td className="py-3 text-slate-500">{m.country}</td>
                  <td className="py-3 text-slate-500">{m.submitted}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="rounded-full bg-stf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-stf-green/90">
                        Valider
                      </button>
                      <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
                        Examiner
                      </button>
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
