import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import { statusLabel } from "@/lib/format";
import type { MentorshipPairing } from "@/lib/types";

export default async function BinomesPage() {
  const { data: pairings } = await apiFetch<{ data: MentorshipPairing[] }>("/pairings");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Suivi des binômes, des sessions et des alertes d&apos;inactivité.
      </p>

      <Card title="Binômes">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Mentée</th>
                <th className="py-3">Mentore</th>
                <th className="py-3">Programme</th>
                <th className="py-3">Sessions réalisées</th>
                <th className="py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pairings.map((p) => (
                <tr key={p.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{p.mentee.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{p.mentor?.name ?? "—"}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{p.program.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{p.sessions_realisees_count ?? 0}</td>
                  <td className="py-4">
                    <Badge tone={p.status === "actif" ? "green" : "orange"}>{statusLabel(p.status)}</Badge>
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
