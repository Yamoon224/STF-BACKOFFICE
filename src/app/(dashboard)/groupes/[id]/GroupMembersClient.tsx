"use client";

import { useTransition } from "react";
import { addGroupMemberAction, removeGroupMemberAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { PlusIcon, TrashIcon } from "@/components/ui/Icons";
import type { AdminUser, GroupDetail } from "@/lib/types";

export function GroupMembersClient({ group, allUsers }: { group: GroupDetail; allUsers: AdminUser[] }) {
  const [pending, startTransition] = useTransition();
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(group.members);

  const memberIds = new Set(group.members.map((m) => m.id));
  const candidates = allUsers.filter((u) => !memberIds.has(u.id));

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await addGroupMemberAction(group.id, formData);
    });
  }

  function handleRemove(userId: number) {
    if (!confirm("Retirer cette membre du groupe ?")) return;
    startTransition(async () => {
      await removeGroupMemberAction(group.id, userId);
    });
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-2">
        {pageItems.length === 0 ? (
          <li className="text-sm text-slate-400 dark:text-slate-500">Aucune membre pour le moment.</li>
        ) : (
          pageItems.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-sm dark:border-border-subtle"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-stf-navy dark:text-white">{m.name}</p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                  {m.pivot.role_in_group === "animatrice" ? "Animatrice" : "Membre"} · depuis {formatDate(m.pivot.joined_at)}
                </p>
              </div>
              <button
                disabled={pending}
                onClick={() => handleRemove(m.id)}
                className="flex shrink-0 items-center gap-1 text-xs font-semibold text-stf-red hover:text-stf-orange disabled:opacity-50"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Retirer
              </button>
            </li>
          ))
        )}
      </ul>
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />

      <form action={handleAdd} className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-border-subtle sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-semibold text-stf-navy dark:text-white">Ajouter une membre</label>
          <select
            required
            name="user_id"
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white"
          >
            <option value="" disabled>
              Choisir une utilisatrice
            </option>
            {candidates.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-stf-navy dark:text-white">Rôle</label>
          <select
            name="role_in_group"
            defaultValue="membre"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-stf-blue dark:border-border-default dark:bg-white/5 dark:text-white"
          >
            <option value="membre">Membre</option>
            <option value="animatrice">Animatrice</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-full bg-stf-orange px-5 py-3 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter
        </button>
      </form>
    </div>
  );
}
