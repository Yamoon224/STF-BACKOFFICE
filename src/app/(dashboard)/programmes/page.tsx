"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { programs as initialPrograms } from "@/lib/mock-data";

const statuses = ["À venir", "En cours"];

export default function ProgrammesPage() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cycle, setCycle] = useState("");
  const [cohorts, setCohorts] = useState("1");
  const [status, setStatus] = useState(statuses[0]);

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    setPrograms((prev) => [
      { name: name.trim(), cohorts: Number(cohorts) || 0, mentees: 0, cycle: cycle.trim(), status },
      ...prev,
    ]);
    setName("");
    setCycle("");
    setCohorts("1");
    setStatus(statuses[0]);
    setOpen(false);
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
          <Card key={p.name}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-stf-navy dark:text-white">{p.name}</h2>
              <Badge tone={p.status === "En cours" ? "green" : "orange"}>{p.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Cycle : {p.cycle}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Cohortes</p>
                <p className="mt-1 font-semibold text-stf-navy dark:text-white">{p.cohorts}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Mentées</p>
                <p className="mt-1 font-semibold text-stf-navy dark:text-white">{p.mentees.toLocaleString("fr-FR")}</p>
              </div>
            </div>
            <button className="mt-5 w-full rounded-full border border-stf-blue px-4 py-2.5 text-sm font-semibold text-stf-blue hover:bg-stf-blue-light dark:hover:bg-stf-blue/15">
              Gérer les cohortes
            </button>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau programme">
        <form onSubmit={handleCreate} className="space-y-5">
          <Field label="Nom du programme">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Leadership jeunes femmes"
              className={fieldInputClass}
            />
          </Field>
          <Field label="Cycle">
            <input
              required
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              placeholder="Ex. Jan – Déc 2026"
              className={fieldInputClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cohortes initiales">
              <input
                type="number"
                min={0}
                value={cohorts}
                onChange={(e) => setCohorts(e.target.value)}
                className={fieldInputClass}
              />
            </Field>
            <Field label="Statut">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldInputClass}>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
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
              className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
            >
              Créer le programme
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
