import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { signalements } from "@/lib/mock-data";

export default function SignalementsPage() {
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
              {signalements.map((s) => (
                <tr key={s.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{s.id}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{s.context}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{s.reporter}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{s.date}</td>
                  <td className="py-4">
                    <Badge tone={s.status === "Résolu" ? "green" : "red"}>{s.status}</Badge>
                  </td>
                  <td className="py-4">
                    <button className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
                      Examiner
                    </button>
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
