"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { createGroupAction, deleteGroupAction, updateGroupAction } from "@/lib/actions/admin";
import { statusLabel } from "@/lib/format";
import type { Group } from "@/lib/types";

const groupTypes = [
  { label: "Automatique", value: "automatique" },
  { label: "Travail", value: "travail" },
  { label: "Mentorat", value: "mentorat" },
];

const groupStatuses = [
  { label: "En validation", value: "en_validation" },
  { label: "Actif", value: "actif" },
  { label: "Archivé", value: "archive" },
];

export function GroupesClient({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createGroupAction(formData);
      setOpen(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      await updateGroupAction(editing.id, formData);
      setEditing(null);
    });
  }

  function handleDelete(groupId: number) {
    if (!confirm("Supprimer ce groupe ?")) return;
    startTransition(async () => {
      await deleteGroupAction(groupId);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Groupes automatiques, de travail et de mentorat collectif. Fermés par défaut, soumis à validation STF.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Créer un groupe
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Groupe</th>
                <th className="py-3">Type</th>
                <th className="py-3">Membres</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {groups.map((g) => (
                <tr key={g.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{g.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{statusLabel(g.type)}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{g.members_count ?? 0}</td>
                  <td className="py-4">
                    <Badge tone={g.status === "actif" ? "green" : g.status === "archive" ? "neutral" : "orange"}>
                      {statusLabel(g.status)}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/groupes/${g.id}`} className="text-xs font-semibold text-stf-blue hover:text-stf-orange">
                        Gérer les membres
                      </Link>
                      <button
                        onClick={() => setEditing(g)}
                        className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="text-xs font-semibold text-stf-red hover:text-stf-orange"
                      >
                        Supprimer
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
        title="Créer un groupe"
        description="Le groupe sera créé fermé, en attente de validation STF."
      >
        <form action={handleCreate} className="space-y-5">
          <Field label="Nom du groupe">
            <input required name="name" placeholder="Ex. Atelier Robotique — Projet pilote" className={fieldInputClass} />
          </Field>
          <Field label="Type">
            <select name="type" defaultValue={groupTypes[1].value} className={fieldInputClass}>
              {groupTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
              Créer le groupe
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Modifier le groupe">
        {editing ? (
          <form action={handleUpdate} className="space-y-5">
            <Field label="Nom du groupe">
              <input required name="name" defaultValue={editing.name} className={fieldInputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Type">
                <select name="type" defaultValue={editing.type} className={fieldInputClass}>
                  {groupTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Statut">
                <select name="status" defaultValue={editing.status} className={fieldInputClass}>
                  {groupStatuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
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
