import { Card } from "@/components/ui/Card";
import { reports, activityByProgram } from "@/lib/mock-data";

const filters = ["Période", "Programme", "Cohorte", "Pays", "Niveau", "Statut"];

export default function ReportingPage() {
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
                <th className="pb-3">Rétention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {activityByProgram.map((row) => (
                <tr key={row.program}>
                  <td className="py-3 font-medium text-stf-navy dark:text-white">{row.program}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{row.mentees.toLocaleString("fr-FR")}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{row.sessions.toLocaleString("fr-FR")}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{row.retention}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Exports disponibles">
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-border-subtle"
            >
              <div>
                <p className="text-sm font-semibold text-stf-navy dark:text-white">{r.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{r.program}</p>
              </div>
              <button className="rounded-full border border-stf-blue px-4 py-2 text-xs font-semibold text-stf-blue hover:bg-stf-blue-light dark:hover:bg-stf-blue/15">
                Exporter {r.format}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
