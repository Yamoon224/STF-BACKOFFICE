import { apiFetch } from "@/lib/api";
import type { AuditLog, Paginated } from "@/lib/types";
import { AuditLogsClient } from "./AuditLogsClient";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const logs = await apiFetch<Paginated<AuditLog>>(`/audit-logs${page ? `?page=${page}` : ""}`);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Journalisation des actions sensibles : connexion, consultation, validation, suspension, suppression, signalement.
      </p>

      <AuditLogsClient
        logs={logs.data}
        pagination={{
          currentPage: logs.current_page,
          lastPage: logs.last_page,
          total: logs.total,
          perPage: logs.per_page,
        }}
      />
    </div>
  );
}
