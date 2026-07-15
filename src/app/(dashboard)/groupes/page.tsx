import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { groups } from "@/lib/mock-data";

export default function GroupesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Groupes automatiques, de travail et de mentorat collectif. Fermés par défaut, soumis à validation STF.
        </p>
        <button className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90">
          + Créer un groupe
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Groupe</th>
                <th className="py-3">Type</th>
                <th className="py-3">Membres</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {groups.map((g) => (
                <tr key={g.name}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{g.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{g.type}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{g.members}</td>
                  <td className="py-4">
                    <Badge tone={g.status === "Actif" ? "green" : "orange"}>{g.status}</Badge>
                  </td>
                  <td className="py-4">
                    <button className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
                      Gérer
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
