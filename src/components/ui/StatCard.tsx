export function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border-default dark:bg-surface">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-stf-navy dark:text-white">{value}</p>
      {trend ? <p className="mt-1 text-xs text-stf-green dark:text-green-400">{trend}</p> : null}
    </div>
  );
}
