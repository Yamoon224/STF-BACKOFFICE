"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import { users as initialUsers } from "@/lib/mock-data";

const statusTone = {
  Active: "green",
  Validée: "green",
  "En attente": "orange",
  Suspendue: "red",
} as const;

const roleFilters = ["Toutes", "Mentées", "Mentores", "Collaboratrices STF", "Bailleurs"];

export default function UtilisatricesPage() {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");

  function handleInvite(event: FormEvent) {
    event.preventDefault();
    setUsers((prev) => [
      {
        name: `${firstName} ${lastName}`.trim(),
        role: "Collaboratrice STF",
        status: "En attente",
        program: program.trim() || "—",
        country: "—",
      },
      ...prev,
    ]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setProgram("");
    setOpen(false);
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
        {roleFilters.map((f, i) => (
          <span
            key={f}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              i === 0
                ? "bg-stf-blue text-white"
                : "border border-slate-200 bg-white text-slate-500 dark:border-border-default dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Nom</th>
                <th className="py-3">Rôle</th>
                <th className="py-3">Programme</th>
                <th className="py-3">Pays</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {users.map((u) => (
                <tr key={u.name}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{u.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{u.role}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{u.program}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{u.country}</td>
                  <td className="py-4">
                    <Badge tone={statusTone[u.status as keyof typeof statusTone] ?? "neutral"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {u.status === "En attente" ? (
                        <button className="rounded-full bg-stf-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-stf-green/90">
                          Valider
                        </button>
                      ) : (
                        <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5">
                          Modifier
                        </button>
                      )}
                      <button className="rounded-full border border-stf-red/30 px-3 py-1.5 text-xs font-semibold text-stf-red hover:bg-stf-red-light dark:hover:bg-stf-red/15">
                        Suspendre
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
        description="Un email d'invitation sera envoyé pour finaliser la création du compte."
      >
        <form onSubmit={handleInvite} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prénom">
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldInputClass}
              />
            </Field>
            <Field label="Nom">
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldInputClass}
              />
            </Field>
          </div>
          <Field label="Email professionnel">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@stf-organisation.org"
              className={fieldInputClass}
            />
          </Field>
          <Field label="Programme (optionnel)">
            <input
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Ex. Mentorat STIM"
              className={fieldInputClass}
            />
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
              className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
            >
              Envoyer l&apos;invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
