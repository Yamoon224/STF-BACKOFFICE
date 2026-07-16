import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import { updateReportStatusAction } from "@/lib/actions/admin";
import { formatDateTime, statusLabel } from "@/lib/format";
import type { Report } from "@/lib/types";

export default async function SignalementsPage() {
  const reports = await apiFetch<Report[]>("/reports");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Traitement des signalements et modération des contenus, avec historique et procédure d&apos;escalade.
      </p>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">ID</th>
                <th className="py-3">Contexte</th>
                <th className="py-3">Signalé par</th>
                <th className="py-3">Date</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {reports.map((s) => (
                <tr key={s.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">#{s.id}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">
                    {s.context_type}
                    {s.context_id ? ` #${s.context_id}` : ""}
                  </td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{s.reporter.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{formatDateTime(s.created_at)}</td>
                  <td className="py-4">
                    <Badge tone={s.status === "resolu" ? "green" : s.status === "en_cours" ? "orange" : "red"}>
                      {statusLabel(s.status)}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {s.status === "nouveau" ? (
                        <form action={updateReportStatusAction.bind(null, s.id, "en_cours")}>
                          <button className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
                            Examiner
                          </button>
                        </form>
                      ) : null}
                      {s.status !== "resolu" ? (
                        <form action={updateReportStatusAction.bind(null, s.id, "resolu")}>
                          <button className="text-sm font-semibold text-stf-green hover:text-stf-orange">
                            Résoudre
                          </button>
                        </form>
                      ) : null}
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
