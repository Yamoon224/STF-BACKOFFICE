import type { ReactNode } from "react";

export const fieldInputClass =
  "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-stf-navy dark:text-white">{label}</label>
      {children}
    </div>
  );
}
