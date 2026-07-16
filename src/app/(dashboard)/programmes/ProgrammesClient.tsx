"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { createProgramAction } from "@/lib/actions/admin";
import { formatDate, statusLabel } from "@/lib/format";
import type { Program } from "@/lib/types";

const statuses = [
  { label: "À venir", value: "a_venir" },
  { label: "En cours", value: "en_cours" },
];

export function ProgrammesClient({ programs }: { programs: Program[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createProgramAction(formData);
      setOpen(false);
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
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Nouveau programme
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {programs.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-stf-navy dark:text-white">{p.name}</h2>
              <Badge tone={p.status === "en_cours" ? "green" : "orange"}>{statusLabel(p.status)}</Badge>
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
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau programme">
        <form action={handleCreate} className="space-y-5">
          <Field label="Nom du programme">
            <input required name="name" placeholder="Ex. Leadership jeunes femmes" className={fieldInputClass} />
          </Field>
          <Field label="Statut">
            <select name="status" defaultValue={statuses[0].value} className={fieldInputClass}>
              {statuses.map((s) => (
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
    </div>
  );
}
