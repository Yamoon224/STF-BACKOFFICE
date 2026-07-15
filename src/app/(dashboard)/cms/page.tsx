import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cmsPages } from "@/lib/mock-data";

export default function CmsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">
          Gestion des pages, actualités, médias et documents du site public.
        </p>
        <button className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90">
          + Nouveau contenu
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3">Titre</th>
                <th className="py-3">Type</th>
                <th className="py-3">Mis à jour</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cmsPages.map((c) => (
                <tr key={c.title}>
                  <td className="py-4 font-medium text-stf-navy">{c.title}</td>
                  <td className="py-4 text-slate-500">{c.type}</td>
                  <td className="py-4 text-slate-500">{c.updated}</td>
                  <td className="py-4">
                    <Badge tone={c.status === "Publié" ? "green" : "neutral"}>{c.status}</Badge>
                  </td>
                  <td className="py-4">
                    <button className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
                      Modifier
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
