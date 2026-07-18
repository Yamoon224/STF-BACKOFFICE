"use client";

import { useTransition } from "react";
import { addGroupMemberAction, removeGroupMemberAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import type { AdminUser, GroupDetail } from "@/lib/types";

export function GroupMembersClient({ group, allUsers }: { group: GroupDetail; allUsers: AdminUser[] }) {
  const [pending, startTransition] = useTransition();

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
        {group.members.length === 0 ? (
          <li className="text-sm text-slate-400 dark:text-slate-500">Aucune membre pour le moment.</li>
        ) : (
          group.members.map((m) => (
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
                className="shrink-0 text-xs font-semibold text-stf-red hover:text-stf-orange disabled:opacity-50"
              >
                Retirer
              </button>
            </li>
          ))
        )}
      </ul>

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
          className="rounded-full bg-stf-orange px-5 py-3 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
