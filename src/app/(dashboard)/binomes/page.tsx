import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { pairings } from "@/lib/mock-data";

export default function BinomesPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Suivi des binômes, des sessions et des alertes d&apos;inactivité.
      </p>

      <Card title="Binômes actifs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3">Mentée</th>
                <th className="py-3">Mentore</th>
                <th className="py-3">Programme</th>
                <th className="py-3">Sessions réalisées</th>
                <th className="py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pairings.map((p) => (
                <tr key={p.mentee}>
                  <td className="py-4 font-medium text-stf-navy">{p.mentee}</td>
                  <td className="py-4 text-slate-500">{p.mentor}</td>
                  <td className="py-4 text-slate-500">{p.program}</td>
                  <td className="py-4 text-slate-500">{p.sessions}</td>
                  <td className="py-4">
                    <Badge tone={p.status === "Actif" ? "green" : "orange"}>{p.status}</Badge>
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
