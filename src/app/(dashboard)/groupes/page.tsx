"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { groups as initialGroups } from "@/lib/mock-data";

const groupTypes = ["Automatique", "Travail", "Mentorat"];

export default function GroupesPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState(groupTypes[1]);
  const [members, setMembers] = useState("0");

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    setGroups((prev) => [
      { name: name.trim(), type, members: Number(members) || 0, status: "En validation" },
      ...prev,
    ]);
    setName("");
    setType(groupTypes[1]);
    setMembers("0");
    setOpen(false);
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
                <tr key={g.name}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{g.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{g.type}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{g.members}</td>
                  <td className="py-4">
                    <Badge tone={g.status === "Actif" ? "green" : "orange"}>{g.status}</Badge>
                  </td>
                  <td className="py-4">
                    <button className="text-sm font-semibold text-stf-blue hover:text-stf-orange">
                      Gérer
                    </button>
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
        <form onSubmit={handleCreate} className="space-y-5">
          <Field label="Nom du groupe">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Atelier Robotique — Projet pilote"
              className={fieldInputClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value)} className={fieldInputClass}>
                {groupTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Membres initiaux">
              <input
                type="number"
                min={0}
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className={fieldInputClass}
              />
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
              Créer le groupe
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
