"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import {
  createCohortAction,
  createProgramAction,
  deleteCohortAction,
  deleteProgramAction,
  updateCohortAction,
  updateProgramAction,
} from "@/lib/actions/admin";
import { formatDate, statusLabel } from "@/lib/format";
import type { Cohort, Program } from "@/lib/types";

const programStatuses = [
  { label: "À venir", value: "a_venir" },
  { label: "En cours", value: "en_cours" },
  { label: "Archivé", value: "archive" },
];

const cohortStatuses = [
  { label: "À venir", value: "a_venir" },
  { label: "En cours", value: "en_cours" },
  { label: "Terminée", value: "termine" },
];

export function ProgrammesClient({
  programs,
  cohortsByProgram,
}: {
  programs: Program[];
  cohortsByProgram: Record<number, Cohort[]>;
}) {
  const [open, setOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [cohortModal, setCohortModal] = useState<{ programId: number; cohort: Cohort | null } | null>(null);
  const [pending, startTransition] = useTransition();
  const { pageItems, page, setPage, totalPages, total, pageSize } = usePagination(programs);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createProgramAction(formData);
      setOpen(false);
    });
  }

  function handleUpdateProgram(formData: FormData) {
    if (!editingProgram) return;
    startTransition(async () => {
      await updateProgramAction(editingProgram.id, formData);
      setEditingProgram(null);
    });
  }

  function handleDeleteProgram(programId: number) {
    if (!confirm("Supprimer ce programme ? Cette action est irréversible.")) return;
    startTransition(async () => {
      await deleteProgramAction(programId);
    });
  }

  function handleCohortSubmit(formData: FormData) {
    if (!cohortModal) return;
    startTransition(async () => {
      if (cohortModal.cohort) {
        await updateCohortAction(cohortModal.cohort.id, formData);
      } else {
        await createCohortAction(cohortModal.programId, formData);
      }
      setCohortModal(null);
    });
  }

  function handleDeleteCohort(cohortId: number) {
    if (!confirm("Supprimer cette cohorte ?")) return;
    startTransition(async () => {
      await deleteCohortAction(cohortId);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Programmes, cycles, cohortes et affectations.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          <PlusIcon className="h-4 w-4" />
          Nouveau programme
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {pageItems.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-stf-navy dark:text-white">{p.name}</h2>
              <Badge tone={p.status === "en_cours" ? "green" : p.status === "archive" ? "neutral" : "orange"}>
                {statusLabel(p.status)}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Cycle : {formatDate(p.cycle_start)} – {formatDate(p.cycle_end)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Cohortes</p>
                <p className="mt-1 font-semibold text-stf-navy dark:text-white">{p.cohorts_count ?? 0}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Mentées</p>
                <p className="mt-1 font-semibold text-stf-navy dark:text-white">
                  {(p.mentees_count ?? 0).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingProgram(p)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteProgram(p.id)}
                className="flex items-center gap-1.5 rounded-full border border-stf-red/30 px-3 py-1.5 text-xs font-semibold text-stf-red hover:bg-stf-red-light disabled:opacity-50 dark:hover:bg-stf-red/15"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Supprimer
              </button>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-border-subtle">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Cohortes</p>
                <button
                  onClick={() => setCohortModal({ programId: p.id, cohort: null })}
                  className="flex items-center gap-1 text-xs font-semibold text-stf-blue hover:text-stf-orange"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Ajouter une cohorte
                </button>
              </div>
              <ul className="mt-2 space-y-2">
                {(cohortsByProgram[p.id] ?? []).length === 0 ? (
                  <li className="text-xs text-slate-400 dark:text-slate-500">Aucune cohorte pour ce programme.</li>
                ) : (
                  (cohortsByProgram[p.id] ?? []).map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-border-subtle"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stf-navy dark:text-white">{c.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {formatDate(c.start_date)} – {formatDate(c.end_date)} · {statusLabel(c.status)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-3">
                        <button
                          onClick={() => setCohortModal({ programId: p.id, cohort: c })}
                          className="flex items-center gap-1 text-xs font-semibold text-stf-blue hover:text-stf-orange"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteCohort(c.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-stf-red hover:text-stf-orange"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau programme">
        <form action={handleCreate} className="space-y-5">
          <Field label="Nom du programme">
            <input required name="name" placeholder="Ex. Leadership jeunes femmes" className={fieldInputClass} />
          </Field>
          <Field label="Statut">
            <select name="status" defaultValue={programStatuses[0].value} className={fieldInputClass}>
              {programStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
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
              Créer le programme
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editingProgram !== null}
        onClose={() => setEditingProgram(null)}
        title="Modifier le programme"
      >
        {editingProgram ? (
          <form action={handleUpdateProgram} className="space-y-5">
            <Field label="Nom du programme">
              <input required name="name" defaultValue={editingProgram.name} className={fieldInputClass} />
            </Field>
            <Field label="Public visé">
              <input name="audience" defaultValue={editingProgram.audience ?? ""} className={fieldInputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Début de cycle">
                <input
                  type="date"
                  name="cycle_start"
                  defaultValue={editingProgram.cycle_start ?? ""}
                  className={fieldInputClass}
                />
              </Field>
              <Field label="Fin de cycle">
                <input
                  type="date"
                  name="cycle_end"
                  defaultValue={editingProgram.cycle_end ?? ""}
                  className={fieldInputClass}
                />
              </Field>
            </div>
            <Field label="Statut">
              <select name="status" defaultValue={editingProgram.status} className={fieldInputClass}>
                {programStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingProgram(null)}
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

      <Modal
        open={cohortModal !== null}
        onClose={() => setCohortModal(null)}
        title={cohortModal?.cohort ? "Modifier la cohorte" : "Nouvelle cohorte"}
      >
        {cohortModal ? (
          <form action={handleCohortSubmit} className="space-y-5">
            <Field label="Nom de la cohorte">
              <input required name="name" defaultValue={cohortModal.cohort?.name ?? ""} className={fieldInputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date de début">
                <input
                  type="date"
                  name="start_date"
                  defaultValue={cohortModal.cohort?.start_date ?? ""}
                  className={fieldInputClass}
                />
              </Field>
              <Field label="Date de fin">
                <input
                  type="date"
                  name="end_date"
                  defaultValue={cohortModal.cohort?.end_date ?? ""}
                  className={fieldInputClass}
                />
              </Field>
            </div>
            <Field label="Statut">
              <select name="status" defaultValue={cohortModal.cohort?.status ?? cohortStatuses[0].value} className={fieldInputClass}>
                {cohortStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCohortModal(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                {cohortModal.cohort ? "Enregistrer" : "Créer la cohorte"}
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
