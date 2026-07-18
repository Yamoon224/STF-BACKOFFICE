"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import {
  activateUserAction,
  inviteUserAction,
  suspendUserAction,
  updateUserAction,
  validateMentorAction,
} from "@/lib/actions/admin";
import { roleLabel, statusLabel } from "@/lib/format";
import type { AdminUser } from "@/lib/types";

const statusTone = {
  active: "green",
  pending: "orange",
  suspended: "red",
} as const;

const roleOptions = [
  { label: "Administratrice STF", value: "admin" },
  { label: "Collaboratrice STF", value: "staff" },
  { label: "Mentore", value: "mentor" },
  { label: "Mentée", value: "mentee" },
  { label: "Bailleur / partenaire", value: "donor" },
];

export function UtilisatricesClient({
  users,
  currentRole,
  roleFilters,
}: {
  users: AdminUser[];
  currentRole: string | null;
  roleFilters: { label: string; value: string | null }[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [pending, startTransition] = useTransition();

  function handleInvite(formData: FormData) {
    startTransition(async () => {
      await inviteUserAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateUserAction(editing.id, formData);
      setEditing(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gestion des comptes, validation des mentores, rôles et permissions.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Inviter une collaboratrice
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {roleFilters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/utilisatrices?role=${f.value}` : "/utilisatrices"}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              currentRole === f.value
                ? "bg-stf-blue text-white"
                : "border border-slate-200 bg-white text-slate-500 dark:border-border-default dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Nom</th>
                <th className="py-3">Rôle</th>
                <th className="py-3">Pays</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{u.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{roleLabel(u.roles[0]?.name ?? "—")}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{u.country ?? "—"}</td>
                  <td className="py-4">
                    <Badge tone={statusTone[u.status] ?? "neutral"}>{statusLabel(u.status)}</Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {u.status === "pending" && u.mentor_profile ? (
                        <form action={validateMentorAction.bind(null, u.id)}>
                          <button
                            disabled={pending}
                            className="rounded-full bg-stf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-stf-green/90 disabled:opacity-50"
                          >
                            Valider
                          </button>
                        </form>
                      ) : u.status === "suspended" ? (
                        <form action={activateUserAction.bind(null, u.id)}>
                          <button
                            disabled={pending}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
                          >
                            Réactiver
                          </button>
                        </form>
                      ) : null}
                      {u.status !== "suspended" ? (
                        <form action={suspendUserAction.bind(null, u.id)}>
                          <button
                            disabled={pending}
                            className="rounded-full border border-stf-red/30 px-3 py-1.5 text-xs font-semibold text-stf-red hover:bg-stf-red-light disabled:opacity-50 dark:hover:bg-stf-red/15"
                          >
                            Suspendre
                          </button>
                        </form>
                      ) : null}
                      <button
                        onClick={() => setEditing(u)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Inviter une collaboratrice"
        description="Le compte est créé immédiatement avec le rôle Collaboratrice STF."
      >
        <form action={handleInvite} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prénom">
              <input required name="firstName" className={fieldInputClass} />
            </Field>
            <Field label="Nom">
              <input required name="lastName" className={fieldInputClass} />
            </Field>
          </div>
          <Field label="Email professionnel">
            <input type="email" required name="email" placeholder="vous@stf-organisation.org" className={fieldInputClass} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
            >
              Créer le compte
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Modifier l'utilisatrice"
        description="Informations de profil et rôle RBAC."
      >
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <Field label="Nom">
              <input required name="name" defaultValue={editing.name} className={fieldInputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Pays">
                <input name="country" defaultValue={editing.country ?? ""} className={fieldInputClass} />
              </Field>
              <Field label="Téléphone">
                <input name="phone" defaultValue={editing.phone ?? ""} className={fieldInputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Langue">
                <select name="locale" defaultValue={editing.locale} className={fieldInputClass}>
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                </select>
              </Field>
              <Field label="Rôle">
                <select name="role" defaultValue={editing.roles[0]?.name ?? ""} className={fieldInputClass}>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
