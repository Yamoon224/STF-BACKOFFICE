import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api";
import type { ActivityByProgram } from "@/lib/types";

const filters = ["Période", "Programme", "Cohorte", "Pays", "Niveau", "Statut"];

const plannedExports = [
  { name: "Rapport trimestriel", program: "Tous programmes", format: "PDF" },
  { name: "Export utilisatrices actives", program: "Tous programmes", format: "CSV" },
  { name: "Indicateurs bailleur", program: "Tous programmes", format: "PDF" },
];

export default async function ReportingPage() {
  const activityByProgram = await apiFetch<ActivityByProgram[]>("/dashboard/activity-by-program");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Tableaux de bord filtrables et exports CSV / PDF pour les équipes STF et les partenaires autorisés.
      </p>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <span
            key={f}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 dark:border-border-default dark:bg-white/5 dark:text-slate-300"
          >
            {f} ▾
          </span>
        ))}
      </div>

      <Card title="Indicateurs par programme">
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

      <Card title="Exports disponibles">
        <div className="space-y-3">
          {plannedExports.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-border-subtle"
            >
              <div>
                <p className="text-sm font-semibold text-stf-navy dark:text-white">{r.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{r.program}</p>
              </div>
              <button
                disabled
                title="Génération de fichiers à venir"
                className="cursor-not-allowed rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-400 dark:border-border-default dark:text-slate-500"
              >
                Exporter {r.format}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
