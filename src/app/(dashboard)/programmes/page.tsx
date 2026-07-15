import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { programs } from "@/lib/mock-data";

export default function ProgrammesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Programmes, cycles, cohortes et affectations.
        </p>
        <button className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90">
          + Nouveau programme
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {programs.map((p) => (
          <Card key={p.name}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-stf-navy dark:text-white">{p.name}</h2>
              <Badge tone={p.status === "En cours" ? "green" : "orange"}>{p.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Cycle : {p.cycle}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Cohortes</p>
                <p className="mt-1 font-semibold text-stf-navy dark:text-white">{p.cohorts}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Mentées</p>
                <p className="mt-1 font-semibold text-stf-navy dark:text-white">{p.mentees.toLocaleString("fr-FR")}</p>
              </div>
            </div>
            <button className="mt-5 w-full rounded-full border border-stf-blue px-4 py-2.5 text-sm font-semibold text-stf-blue hover:bg-stf-blue-light dark:hover:bg-stf-blue/15">
              Gérer les cohortes
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
