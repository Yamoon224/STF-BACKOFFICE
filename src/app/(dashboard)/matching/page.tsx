import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { matchingSuggestions } from "@/lib/mock-data";

export default function MatchingPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 max-w-2xl">
        Le matching automatique propose des binômes selon le domaine d&apos;intérêt, la langue, le niveau, les objectifs, la disponibilité et la capacité maximale de la mentore. Chaque proposition reste contrôlable par STF.
      </p>

      <Card title="Propositions de matching">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3">Mentée</th>
                <th className="py-3">Niveau</th>
                <th className="py-3">Intérêt</th>
                <th className="py-3">Mentore suggérée</th>
                <th className="py-3">Score</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matchingSuggestions.map((m) => (
                <tr key={m.mentee}>
                  <td className="py-4 font-medium text-stf-navy">{m.mentee}</td>
                  <td className="py-4 text-slate-500">{m.level}</td>
                  <td className="py-4 text-slate-500">{m.interest}</td>
                  <td className="py-4 text-slate-500">{m.suggestedMentor}</td>
                  <td className="py-4">
                    <Badge tone={m.score >= 90 ? "green" : m.score >= 85 ? "blue" : "orange"}>
                      {m.score}%
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-full bg-stf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-stf-green/90">
                        Confirmer
                      </button>
                      <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
                        Modifier
                      </button>
                      <button className="rounded-full border border-stf-red/30 px-3 py-1.5 text-xs font-semibold text-stf-red hover:bg-stf-red-light">
                        Remplacer
                      </button>
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
