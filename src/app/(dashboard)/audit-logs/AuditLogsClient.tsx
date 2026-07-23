"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { formatDateTime } from "@/lib/format";
import type { AuditLog } from "@/lib/types";

export function AuditLogsClient({
  logs,
  pagination,
}: {
  logs: AuditLog[];
  pagination: { currentPage: number; lastPage: number; total: number; perPage: number };
}) {
  const router = useRouter();

  return (
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
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {formatDateTime(log.created_at)}
                </td>
                <td className="py-4 font-medium text-stf-navy dark:text-white">{log.actor?.name ?? "Système"}</td>
                <td className="py-4 text-slate-500 dark:text-slate-400">{log.action}</td>
                <td className="py-4 text-slate-500 dark:text-slate-400">
                  {log.target_type ? `${log.target_type} #${log.target_id}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={pagination.currentPage}
        totalPages={pagination.lastPage}
        total={pagination.total}
        pageSize={pagination.perPage}
        onChange={(page) => router.push(`/audit-logs?page=${page}`)}
      />
    </Card>
  );
}
