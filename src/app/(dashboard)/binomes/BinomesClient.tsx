"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, fieldInputClass } from "@/components/ui/FormField";
import {
  createPairingAction,
  createSessionAction,
  deletePairingAction,
  deleteSessionAction,
  updatePairingAction,
  updateSessionStatusAction,
} from "@/lib/actions/admin";
import { formatDateTime, statusLabel } from "@/lib/format";
import type { AdminUser, Cohort, MentorshipPairing, MentorshipSession, Program } from "@/lib/types";

const pairingStatuses = [
  { label: "En attente", value: "en_attente" },
  { label: "Actif", value: "actif" },
  { label: "En pause", value: "pause" },
  { label: "Terminé", value: "termine" },
];

export function BinomesClient({
  pairings,
  sessions,
  mentees,
  mentors,
  programs,
  cohorts,
}: {
  pairings: MentorshipPairing[];
  sessions: MentorshipSession[];
  mentees: AdminUser[];
  mentors: AdminUser[];
  programs: Program[];
  cohorts: Cohort[];
}) {
  const [createPairingOpen, setCreatePairingOpen] = useState(false);
  const [editingPairing, setEditingPairing] = useState<MentorshipPairing | null>(null);
  const [sessionModal, setSessionModal] = useState<{ pairingId: number } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCreatePairing(formData: FormData) {
    startTransition(async () => {
      await createPairingAction(formData);
      setCreatePairingOpen(false);
    });
  }

  function handleUpdatePairing(formData: FormData) {
    if (!editingPairing) return;
    startTransition(async () => {
      await updatePairingAction(editingPairing.id, formData);
      setEditingPairing(null);
    });
  }

  function handleDeletePairing(pairingId: number) {
    if (!confirm("Supprimer ce binôme ? Les sessions associées seront également supprimées.")) return;
    startTransition(async () => {
      await deletePairingAction(pairingId);
    });
  }

  function handleCreateSession(formData: FormData) {
    startTransition(async () => {
      await createSessionAction(formData);
      setSessionModal(null);
    });
  }

  function handleSessionStatus(sessionId: number, status: "confirmee" | "realisee" | "annulee") {
    startTransition(async () => {
      await updateSessionStatusAction(sessionId, status);
    });
  }

  function handleDeleteSession(sessionId: number) {
    if (!confirm("Supprimer cette session ?")) return;
    startTransition(async () => {
      await deleteSessionAction(sessionId);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Suivi des binômes, des sessions et des alertes d&apos;inactivité.
        </p>
        <button
          onClick={() => setCreatePairingOpen(true)}
          className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90"
        >
          + Créer un binôme
        </button>
      </div>

      <Card title="Binômes">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Mentée</th>
                <th className="py-3">Mentore</th>
                <th className="py-3">Programme</th>
                <th className="py-3">Sessions réalisées</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {pairings.map((p) => (
                <tr key={p.id}>
                  <td className="py-4 font-medium text-stf-navy dark:text-white">{p.mentee.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{p.mentor?.name ?? "—"}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{p.program.name}</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{p.sessions_realisees_count ?? 0}</td>
                  <td className="py-4">
                    <Badge tone={p.status === "actif" ? "green" : p.status === "termine" ? "neutral" : "orange"}>
                      {statusLabel(p.status)}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSessionModal({ pairingId: p.id })}
                        className="text-xs font-semibold text-stf-blue hover:text-stf-orange"
                      >
                        + Session
                      </button>
                      <button
                        onClick={() => setEditingPairing(p)}
                        className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeletePairing(p.id)}
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

      <Card title="Sessions">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-border-subtle dark:text-slate-500">
                <th className="py-3">Binôme</th>
                <th className="py-3">Date</th>
                <th className="py-3">Sujet</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-subtle">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    Aucune session planifiée.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-4 font-medium text-stf-navy dark:text-white">
                      {s.pairing.mentee.name} ⇄ {s.pairing.mentor?.name ?? "—"}
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{formatDateTime(s.scheduled_at)}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{s.topic ?? "—"}</td>
                    <td className="py-4">
                      <Badge
                        tone={
                          s.status === "realisee"
                            ? "green"
                            : s.status === "annulee"
                              ? "red"
                              : s.status === "confirmee"
                                ? "blue"
                                : "orange"
                        }
                      >
                        {statusLabel(s.status)}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {s.status === "en_attente" ? (
                          <button
                            disabled={pending}
                            onClick={() => handleSessionStatus(s.id, "confirmee")}
                            className="text-xs font-semibold text-stf-blue hover:text-stf-orange"
                          >
                            Confirmer
                          </button>
                        ) : null}
                        {s.status !== "realisee" && s.status !== "annulee" ? (
                          <button
                            disabled={pending}
                            onClick={() => handleSessionStatus(s.id, "realisee")}
                            className="text-xs font-semibold text-stf-green hover:text-stf-orange"
                          >
                            Marquer réalisée
                          </button>
                        ) : null}
                        {s.status !== "annulee" && s.status !== "realisee" ? (
                          <button
                            disabled={pending}
                            onClick={() => handleSessionStatus(s.id, "annulee")}
                            className="text-xs font-semibold text-slate-500 hover:text-stf-orange dark:text-slate-300"
                          >
                            Annuler
                          </button>
                        ) : null}
                        <button
                          disabled={pending}
                          onClick={() => handleDeleteSession(s.id)}
                          className="text-xs font-semibold text-stf-red hover:text-stf-orange"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={createPairingOpen} onClose={() => setCreatePairingOpen(false)} title="Créer un binôme">
        <form action={handleCreatePairing} className="space-y-5">
          <Field label="Mentée">
            <select required name="mentee_id" defaultValue="" className={fieldInputClass}>
              <option value="" disabled>
                Choisir une mentée
              </option>
              {mentees.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Programme">
            <select required name="program_id" defaultValue="" className={fieldInputClass}>
              <option value="" disabled>
                Choisir un programme
              </option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cohorte (optionnel)">
              <select name="cohort_id" defaultValue="" className={fieldInputClass}>
                <option value="">Aucune</option>
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.program?.name ? `${c.program.name} — ${c.name}` : c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mentore (optionnel)">
              <select name="mentor_id" defaultValue="" className={fieldInputClass}>
                <option value="">À déterminer (matching)</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreatePairingOpen(false)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
            >
              Créer le binôme
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editingPairing !== null} onClose={() => setEditingPairing(null)} title="Modifier le binôme">
        {editingPairing ? (
          <form action={handleUpdatePairing} className="space-y-5">
            <Field label="Mentore">
              <select name="mentor_id" defaultValue={editingPairing.mentor_id ?? ""} className={fieldInputClass}>
                <option value="">Aucune</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Statut">
              <select name="status" defaultValue={editingPairing.status} className={fieldInputClass}>
                {pairingStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingPairing(null)}
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

      <Modal open={sessionModal !== null} onClose={() => setSessionModal(null)} title="Planifier une session">
        {sessionModal ? (
          <form action={handleCreateSession} className="space-y-5">
            <input type="hidden" name="pairing_id" value={sessionModal.pairingId} />
            <Field label="Date et heure">
              <input required type="datetime-local" name="scheduled_at" className={fieldInputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Durée (minutes)">
                <input type="number" name="duration_minutes" min={15} max={240} defaultValue={60} className={fieldInputClass} />
              </Field>
              <Field label="Lien ou lieu">
                <input name="location_or_link" placeholder="Visioconférence, adresse…" className={fieldInputClass} />
              </Field>
            </div>
            <Field label="Sujet">
              <input name="topic" placeholder="Ex. Point d'étape mensuel" className={fieldInputClass} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSessionModal(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-border-default dark:text-slate-300 dark:hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-stf-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-stf-orange/90 disabled:opacity-50"
              >
                Planifier
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
