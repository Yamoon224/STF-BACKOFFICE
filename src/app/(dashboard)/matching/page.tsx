import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import { confirmMatchAction } from "@/lib/actions/admin";
import type { MatchingSuggestion } from "@/lib/types";

export default async function MatchingPage() {
  const suggestions = await apiFetch<MatchingSuggestion[]>("/matching/suggestions");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 max-w-2xl dark:text-slate-400">
        Le matching automatique propose des binômes selon le domaine d&apos;intérêt, la langue, le niveau, les objectifs, la disponibilité et la capacité maximale de la mentore. Chaque proposition reste contrôlable par STF.
      </p>

      <Card title="Propositions de matching">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Mentée</th>
                <th className="py-3">Programme</th>
                <th className="py-3">Mentore suggérée</th>
                <th className="py-3">Score</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {suggestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucune mentée en attente de matching pour le moment.
                  </td>
                </tr>
              ) : (
                suggestions.map((m) => (
                  <tr key={m.pairing_id}>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">{m.mentee.name}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{m.program.name}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{m.suggested_mentor?.name ?? "—"}</td>
                    <td className="py-4">
                      {m.score !== null ? (
                        <Badge tone={m.score >= 90 ? "green" : m.score >= 85 ? "blue" : "orange"}>{m.score}%</Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4">
                      {m.suggested_mentor ? (
                        <form action={confirmMatchAction.bind(null, m.pairing_id, m.suggested_mentor.id)}>
                          <button className="rounded-full bg-stf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-stf-green/90">
                            Confirmer
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">Aucune mentore disponible</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
