import { Card } from "@/components/ui/Card";
import { auditLogs } from "@/lib/mock-data";

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Journalisation des actions sensibles : connexion, consultation, validation, suspension, suppression, signalement.
      </p>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Horodatage</th>
                <th className="py-3">Actrice</th>
                <th className="py-3">Action</th>
                <th className="py-3">Cible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {auditLogs.map((log, i) => (
                <tr key={i}>
                  <td className="py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{log.time}</td>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{log.actor}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{log.action}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
