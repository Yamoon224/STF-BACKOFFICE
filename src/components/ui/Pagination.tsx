"use client";

import { useMemo, useState } from "react";

export const PAGE_SIZE = 10;

/** Client-side pagination over an already-fetched list, DataTables-style (10/page). */
export function usePagination<T>(items: T[], pageSize: number = PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  // Clamped for rendering: if the list shrinks (e.g. after a delete) this
  // immediately reflects a valid page without a redundant effect + re-render.
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  return { page: safePage, setPage, totalPages, pageItems, total: items.length, pageSize };
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1
  );

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-1 pt-4 text-sm sm:flex-row dark:border-border-subtle">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {from}–{to} sur {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
        >
          Précédent
        </button>
        {pageNumbers.map((n, i) => (
          <span key={n} className="flex items-center">
            {i > 0 && pageNumbers[i - 1] !== n - 1 ? <span className="px-1 text-slate-300 dark:text-slate-600">…</span> : null}
            <button
              type="button"
              onClick={() => onChange(n)}
              className={`h-8 w-8 rounded-full text-xs font-semibold ${
                n === page
                  ? "bg-stf-blue text-white"
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              }`}
            >
              {n}
            </button>
          </span>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
